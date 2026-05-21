import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CodeLensLogo from './CodeLensLogo';

const statusColors = {
    indexed: 'var(--green)',
    indexing: 'var(--yellow)',
    error: 'var(--red)',
};

const SearchIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
    </svg>
);

const PlusIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);

const TrashIcon = () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default function Sidebar({ projects = [], selectedProject, onSelectProject, onNewProject, onDeleteProject, loading }) {
    const { user, logout } = useAuth();
    const [search, setSearch] = useState('');
    const [hoveredId, setHoveredId] = useState(null);

    const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    const initials = (name = 'U') => name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

    return (
        <aside style={{
            width: 240, flexShrink: 0,
            height: '100vh', display: 'flex', flexDirection: 'column',
            background: 'var(--bg-surface)',
            borderRight: '1px solid var(--border)',
        }}>
            {/* Brand */}
            <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid var(--border)' }}>
                <CodeLensLogo size={42} className="mb-4" />
                <button
                    onClick={onNewProject}
                    style={{
                        width: '100%', padding: '8px 12px', borderRadius: 10,
                        border: '1px solid var(--border)', background: 'transparent',
                        color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: 6, fontFamily: 'inherit',
                        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-focus)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                    <PlusIcon /> New project
                </button>
            </div>

            {/* Search */}
            <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                        <SearchIcon />
                    </div>
                    <input
                        type="text" placeholder="Search projects…" value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', padding: '6px 8px 6px 30px',
                            borderRadius: 7, border: '1px solid var(--border)',
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-primary)', fontSize: 12,
                            outline: 'none', fontFamily: 'inherit',
                            transition: 'border-color 0.15s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                </div>
            </div>

            {/* Projects */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
                {loading ? (
                    <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Loading…</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                        {search ? 'No projects match.' : 'No projects yet.'}
                    </div>
                ) : (
                    filtered.map(project => {
                        const isSelected = selectedProject?._id === project._id;
                        const isHovered = hoveredId === project._id;
                        return (
                            <div
                                key={project._id}
                                style={{ position: 'relative' }}
                                onMouseEnter={() => setHoveredId(project._id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <button
                                    onClick={() => onSelectProject(project)}
                                    style={{
                                        width: '100%', padding: '8px 10px', borderRadius: 8, marginBottom: 2,
                                        background: isSelected ? 'var(--bg-elevated)' : isHovered ? 'var(--bg-hover)' : 'transparent',
                                        border: 'none', cursor: 'pointer', textAlign: 'left',
                                        color: isSelected || isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        transition: 'background 0.12s, color 0.12s',
                                        fontFamily: 'inherit',
                                        paddingRight: 32, // space for delete button
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{
                                            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                                            background: statusColors[project.status] || 'var(--text-muted)',
                                        }} />
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.name}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{project.language || 'Unknown'}</div>
                                        </div>
                                    </div>
                                </button>

                                {/* Delete button - shows on hover */}
                                {isHovered && (
                                    <button
                                        onClick={e => { e.stopPropagation(); onDeleteProject(project._id); }}
                                        title="Delete project"
                                        style={{
                                            position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                                            width: 22, height: 22, borderRadius: 5,
                                            border: '1px solid var(--border)', background: 'var(--bg-surface)',
                                            color: 'var(--red)', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                                    >
                                        <TrashIcon />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* User */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0,
                    }}>{initials(user?.name)}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                    </div>
                </div>
                <button onClick={logout} style={{
                    width: '100%', padding: '6px 10px', borderRadius: 7,
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontFamily: 'inherit', transition: 'color 0.15s, border-color 0.15s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-focus)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                    <LogoutIcon /> Sign out
                </button>
            </div>
        </aside>
    );
}