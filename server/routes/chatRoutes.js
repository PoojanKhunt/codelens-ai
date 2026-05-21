const express = require('express');
const axios = require('axios');
const Project = require('../models/Project');
const protect = require('../middleware/authMiddleware');

const router = express.Router();
const PYTHON_API = process.env.PYTHON_RAG_URL || 'http://localhost:8000';

router.use(protect);

router.post('/', async (req, res) => {
    try {
        const { query, projectId, history } = req.body;

        if (!query || !query.trim() || !projectId) {
            return res.status(400).json({ message: 'query and projectId required' });
        }

        const project = await Project.findOne({
            _id: projectId,
            userId: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.status !== 'indexed') {
            return res.status(400).json({
                message: 'Project is not fully indexed yet.',
            });
        }

        const response = await axios.post(`${PYTHON_API}/query`, {
            query: query.trim(),
            project_id: projectId,
            n_results: 8,
            history: history || [],
        });

        res.json(response.data);
    } catch (error) {
        console.error('Chat query failed:', error.response?.data || error.message);
        res.status(500).json({
            message: 'Query failed',
            error: error.response?.data?.detail || error.message,
        });
    }
});

module.exports = router;