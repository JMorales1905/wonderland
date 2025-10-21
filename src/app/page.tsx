'use client'

import React, { useState } from 'react';
import Link from 'next/link';


export default function NarrativeWikiDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentActivity] = useState([
    { type: 'character', name: 'John Doe', updated: '2 hours ago' },
    { type: 'place', name: 'The Old Library', updated: '5 hours ago' },
    { type: 'plot', name: 'Chapter 3: The Revelation', updated: '1 day ago' }
  ]);

  const [stats] = useState({
    characters: 12,
    places: 8,
    plotPoints: 15
  });

  const templateCards = [
    {
      title: 'Characters',
      description: 'Create and manage character profiles, backgrounds, and relationships',
      count: stats.characters,
      color: 'from-blue-500 to-blue-600',
      action: '/templates/characters'
    },
    {
      title: 'Places',
      description: 'Document locations, settings, and world-building details',
      count: stats.places,
      color: 'from-green-500 to-green-600',
      action: '/templates/places'
    },
    {
      title: 'Plot',
      description: 'Outline key events, story arcs, and narrative structure',
      count: stats.plotPoints,
      color: 'from-purple-500 to-purple-600',
      action: '/templates/plot'
    }
  ];

  const handleSearch = (e: any) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const getActivityIcon = (type: any) => {
    switch (type) {
      case 'character': return <div className="w-4 h-4" />;
      case 'place': return <div className="w-4 h-4" />;
      case 'plot': return <div className="w-4 h-4" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 text-indigo-400" />
              <h1 className="text-2xl font-bold text-white">Narrative Wiki</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
                Settings
              </button>
              <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-10">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search characters, places, plots, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </form>
        </div>

        {/* Template Cards */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-6">Your Narrative Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templateCards.map((card, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{card.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">{card.count} entries</span>
                  <Link
                    href={card.action}
                    className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <div className="w-4 h-4" />
                    <span className="text-sm">Add New</span>
                  </Link>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{activity.name}</p>
                      <p className="text-slate-400 text-sm capitalize">{activity.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500 text-sm">
                    < div className="w-4 h-4" />
                    <span>{activity.updated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 text-sm font-medium">Characters</span>
                  <div className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.characters}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-400 text-sm font-medium">Places</span>
                  <div className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.places}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-400 text-sm font-medium">Plot Points</span>
                  <div className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.plotPoints}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}