import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import ProjectForm from '../components/ProjectForm';
import api from '../services/api';

export default function Workspace() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatHistories, setChatHistories] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('codelens_chat_histories') || '{}');
        } catch { return {}; }
    });
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingChat, setLoadingChat] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);

    useEffect(() => {
        localStorage.setItem('codelens_chat_histories', JSON.stringify(chatHistories));
    }, [chatHistories]);

    useEffect(() => { fetchProjects(); }, []);

    useEffect(() => {
        if (selectedProject) {
            setMessages(chatHistories[selectedProject._id] || []);
        }
    }, [selectedProject?._id]);

    const fetchProjects = async () => {
        try {
            setLoadingProjects(true);
            const res = await api.get('/projects');
            const list = res.data || [];
            setProjects(list);
            if (!selectedProject && list.length > 0) setSelectedProject(list[0]);
        } catch (e) { console.error(e); }
        finally { setLoadingProjects(false); }
    };

    const handleSend = async (query) => {
        if (!selectedProject || !query.trim()) return;
        const userMsg = { role: 'user', content: query };
        const projectId = selectedProject._id;
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setChatHistories(prev => ({ ...prev, [projectId]: updatedMessages }));
        setLoadingChat(true);
        try {
            const res = await api.post('/chat', { query, projectId, history: messages.slice(-6) });
            const aiMsg = { role: 'assistant', content: res.data.answer || 'No response generated.' };
            const finalMessages = [...updatedMessages, aiMsg];
            setMessages(finalMessages);
            setChatHistories(prev => ({ ...prev, [projectId]: finalMessages }));
        } catch {
            const errMsg = { role: 'assistant', content: 'An error occurred.' };
            const finalMessages = [...updatedMessages, errMsg];
            setMessages(finalMessages);
            setChatHistories(prev => ({ ...prev, [projectId]: finalMessages }));
        } finally { setLoadingChat(false); }
    };

    const handleSelectProject = (project) => {
        setSelectedProject(project);
        setMessages(chatHistories[project._id] || []);
    };

    // DELETE PROJECT
    const handleDeleteProject = async (projectId) => {
        if (!confirm('Delete this project and all its data?')) return;
        try {
            await api.delete(`/projects/${projectId}`);
            // remove from chat histories
            setChatHistories(prev => {
                const next = { ...prev };
                delete next[projectId];
                return next;
            });
            // if deleted project was selected, clear it
            if (selectedProject?._id === projectId) {
                setSelectedProject(null);
                setMessages([]);
            }
            fetchProjects();
        } catch (e) { console.error(e); }
    };

    // CLEAR CHAT
    const handleClearChat = (projectId) => {
        setMessages([]);
        setChatHistories(prev => ({ ...prev, [projectId]: [] }));
    };

    return (
        <div style={{ height: '100vh', display: 'flex', background: 'var(--bg-base)', overflow: 'hidden' }}>
            <Sidebar
                projects={projects}
                selectedProject={selectedProject}
                onSelectProject={handleSelectProject}
                onNewProject={() => setShowProjectModal(true)}
                onDeleteProject={handleDeleteProject}
                loading={loadingProjects}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {selectedProject && (
                    <div style={{
                        height: 44, borderBottom: '1px solid var(--border)',
                        padding: '0 20px', display: 'flex', alignItems: 'center', gap: 10,
                        background: 'var(--bg-base)',
                    }}>
                        <span style={{
                            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                            background: selectedProject.status === 'indexed' ? 'var(--green)' :
                                selectedProject.status === 'indexing' ? 'var(--yellow)' :
                                    selectedProject.status === 'error' ? 'var(--red)' : 'var(--text-muted)',
                        }} />
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{selectedProject.name}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {selectedProject.language}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto', textTransform: 'capitalize' }}>{selectedProject.status}</span>
                        {/* Clear chat button */}
                        <button
                            onClick={() => handleClearChat(selectedProject._id)}
                            title="Clear chat"
                            style={{
                                marginLeft: 8, padding: '3px 8px', borderRadius: 6,
                                border: '1px solid var(--border)', background: 'transparent',
                                color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-focus)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                        >
                            Clear chat
                        </button>
                    </div>
                )}
                <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                    <ChatWindow
                        selectedProject={selectedProject}
                        messages={messages}
                        loading={loadingChat}
                        onSuggestionClick={handleSend}
                    />
                </div>
                {selectedProject && (
                    <div style={{ background: 'var(--bg-base)', paddingTop: 12 }}>
                        <ChatInput onSend={handleSend} disabled={loadingChat} />
                    </div>
                )}
            </div>
            {showProjectModal && (
                <ProjectForm
                    onClose={() => setShowProjectModal(false)}
                    onProjectCreated={() => { setShowProjectModal(false); fetchProjects(); }}
                />
            )}
        </div>
    );
}