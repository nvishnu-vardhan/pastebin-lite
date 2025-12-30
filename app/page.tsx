'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Pastebin Lite</h1>
          <p className="text-xl text-gray-300 mb-8">
            Share text pastes with optional expiry by TTL and view count
          </p>
          <div className="bg-slate-700 rounded-lg p-8 mb-8">
            <p className="text-gray-300 mb-4">Welcome to Pastebin Lite</p>
            <p className="text-sm text-gray-400">
              A modern paste-sharing application built with Next.js, TypeScript, and PostgreSQL
            </p>
          </div>
          <p className="text-sm text-gray-400">
            Navigate to explore the application
          </p>
        </div>
      </div>
    </main>
  );
}
