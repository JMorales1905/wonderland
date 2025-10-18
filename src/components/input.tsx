'use client';

import { useState, useEffect } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    age?: number;
    createdAt: string;
}

export default function Input() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
    });

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    age: formData.age ? parseInt(formData.age) : undefined,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage('✅ User created successfully!');
                setFormData({ name: '', email: '', age: '' });
                fetchUsers(); // Refresh the user list
            } else {
                setMessage(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            setMessage('❌ Error: Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                    User Management System
                </h1>

                {/* Form Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                        Create New User
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                Age (optional)
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="25"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-4 p-3 rounded-md ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {message}
                        </div>
                    )}
                </div>

                {/* Users List Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                        All Users ({users.length})
                    </h2>

                    {users.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No users yet. Create one above!</p>
                    ) : (
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
                                            <p className="text-gray-600">{user.email}</p>
                                            {user.age && <p className="text-gray-500 text-sm">Age: {user.age}</p>}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}