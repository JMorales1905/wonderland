'use client'

import React, { useEffect, useState } from "react"
import { ArrowLeft, Edit2, Loader2, MapPin, Plus, Save, Search, Trash2, X } from "lucide-react"

interface Plot {
    _id: string;
    description: string;
    beginning?: string;
    middle?: string;
    end?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface PlotFormData {
    description: string;
    beginning: string;
    middle: string;
    end: string;
}

export default function PlotTemplate() {
    const [plot, setPlot] = useState<Plot[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<PlotFormData>({
        description: '',
        beginning: '',
        middle: '',
        end: ''
    });

    useEffect(() => {
        fetchPlot();
    }, []);

    const fetchPlot = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/plot');

            if (!res.ok) {
                throw new Error('Failed to fetch plot');
            }

            const data = await res.json();
            setPlot(data.plot || []);
        } catch (error) {
            console.error('Error fetching plot:', error);
            setError('Failed to load plot. Please try again.');
        } finally {
            setLoading(false)
        }
    };

    const resetForm = () => {
        setFormData({
            description: '',
            beginning: '',
            middle: '',
            end: ''
        });
        setEditingPlot(null);
    };

    const handleOpenModal = (plot?: Plot) => {
        if (plot) {
            setEditingPlot(plot);
            setFormData({
                description: '',
                beginning: '',
                middle: '',
                end: ''
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
                ? `/api/plot/${editingPlot._id}`
                : '/api/plot';

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

            await fetchPlot();
            handleCloseModal();
        } catch (error: any) {
            console.error('Error saving plot:', error);
            setError(error.message || 'Failed to save plot. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plot?')) {
            return;
        }

        try {
            setError(null);
            const res = await fetch(`/api/plot/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete plot');
            }

            await fetchPlot();
        } catch (error: any) {
            console.error('Error deleting plot:', error);
            setError(error.message || 'Failed to delete plot. Please try again.');
        }
    };

    const filteredPlot = plot.filter(plot =>
        plot.description.toLowerCase().includes(searchQuery.toLowerCase())
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
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-white">Plot</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Plot</span>
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
                            placeholder="Search plot by name, type, or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
                        <p className="text-slate-400">Loading plot...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPlot.map((plot) => (
                                <div
                                    key={plot._id}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {plot.description.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{plot.description}</h3>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(plot)}
                                                className="p-2 text-slate-400 hover:text-green-400 transition-colors"
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
                                        <p className="text-slate-300 text-sm line-clamp-3">{plot.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredPlot.length === 0 && !loading && (
                            <div className="text-center py-16">
                                <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-400 mb-2">No plot found</h3>
                                <p className="text-slate-500">
                                    {searchQuery ? 'Try a different search term' : 'Create your first place to get started'}
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
                                {editingPlot ? 'Edit Plot' : 'New Plot'}
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
                                    <MapPin className="w-5 h-5 text-green-400" />
                                    <span>Basic Information</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Description*
                                        </label>
                                        <textarea
                                            name="description"
                                            placeholder="A brief description of your plot"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                            rows={3}
                                            required
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Beginning
                                    </label>
                                    <textarea
                                        name="beginning"
                                        value={formData.beginning}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Protagonist(s) is introduced with setting"
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Middle
                                    </label>
                                    <textarea
                                        name="middle"
                                        value={formData.middle}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Charater(s) fight against the antagonist(s)"
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        End
                                    </label>
                                    <textarea
                                        name="end"
                                        value={formData.end}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Protagonist(s) defeats Antagonist(s)"
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                        disabled={saving}
                                    />
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
                                    disabled={!formData.description || !formData.beginning || !formData.middle || !formData.end || saving}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>
            )}
        </div>
    )
}
