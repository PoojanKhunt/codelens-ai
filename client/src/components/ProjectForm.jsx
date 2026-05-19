import { useState } from 'react';
import api from '../services/api';

function ProjectForm({ onProjectCreated }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        githubUrl: '',
        language: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/projects', formData);

            setFormData({
                name: '',
                description: '',
                githubUrl: '',
                language: '',
            });

            onProjectCreated();
        } catch (error) {
            alert('Failed to create project');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <h2>Create Project</h2>

            <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <br /><br />

            <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
            />
            <br /><br />

            <input
                type="url"
                name="githubUrl"
                placeholder="GitHub URL"
                value={formData.githubUrl}
                onChange={handleChange}
            />
            <br /><br />

            <input
                type="text"
                name="language"
                placeholder="Language"
                value={formData.language}
                onChange={handleChange}
            />
            <br /><br />

            <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Project'}
            </button>
        </form>
    );
}

export default ProjectForm;