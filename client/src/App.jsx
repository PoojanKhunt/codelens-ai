import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/health')
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus('Server not reachable'));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>CodeLens AI</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

export default App;