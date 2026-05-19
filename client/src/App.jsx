import { useEffect, useState } from 'react';
import api from './services/api';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>CodeLens AI</h1>
      <p>Repository Intelligence and RAG Platform</p>

      <ProjectForm onProjectCreated={fetchProjects} />

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}

export default App;