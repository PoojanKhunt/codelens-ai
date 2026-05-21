
import { useState } from 'react';
import api from '../services/api';

function ChatPanel({ projectId }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setResults([]);
        setAnswer('');

        try {
            const res = await api.post('/chat', { query, projectId });
            setAnswer(res.data.answer || '');
            setResults(res.data.results || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold">Ask About This Codebase</h4>

            <div className="flex gap-3">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Where is the authentication logic implemented?"
                    className="flex-1 rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-3 text-white placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-semibold"
                >
                    {loading ? 'Thinking...' : 'Ask AI'}
                </button>
            </div>

            {answer && (
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-gray-200">
                        {answer}
                    </p>
                </div>
            )}

            {results.length > 0 && (
                <div className="space-y-3">
                    {results.map((r, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4"
                        >
                            <div className="font-mono text-cyan-300">{r.name}</div>
                            <div className="text-xs text-[#8b949e] mt-1">{r.type}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ChatPanel;