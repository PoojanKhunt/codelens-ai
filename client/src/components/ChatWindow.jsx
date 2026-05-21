import { useEffect, useRef } from 'react';

const suggestions = [
    'Explain the authentication flow.',
    'How does the RAG pipeline work?',
    'What does cloneRepository() do?',
    'Where is JWT verification implemented?',
];

const BrainIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104l3.495-1.747a1.5 1.5 0 011.342 0l3.495 1.747A1.5 1.5 0 0118.91 4.446v3.495a1.5 1.5 0 01-.829 1.342l-3.495 1.747a1.5 1.5 0 01-1.342 0L9.75 9.283a1.5 1.5 0 01-.829-1.342V4.446a1.5 1.5 0 01.829-1.342zM3 7.5l3 1.5v4.5L3 15M21 7.5l-3 1.5v4.5l3 1.5M12 21v-6" />
    </svg>
);

function MessageContent({ content }) {
    // Render code blocks cleanly
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('```') && part.endsWith('```')) {
                    const lines = part.slice(3, -3).split('\n');
                    const lang = lines[0];
                    const code = lines.slice(1).join('\n');
                    return (
                        <div key={i} style={{ margin: '12px 0' }}>
                            {lang && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'Geist Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lang}</div>}
                            <pre style={{ margin: 0 }}><code>{code}</code></pre>
                        </div>
                    );
                }
                return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
            })}
        </>
    );
}

export default function ChatWindow({ selectedProject, messages, loading, onSuggestionClick }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    if (!messages || messages.length === 0) {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <div style={{ width: '100%', maxWidth: 580, textAlign: 'center' }}>
                        {/* Icon */}
                        <div className="animate-fade-up-1" style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px', color: 'var(--text-secondary)',
                        }}>
                            <BrainIcon />
                        </div>

                        <h2 className="animate-fade-up-2" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
                            {selectedProject ? `Analyzing ${selectedProject.name}` : 'Select a project to begin'}
                        </h2>
                        <p className="animate-fade-up-3" style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
                            Ask questions about architecture, authentication, implementation details, and code structure using AI-powered semantic search.
                        </p>

                        {selectedProject && (
                            <div className="animate-fade-up-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {suggestions.map(s => (
                                    <button key={s} onClick={() => onSuggestionClick?.(s)} style={{
                                        padding: '12px 14px', borderRadius: 10, textAlign: 'left',
                                        border: '1px solid var(--border)', background: 'var(--bg-surface)',
                                        color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.4,
                                        cursor: 'pointer', fontFamily: 'inherit',
                                        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-focus)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                                    >{s}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', overflowY: 'auto' }}>
            <div style={{ maxWidth: 700, width: '100%', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {messages.map((msg, i) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div key={i} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                            {!isUser && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                                    <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>AI</div>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>CodeLens</span>
                                </div>
                            )}
                            <div style={{
                                maxWidth: isUser ? '80%' : '100%',
                                padding: isUser ? '10px 14px' : '14px 18px',
                                borderRadius: isUser ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                                background: isUser ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                                border: '1px solid var(--border)',
                                fontSize: 14, lineHeight: 1.7,
                                color: 'var(--text-primary)',
                            }}>
                                <MessageContent content={msg.content} />
                            </div>
                        </div>
                    );
                })}

                {loading && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>AI</div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>CodeLens</span>
                        </div>
                        <div style={{ padding: '12px 16px', borderRadius: '4px 14px 14px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                            <div className="dot-pulse">
                                <span /><span /><span />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
