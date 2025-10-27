'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    ArrowLeft,
    BookOpen,
    FileText,
    Loader2
} from 'lucide-react';

interface Plot {
    _id: string;
    title: string;
    chapter?: string;
    type: string;
    description: string;
    timeframe?: string;
    location?: string;
    characters?: string;
    significance?: string;
    conflicts?: string;
    resolution?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface PlotFormData {
    title: string;
    chapter: string;
    type: string;
    description: string;
    timeframe: string;
    location: string;
    characters: string;
    significance: string;
    conflicts: string;
    resolution: string;
    notes: string;
}

export default function PlotTemplate() {
    const [plots, setPlots] = useState<Plot[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<PlotFormData>({
        title: '',
        chapter: '',
        type: '',
        description: '',
        timeframe: '',
        location: '',
        characters: '',
        significance: '',
        conflicts: '',
        resolution: '',
        notes: ''
    });

    useEffect(() => {
        fetchPlots();
    }, []);

    const fetchPlots = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/plots');

            if (!res.ok) {
                throw new Error('Failed to fetch plots');
            }

            const data = await res.json();
            setPlots(data.plots || []);
        } catch (error) {
            console.error('Error fetching plots:', error);
            setError('Failed to load plots. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            chapter: '',
            type: '',
            description: '',
            timeframe: '',
            location: '',
            characters: '',
            significance: '',
            conflicts: '',
            resolution: '',
            notes: ''
        });
        setEditingPlot(null);
    };

    const handleOpenModal = (plot?: Plot) => {
        if (plot) {
            setEditingPlot(plot);
            setFormData({
                title: plot.title || '',
                chapter: plot.chapter || '',
                type: plot.type || '',
                description: plot.description || '',
                timeframe: plot.timeframe || '',
                location: plot.location || '',
                characters: plot.characters || '',
                significance: plot.significance || '',
                conflicts: plot.conflicts || '',
                resolution: plot.resolution || '',
                notes: plot.notes || ''
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);

            const url = editingPlot
                ? `/api/plots/${editingPlot._id}`
                : '/api/plots';

            const method = editingPlot ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save plot');
            }

            await fetchPlots();
            handleCloseModal();
        } catch (error: any) {
            console.error('Error saving plot:', error);
            setError(error.message || 'Failed to save plot. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plot point?')) {
            return;
        }

        try {
            setError(null);
            const res = await fetch(`/api/plots/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete plot');
            }

            await fetchPlots();
        } catch (error: any) {
            console.error('Error deleting plot:', error);
            setError(error.message || 'Failed to delete plot. Please try again.');
        }
    };

    const filteredPlots = plots.filter(plot =>
        plot.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plot.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plot.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-white">Plot</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Plot Point</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search plot points by title, type, or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                        <p className="text-slate-400">Loading plot points...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPlots.map((plot) => (
                                <div
                                    key={plot._id}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <BookOpen className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-white line-clamp-1">{plot.title}</h3>
                                                    {plot.chapter && (
                                                        <p className="text-slate-400 text-sm">{plot.chapter}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-2">
                                            <button
                                                onClick={() => handleOpenModal(plot)}
                                                className="p-2 text-slate-400 hover:text-purple-400 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plot._id)}
                                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                                            {plot.type}
                                        </span>
                                        <p className="text-slate-300 text-sm line-clamp-3">{plot.description}</p>

                                        {plot.timeframe && (
                                            <div className="pt-3 border-t border-slate-700">
                                                <p className="text-slate-500 text-xs mb-1">Timeframe</p>
                                                <p className="text-slate-400 text-sm">{plot.timeframe}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredPlots.length === 0 && !loading && (
                            <div className="text-center py-16">
                                <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-400 mb-2">No plot points found</h3>
                                <p className="text-slate-500">
                                    {searchQuery ? 'Try a different search term' : 'Create your first plot point to get started'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingPlot ? 'Edit Plot Point' : 'New Plot Point'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                                disabled={saving}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                    <BookOpen className="w-5 h-5 text-purple-400" />
                                    <span>Basic Information</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            required
                                            disabled={saving}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Chapter/Section
                                        </label>
                                        <input
                                            type="text"
                                            name="chapter"
                                            value={formData.chapter}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Chapter 1, Act 2"
                                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Type *
                                    </label>
                                    <input
                                        type="text"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Inciting Incident, Climax, Resolution"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="What happens in this plot point?"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Timeframe
                                    </label>
                                    <input
                                        type="text"
                                        name="timeframe"
                                        value={formData.timeframe}
                                        onChange={handleInputChange}
                                        placeholder="When does this occur?"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Where does this take place?"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                    <FileText className="w-5 h-5 text-orange-400" />
                                    <span>Details</span>
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Characters Involved
                                    </label>
                                    <textarea
                                        name="characters"
                                        value={formData.characters}
                                        onChange={handleInputChange}
                                        rows={2}
                                        placeholder="Which characters are involved in this plot point?"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Significance
                                    </label>
                                    <textarea
                                        name="significance"
                                        value={formData.significance}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Why is this plot point important to the story?"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Conflicts
                                    </label>
                                    <textarea
                                        name="conflicts"
                                        value={formData.conflicts}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="What conflicts or tensions arise?"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Resolution
                                    </label>
                                    <textarea
                                        name="resolution"
                                        value={formData.resolution}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="How is this resolved or what happens as a result?"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Any additional thoughts or reminders"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={saving}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 px-6 py-4 flex justify-end space-x-3">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!formData.title || !formData.type || !formData.description || saving}
                                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>{editingPlot ? 'Update' : 'Create'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}