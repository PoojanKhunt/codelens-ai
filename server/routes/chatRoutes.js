const express = require('express');
const axios = require('axios');

const Project = require('../models/Project');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

const PYTHON_API =
    process.env.PYTHON_RAG_URL || 'http://localhost:8000';

// Protect all chat routes
router.use(protect);

// POST /api/chat
router.post('/', async (req, res) => {
    try {
        const { query, projectId } = req.body;

        // Validate input
        if (!query || !query.trim() || !projectId) {
            return res.status(400).json({
                message: 'query and projectId required',
            });
        }

        // Ensure the project belongs to the logged-in user
        const project = await Project.findOne({
            _id: projectId,
            userId: req.user._id,
        });

        if (!project) {
            return res.status(404).json({
                message: 'Project not found',
            });
        }

        // Ensure indexing is complete
        if (project.status !== 'indexed') {
            return res.status(400).json({
                message:
                    'Project is not fully indexed yet. Please wait until indexing completes.',
            });
        }

        // Forward query to Python RAG service
        const response = await axios.post(`${PYTHON_API}/query`, {
            query: query.trim(),
            project_id: projectId,
            n_results: 5,
        });

        // Return Python service response directly
        res.json(response.data);
    } catch (error) {
        console.error(
            'Chat query failed:',
            error.response?.data || error.message
        );

        res.status(500).json({
            message: 'Query failed',
            error:
                error.response?.data?.detail ||
                error.message,
        });
    }
});

module.exports = router;