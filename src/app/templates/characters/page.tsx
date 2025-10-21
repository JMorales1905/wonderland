'use client';

import React, { useState, useEffect } from 'react';


interface Character {
    _id: string;
    name: string;
    age?: number;
    role: string;
    description: string;
    background?: string;
    personality?: string;
    appearance?: string;
    relationships?: string;
    motivations?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface CharacterFormData {
    name: string;
    age: string;
    role: string;
    description: string;
    background: string;
    personality: string;
    appearance: string;
    relationships: string;
    motivations: string;
}

export default function CharactersTemplate() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<CharacterFormData>({
        name: '',
        age: '',
        role: '',
        description: '',
        background: '',
        personality: '',
        appearance: '',
        relationships: '',
        motivations: ''
    });

    // Fetch characters on component mount
    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/characters');

            if (!res.ok) {
                throw new Error('Failed to fetch characters');
            }

            const data = await res.json();
            setCharacters(data.characters || []);
        } catch (error) {
            console.error('Error fetching characters:', error);
            setError('Failed to load characters. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            age: '',
            role: '',
            description: '',
            background: '',
            personality: '',
            appearance: '',
            relationships: '',
            motivations: ''
        });
        setEditingCharacter(null);
    };

    const handleOpenModal = (character?: Character) => {
        if (character) {
            setEditingCharacter(character);
            setFormData({
                name: character.name,
                age: character.age?.toString() || '',
                role: character.role,
                description: character.description,
                background: character.background || '',
                personality: character.personality || '',
                appearance: character.appearance || '',
                relationships: character.relationships || '',
                motivations: character.motivations || ''
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

            const url = editingCharacter
                ? `/api/characters/${editingCharacter._id}`
                : '/api/characters';

            const method = editingCharacter ? 'PUT' : 'POST';

            // Prepare data to send
            const dataToSend = {
                ...formData,
                age: formData.age ? parseInt(formData.age) : undefined
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save character');
            }

            await fetchCharacters(); // Refresh the list
            handleCloseModal();
        } catch (error: any) {
            console.error('Error saving character:', error);
            setError(error.message || 'Failed to save character. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this character?')) {
            return;
        }

        try {
            setError(null);
            const res = await fetch(`/api/characters/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete character');
            }

            await fetchCharacters(); // Refresh the list
        } catch (error: any) {
            console.error('Error deleting character:', error);
            setError(error.message || 'Failed to delete character. Please try again.');
        }
    };

    const filteredCharacters = characters.filter(char =>
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <div className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <div className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-white">Characters</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <div className="w-4 h-4" />
                            <span>New Character</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search characters by name, role, or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-slate-400">Loading characters...</p>
                    </div>
                ) : (
                    <>
                        {/* Characters Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCharacters.map((character) => (
                                <div
                                    key={character._id}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {character.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{character.name}</h3>
                                                {character.age && (
                                                    <p className="text-slate-400 text-sm">{character.age} years old</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(character)}
                                                className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                                            >
                                                <div className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(character._id)}
                                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                            >
                                                <div className="w-4 h-4 bg-amber-500" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                                {character.role}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 text-sm line-clamp-3">{character.description}</p>

                                        {character.personality && (
                                            <div className="pt-3 border-t border-slate-700">
                                                <p className="text-slate-500 text-xs mb-1">Personality</p>
                                                <p className="text-slate-400 text-sm line-clamp-2">{character.personality}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredCharacters.length === 0 && !loading && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-400 mb-2">No characters found</h3>
                                <p className="text-slate-500">
                                    {searchQuery ? 'Try a different search term' : 'Create your first character to get started'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingCharacter ? 'Edit Character' : 'New Character'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                                disabled={saving}
                            >
                                <div className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Error in Modal */}
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                    <div className="w-5 h-5 text-blue-400" />
                                    <span>Basic Information</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            disabled={saving}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Role *
                                    </label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Protagonist, Antagonist, Supporting Character"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            {/* Detailed Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                    <div className="w-5 h-5 text-green-400" />
                                    <span>Details</span>
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Background
                                    </label>
                                    <textarea
                                        name="background"
                                        value={formData.background}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Character's history and origin story"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Personality
                                    </label>
                                    <textarea
                                        name="personality"
                                        value={formData.personality}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Character traits, quirks, and behavior patterns"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Appearance
                                    </label>
                                    <textarea
                                        name="appearance"
                                        value={formData.appearance}
                                        onChange={handleInputChange}
                                        rows={2}
                                        placeholder="Physical description and distinguishing features"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Relationships
                                    </label>
                                    <textarea
                                        name="relationships"
                                        value={formData.relationships}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Connections with other characters"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Motivations & Goals
                                    </label>
                                    <textarea
                                        name="motivations"
                                        value={formData.motivations}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="What drives this character? What do they want?"
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                disabled={!formData.name || !formData.role || !formData.description || saving}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-4 h-4" />
                                        <span>{editingCharacter ? 'Update' : 'Create'}</span>
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