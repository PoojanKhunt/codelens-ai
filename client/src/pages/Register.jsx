import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CodeLensLogo from '../components/CodeLensLogo';

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await api.post('/auth/register', form);
            login(res.data);
            navigate('/app');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally { setLoading(false); }
    };

    const inputStyle = {
        width: '100%', padding: '10px 12px',
        border: '1px solid var(--border)', borderRadius: 10,
        background: 'var(--bg-elevated)',
        color: 'var(--text-primary)', fontSize: 14,
        outline: 'none', transition: 'border-color 0.15s',
        fontFamily: 'inherit',
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
            { }

            <nav
                style={{
                    padding: '0 24px',
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border)',
                    background: 'rgba(10,10,10,0.85)',
                    backdropFilter: 'blur(16px)',
                }}
            >
                <Link
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                    }}
                >
                    <CodeLensLogo
                        size={34}
                        showText={true}
                        className="drop-shadow-[0_0_20px_rgba(124,106,245,0.18)]"
                    />
                </Link>
            </nav>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div className="animate-fade-up" style={{ width: '100%', maxWidth: 380 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Create your account</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Start exploring your codebases with AI</p>

                    {error && (
                        <div style={{
                            padding: '10px 12px', borderRadius: 10, marginBottom: 20,
                            background: 'rgba(244,96,96,0.08)', border: '1px solid rgba(244,96,96,0.2)',
                            color: '#f46060', fontSize: 13,
                        }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <input
                            type="text" name="name" value={form.name} onChange={handleChange}
                            placeholder="Full name" required style={inputStyle}
                            onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                        <input
                            type="email" name="email" value={form.email} onChange={handleChange}
                            placeholder="Email address" required style={inputStyle}
                            onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                        <input
                            type="password" name="password" value={form.password} onChange={handleChange}
                            placeholder="Password (min 6 chars)" required minLength={6} style={inputStyle}
                            onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                        <button type="submit" disabled={loading} style={{
                            padding: '10px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                            background: loading ? 'var(--bg-elevated)' : 'var(--text-primary)',
                            color: loading ? 'var(--text-muted)' : '#0a0a0a',
                            fontSize: 14, fontWeight: 600, marginTop: 4,
                            transition: 'opacity 0.15s', fontFamily: 'inherit',
                        }}>{loading ? 'Creating account…' : 'Create account'}</button>
                    </form>

                    <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}