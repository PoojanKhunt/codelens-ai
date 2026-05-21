import ChatPanel from './ChatPanel';

function ProjectList({ projects }) {
    if (projects.length === 0) {
        return (
            <div className="rounded-3xl border border-[#30363d] bg-[#161b22] p-10 text-center text-[#8b949e]">
                No projects created yet.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {projects.map((project) => (
                <div
                    key={project._id}
                    className="rounded-3xl border border-[#30363d] bg-[#161b22]/90 backdrop-blur shadow-2xl overflow-hidden"
                >
                    <div className="px-8 py-6 border-b border-[#30363d] flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                            <p className="text-[#8b949e]">{project.description}</p>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium">
                            {project.status}
                        </span>
                    </div>

                    <div className="px-8 py-4 border-b border-[#30363d] text-sm text-[#8b949e] flex flex-wrap gap-6">
                        <span>{project.language}</span>
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                            >
                                GitHub Repository
                            </a>
                        )}
                    </div>

                    <div className="p-8">
                        <ChatPanel projectId={project._id} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProjectList;