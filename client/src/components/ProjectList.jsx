function ProjectList({ projects }) {
    if (projects.length === 0) {
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
                    }}
                >
                    <h3>{project.name}</h3>

                    {project.description && <p>{project.description}</p>}

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

                    {project.language && (
                        <p>
                            <strong>Language:</strong> {project.language}
                        </p>
                    )}

                    <p>
                        <strong>Status:</strong> {project.status}
                    </p>

                    <p>
                        <small>
                            Created: {new Date(project.createdAt).toLocaleString()}
                        </small>
                    </p>
                </div>
            ))}
        </div>
    );
}

export default ProjectList;