import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CodeLensLogo from '../components/CodeLensLogo';

const features = [
    {
        icon: (
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            </svg>
        ),
        label: 'AST Parsing',
        value: 'Tree-sitter',
        desc: 'Deep syntax analysis across languages'
    },
    {
        icon: (
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
        ),
        label: 'Embeddings',
        value: 'Sentence Transformers',
        desc: 'Semantic vector representations'
    },
    {
        icon: (
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
        ),
        label: 'Vector DB',
        value: 'ChromaDB',
        desc: 'High-performance semantic search'
    },
    {
        icon: (
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
        ),
        label: 'LLM Answers',
        value: 'Gemini API',
        desc: 'Natural language code intelligence'
    },
];

export default function Landing() {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) return <Navigate to="/app" replace />;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            {/* Nav */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 50,
                borderBottom: '1px solid var(--border)',
                background: 'rgba(10,10,10,0.85)',
                backdropFilter: 'blur(16px)',
            }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CodeLensLogo
                            size={34}
                            showText={true}
                            className="drop-shadow-[0_0_20px_rgba(124,106,245,0.18)]"
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link to="/login" style={{
                            padding: '6px 14px', borderRadius: 8,
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                            fontSize: 13, fontWeight: 500, textDecoration: 'none',
                            transition: 'color 0.15s, border-color 0.15s',
                        }}
                            onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.borderColor = 'var(--border-focus)'; }}
                            onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.borderColor = 'var(--border)'; }}
                        >Log in</Link>
                        <Link to="/register" style={{
                            padding: '6px 14px', borderRadius: 8,
                            background: 'var(--text-primary)',
                            color: '#0a0a0a',
                            fontSize: 13, fontWeight: 600, textDecoration: 'none',
                            transition: 'opacity 0.15s',
                        }}
                            onMouseEnter={e => e.target.style.opacity = '0.88'}
                            onMouseLeave={e => e.target.style.opacity = '1'}
                        >Get started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            {/* Hero */}
            <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px' }}>

                <div className="animate-fade-up-1" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 12px',
                    borderRadius: 100,
                    border: '1px solid rgba(124,106,245,0.3)',
                    background: 'rgba(124,106,245,0.08)',
                    color: '#a89cf7',
                    fontSize: 12,
                    fontWeight: 500,
                    marginBottom: 32,
                }}>
                    <span
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#7c6af5',
                            display: 'inline-block',
                        }}
                    />
                    Semantic Code Search · RAG · AST Analysis
                </div>

                <h1 className="animate-fade-up-2" style={{
                    fontSize: 'clamp(40px, 6vw, 72px)',
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: '-0.03em',
                    marginBottom: 24,
                    maxWidth: 720,
                }}>
                    Understand any<br />
                    <span style={{ color: 'var(--accent)' }}>codebase instantly.</span>
                </h1>

                <p className="animate-fade-up-3" style={{
                    fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7,
                    maxWidth: 480, marginBottom: 40,
                }}>
                    Upload a repository, index it with Tree-sitter and ChromaDB, then ask natural-language questions about architecture, symbols, and implementation details.
                </p>

                <div className="animate-fade-up-4" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 80 }}>
                    <Link to="/register" style={{
                        padding: '10px 20px', borderRadius: 10,
                        background: 'var(--text-primary)', color: '#0a0a0a',
                        fontSize: 14, fontWeight: 600, textDecoration: 'none',
                        transition: 'opacity 0.15s',
                    }}
                        onMouseEnter={e => e.target.style.opacity = '0.88'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                    >Start for free →</Link>
                    <Link to="/login" style={{
                        padding: '10px 20px', borderRadius: 10,
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        fontSize: 14, fontWeight: 500, textDecoration: 'none',
                        transition: 'color 0.15s, border-color 0.15s',
                    }}
                        onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.borderColor = 'var(--border-focus)'; }}
                        onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.borderColor = 'var(--border)'; }}
                    >Sign in</Link>
                </div>

                {/* Feature Cards */}
                <div className="animate-fade-up-5" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 1,
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: 'var(--border)',
                }}>
                    {features.map((f) => (
                        <div key={f.label} style={{
                            background: 'var(--bg-surface)',
                            padding: '20px 22px',
                        }}>
                            <div style={{ color: 'var(--text-muted)', marginBottom: 10 }}>{f.icon}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{f.label}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{f.value}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
