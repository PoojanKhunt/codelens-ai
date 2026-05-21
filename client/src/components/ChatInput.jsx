import { useState, useRef, useEffect } from 'react';

const SendIcon = ({ disabled }) => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
        style={{ color: disabled ? 'var(--text-muted)' : 'var(--text-primary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

export default function ChatInput({ onSend, disabled = false }) {
    const [query, setQuery] = useState('');
    const textareaRef = useRef(null);

    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    };

    useEffect(() => { autoResize(); }, [query]);

    const handleSubmit = () => {
        const trimmed = query.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setQuery('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    return (
        <div style={{ padding: '0 24px 20px' }}>
            <div style={{
                maxWidth: 700, margin: '0 auto',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '10px 10px 10px 14px',
                display: 'flex', alignItems: 'flex-end', gap: 8,
                transition: 'border-color 0.15s',
            }}
                onFocus={() => { }}
            >
                <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Ask anything about this codebase…"
                    rows={1}
                    style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.5,
                        resize: 'none', fontFamily: 'inherit',
                        minHeight: 24, maxHeight: 160,
                        overflowY: 'auto',
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                />
                <button
                    onClick={handleSubmit}
                    disabled={!query.trim() || disabled}
                    style={{
                        width: 32, height: 32, borderRadius: 8, border: 'none',
                        background: query.trim() && !disabled ? 'var(--bg-elevated)' : 'var(--bg-elevated)',
                        cursor: query.trim() && !disabled ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.15s', flexShrink: 0,
                    }}
                    onMouseEnter={e => { if (query.trim() && !disabled) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                >
                    <SendIcon disabled={!query.trim() || disabled} />
                </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 8, maxWidth: 700, margin: '8px auto 0' }}>
                Press Enter to send · Shift+Enter for new line
            </p>
        </div>
    );
}
