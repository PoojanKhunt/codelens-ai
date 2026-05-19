const express = require('express');
const axios = require('axios');

const router = express.Router();
const PYTHON_API = process.env.PYTHON_RAG_URL || 'http://localhost:8000';

// POST /api/chat
router.post('/', async (req, res) => {
    try {
        const { query, projectId } = req.body;

        if (!query || !projectId) {
            return res.status(400).json({ message: 'query and projectId required' });
        }

        const response = await axios.post(`${PYTHON_API}/query`, {
            query,
            project_id: projectId,
            n_results: 5,
        });

        res.json(response.data);
    } catch (error) {
        console.error('Chat query failed:', error.message);
        res.status(500).json({ message: 'Query failed', error: error.message });
    }
});

module.exports = router;