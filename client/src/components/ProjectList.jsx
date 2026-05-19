import ChatPanel from './ChatPanel';

function ProjectList({ projects }) {
    if (!projects || projects.length === 0) {
        return <p>No projects yet.</p>;
    }

    return (
        <div>
            <h2>Projects</h2>

            {projects.map((project) => (
                <div
                    key={project._id}
                    style={{
                        border: '1px solid #ccc',
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '8px',
                        backgroundColor: '#fafafa',
                    }}
                >
                    {/* Project Name */}
                    <h3>{project.name}</h3>

                    {/* Description */}
                    {project.description && <p>{project.description}</p>}

                    {/* GitHub Repository Link */}
                    {project.githubUrl && (
                        <p>
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                GitHub Repository
                            </a>
                        </p>
                    )}

                    {/* Programming Language */}
                    {project.language && (
                        <p>
                            <strong>Language:</strong> {project.language}
                        </p>
                    )}

                    {/* Current Status */}
                    <p>
                        <strong>Status:</strong> {project.status}
                    </p>

                    {/* Creation Date */}
                    {project.createdAt && (
                        <p>
                            <small>
                                Created:{' '}
                                {new Date(project.createdAt).toLocaleString()}
                            </small>
                        </p>
                    )}

                    {/* Phase 6: RAG Search Chat Panel */}
                    <ChatPanel projectId={project._id} />
                </div>
            ))}
        </div>
    );
}

export default ProjectList;