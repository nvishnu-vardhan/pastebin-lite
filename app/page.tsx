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
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const body: any = { content: content.trim() };
      
      if (ttlSeconds) {
        const ttl = parseInt(ttlSeconds);
        if (ttl < 1) {
          setError('TTL must be at least 1 second');
          setLoading(false);
          return;
        }
        body.ttlSeconds = ttl;
      }
      
      if (maxViews) {
        const views = parseInt(maxViews);
        if (views < 1) {
          setError('Max views must be at least 1');
          setLoading(false);
          return;
        }
        body.maxViews = views;
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to create paste');
        return;
      }

      setSuccess(true);
      const data = await response.json();
      setTimeout(() => {
        router.push(`/p/${data.id}`);
      }, 500);
    } catch (err) {
      setError('Failed to create paste. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">Pastebin Lite</h1>
            <p className="text-xl text-gray-300 mb-2">
              Share text pastes with optional expiry by TTL and view count
            </p>
            <p className="text-sm text-gray-400">Built with Next.js, TypeScript, and PostgreSQL</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-900/50 border border-green-700 text-green-200 p-4 rounded-lg">
                  ✓ Paste created! Redirecting...
                </div>
              )}

              <div>
                <label className="block text-white font-semibold mb-2">
                  Paste Content <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="Enter your paste content here..."
                  className="w-full h-64 p-4 bg-slate-900 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
                <p className="text-gray-400 text-sm mt-1">{content.length} characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    TTL (Time-To-Live in seconds)
                  </label>
                  <input
                    type="number"
                    value={ttlSeconds}
                    onChange={(e) => setTtlSeconds(e.target.value)}
                    min="1"
                    placeholder="e.g., 3600"
                    className="w-full p-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-gray-400 text-sm mt-1">Optional: paste expires after this duration</p>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Max Views
                  </label>
                  <input
                    type="number"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    min="1"
                    placeholder="e.g., 5"
                    className="w-full p-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-gray-400 text-sm mt-1">Optional: paste expires after X views</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition duration-200"
              >
                {loading ? '⏳ Creating Paste...' : '✨ Create Paste'}
              </button>
            </form>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">🚀 How it works:</h2>
              <ul className="space-y-2 text-sm">
                <li>✓ Enter your paste content</li>
                <li>✓ Optionally set TTL for auto-expiry</li>
                <li>✓ Optionally limit max views</li>
                <li>✓ Get a unique shareable link</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">📋 API Endpoints:</h2>
              <ul className="space-y-2 text-sm">
                <li>🔍 GET /api/healthz</li>
                <li>📝 POST /api/pastes</li>
                <li>📖 GET /api/pastes?id=xyz</li>
                <li>🌐 GET /p/xyz</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
