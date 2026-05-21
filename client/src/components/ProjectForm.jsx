import { useState } from 'react';
import api from '../services/api';

const CloseIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const GithubIcon = () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

export default function ProjectForm({ onClose, onProjectCreated }) {
    const [form, setForm] = useState({ name: '', description: '', githubUrl: '', language: 'JavaScript' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await api.post('/projects', form);
            onProjectCreated?.();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create project.');
        } finally { setLoading(false); }
    };

    const inputStyle = {
        width: '100%', padding: '9px 12px',
        border: '1px solid var(--border)', borderRadius: 9,
        background: 'var(--bg-elevated)',
        color: 'var(--text-primary)', fontSize: 13,
        outline: 'none', fontFamily: 'inherit',
        transition: 'border-color 0.15s',
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="animate-fade-up" style={{
                width: '100%', maxWidth: 440,
                background: 'var(--bg-surface)', borderRadius: 16,
                border: '1px solid var(--border)',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>New project</h2>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Index a GitHub repository for AI analysis</p>
                    </div>
                    <button onClick={onClose} style={{
                        width: 28, height: 28, borderRadius: 7, border: '1px solid var(--border)',
                        background: 'transparent', color: 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    ><CloseIcon /></button>
                </div>

                {/* Body */}
                <div style={{ padding: 20 }}>
                    {error && (
                        <div style={{
                            padding: '9px 12px', borderRadius: 9, marginBottom: 14,
                            background: 'rgba(244,96,96,0.08)', border: '1px solid rgba(244,96,96,0.2)',
                            color: '#f46060', fontSize: 12,
                        }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project name</label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="My Awesome Project" required style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                                placeholder="Brief description of the project…"
                                style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }}
                                onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>GitHub URL</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><GithubIcon /></div>
                                <input type="url" name="githubUrl" value={form.githubUrl} onChange={handleChange}
                                    placeholder="https://github.com/user/repo" required
                                    style={{ ...inputStyle, paddingLeft: 34 }}
                                    onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Language</label>
                            <select name="language" value={form.language} onChange={handleChange}
                                style={{ ...inputStyle, cursor: 'pointer' }}
                                onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            >
                                {['JavaScript', 'TypeScript', 'Python', 'C++', 'Java', 'Go'].map(l => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                            <button type="button" onClick={onClose} style={{
                                flex: 1, padding: '9px', borderRadius: 9, border: '1px solid var(--border)',
                                background: 'transparent', color: 'var(--text-secondary)',
                                fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'background 0.15s, color 0.15s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >Cancel</button>
                            <button type="submit" disabled={loading} style={{
                                flex: 2, padding: '9px', borderRadius: 9, border: 'none',
                                background: loading ? 'var(--bg-elevated)' : 'var(--text-primary)',
                                color: loading ? 'var(--text-muted)' : '#0a0a0a',
                                fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit', transition: 'opacity 0.15s',
                            }}>
                                {loading ? 'Indexing repository…' : 'Create project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
