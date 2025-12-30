import { getPaste } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function ViewPastePage({ params }: { params: { id: string } }) {
  try {
    const paste = await getPaste(params.id);

    if (!paste) {
      notFound();
    }

    const expiresAt = paste.expires_at ? new Date(paste.expires_at) : null;
    const remainingViews = paste.max_views !== null ? paste.max_views - paste.view_count : null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Paste #{params.id}</h1>
            <div className="flex gap-4 text-sm text-gray-400">
              {expiresAt && (
                <span>Expires: {expiresAt.toLocaleString()}</span>
              )}
              {remainingViews !== null && (
                <span>Remaining Views: {remainingViews}</span>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="bg-slate-900 p-4 rounded border border-slate-600 overflow-auto max-h-96">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-words">
                {paste.content}
              </pre>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition">
              Create New Paste
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading paste:', error);
    notFound();
  }
}
