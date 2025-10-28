'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Search, Users, MapPin, BookOpen, Plus, Clock, Loader2, LogOut } from 'lucide-react';

export default function NarrativeWikiDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    type: 'character' | 'place' | 'plot';
    name: string;
    description: string;
    _id: string;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [recentActivity, setRecentActivity] = useState<Array<{
    type: 'character' | 'place' | 'plot';
    name: string;
    updated: string;
    _id: string;
  }>>([]);

  const [stats, setStats] = useState({
    characters: 0,
    places: 0,
    plotPoints: 0
  });

  const [loading, setLoading] = useState(true);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
      fetchRecentActivity();
    }
  }, [status]);

  const fetchRecentActivity = async () => {
    try {
      const [charactersRes, placesRes, plotsRes] = await Promise.all([
        fetch('/api/characters'),
        fetch('/api/places'),
        fetch('/api/plots')
      ]);

      const [charactersData, placesData, plotsData] = await Promise.all([
        charactersRes.json(),
        placesRes.json(),
        plotsRes.json()
      ]);

      const allItems = [
        ...(charactersData.characters || []).map((item: any) => ({
          type: 'character' as const,
          name: item.name,
          updated: item.updatedAt,
          _id: item._id
        })),
        ...(placesData.places || []).map((item: any) => ({
          type: 'place' as const,
          name: item.name,
          updated: item.updatedAt,
          _id: item._id
        })),
        ...(plotsData.plots || []).map((item: any) => ({
          type: 'plot' as const,
          name: item.title,
          updated: item.updatedAt,
          _id: item._id
        }))
      ];

      const sortedItems = allItems
        .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
        .slice(0, 5)
        .map(item => ({
          ...item,
          updated: formatTimeAgo(item.updated)
        }));

      setRecentActivity(sortedItems);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const updated = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  };

  const fetchStats = async () => {
    try {
      setLoading(true);

      const charactersRes = await fetch('/api/characters');
      const charactersData = await charactersRes.json();

      const placesRes = await fetch('/api/places');
      const placesData = await placesRes.json();

      const plotRes = await fetch('/api/plots');
      const plotData = await plotRes.json();

      setStats({
        characters: charactersData.characters?.length || 0,
        places: placesData.places?.length || 0,
        plotPoints: plotData.plots?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const templateCards = [
    {
      icon: Users,
      title: 'Characters',
      description: 'Create and manage character profiles, backgrounds, and relationships',
      count: stats.characters,
      color: 'from-blue-500 to-blue-600',
      action: '/templates/characters'
    },
    {
      icon: MapPin,
      title: 'Places',
      description: 'Document locations, settings, and world-building details',
      count: stats.places,
      color: 'from-green-500 to-green-600',
      action: '/templates/places'
    },
    {
      icon: BookOpen,
      title: 'Plot',
      description: 'Outline key events, story arcs, and narrative structure',
      count: stats.plotPoints,
      color: 'from-purple-500 to-purple-600',
      action: '/templates/plot'
    }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const [charactersRes, placesRes, plotsRes] = await Promise.all([
        fetch(`/api/characters?search=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/places?search=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/plots?search=${encodeURIComponent(searchQuery)}`)
      ]);

      const [charactersData, placesData, plotsData] = await Promise.all([
        charactersRes.json(),
        placesRes.json(),
        plotsRes.json()
      ]);

      const results = [
        ...(charactersData.characters || []).map((item: any) => ({
          type: 'character' as const,
          name: item.name,
          description: item.description,
          _id: item._id
        })),
        ...(placesData.places || []).map((item: any) => ({
          type: 'place' as const,
          name: item.name,
          description: item.description,
          _id: item._id
        })),
        ...(plotsData.plots || []).map((item: any) => ({
          type: 'plot' as const,
          name: item.title,
          description: item.description,
          _id: item._id
        }))
      ];

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const getResultLink = (type: string, id: string) => {
    return `/templates/${type === 'plot' ? 'plot' : type}s`;
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'character': return <Users className="w-5 h-5 text-blue-400" />;
      case 'place': return <MapPin className="w-5 h-5 text-green-400" />;
      case 'plot': return <BookOpen className="w-5 h-5 text-purple-400" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'character': return <Users className="w-4 h-4" />;
      case 'place': return <MapPin className="w-4 h-4" />;
      case 'plot': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-indigo-400" />
              <h1 className="text-2xl font-bold text-white">Narrative Wiki</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">
                {session?.user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-10 relative">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Search characters, places, plots, and more..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </form>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                  <span className="ml-2 text-slate-400">Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((result, index) => (
                    <Link
                      key={`${result.type}-${result._id}-${index}`}
                      href={getResultLink(result.type, result._id)}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
                      onClick={() => setShowSearchResults(false)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-white font-medium truncate">{result.name}</p>
                          <span className="inline-block px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs capitalize flex-shrink-0">
                            {result.type}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{result.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Search className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                  <p>No results found for "{searchQuery}"</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Template Cards */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-6">Your Narrative Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templateCards.map((card, index) => (
              <Link
                key={index}
                href={card.action}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all cursor-pointer group block"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{card.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin inline" />
                    ) : (
                      `${card.count} entries`
                    )}
                  </span>
                  <div className="flex items-center space-x-1 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">View All</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={activity._id || index}
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
                      <Clock className="w-4 h-4" />
                      <span>{activity.updated}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>No recent activity</p>
                <p className="text-sm mt-2">Start creating characters, places, or plot points</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 text-sm font-medium">Characters</span>
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.characters}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-400 text-sm font-medium">Places</span>
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.places}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-400 text-sm font-medium">Plot Points</span>
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.plotPoints}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}