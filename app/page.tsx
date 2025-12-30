'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!content.trim()) {
      setError('Please enter some content for your paste');
      setLoading(false);
      return;
    }

    try {
      const body = { content };
      if (ttlSeconds) body.ttl_seconds = parseInt(ttlSeconds);
      if (maxViews) body.max_views = parseInt(maxViews);

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to create paste');

      const data = await response.json();
      setSuccess('Paste created! Redirecting...');
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
      
      setTimeout(() => {
        router.push(`/p/${data.id}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating paste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">Pastebin Lite</h1>
          <p className="text-slate-400 text-lg">Share text instantly with optional expiry</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur rounded-3xl shadow-2xl p-10 border border-slate-700/50 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Your Paste</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full h-48 p-4 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              />
              <div className="text-xs text-slate-400 mt-2">{content.length} characters</div>
            </div>

            {/* Optional Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Expires in (seconds)</label>
                <input
                  type="number"
                  value={ttlSeconds}
                  onChange={(e) => setTtlSeconds(e.target.value)}
                  placeholder="e.g., 3600"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <div className="text-xs text-slate-500 mt-1">Optional</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Max Views</label>
                <input
                  type="number"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <div className="text-xs text-slate-500 mt-1">Optional</div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-xl">
                <p className="text-red-300 text-sm">⚠️ {error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-900/20 border border-green-700 rounded-xl">
                <p className="text-green-300 text-sm">✓ {success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                '📤 Create & Share Paste'
              )}
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-slate-400 text-sm font-medium">Instant</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-slate-400 text-sm font-medium">Auto-Expiry</p>
          </div>
          <div>
            <div className="text-3xl mb-2">👁️</div>
            <p className="text-slate-400 text-sm font-medium">View Limits</p>
          </div>
        </div>
      </div>
    </div>
  );
}
