import { useState } from 'react';
import api from '../services/api';

function ChatPanel({ projectId }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError('');
        setResults([]);

        try {
            const res = await api.post('/chat', { query, projectId });
            setResults(res.data.results);
        } catch (err) {
            setError('Query failed. Is the Python service running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 border rounded-xl p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Ask about this codebase</h3>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder='e.g. "Where is the sorting function?"'
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            {results.length > 0 && (
                <div className="space-y-2">
                    {results.map((r, i) => (
                        <div key={i} className="bg-white border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="font-mono font-semibold text-blue-700">{r.name}</span>
                                    <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{r.type}</span>
                                </div>
                                <span className="text-xs text-green-600 font-medium">
                                    {(r.score * 100).toFixed(1)}% match
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-mono">
                                {r.filePath} · line {r.startLine}–{r.endLine}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {results.length === 0 && !loading && query && !error && (
                <p className="text-sm text-gray-400">No results found.</p>
            )}
        </div>
    );
}

export default ChatPanel;