const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

// GET /api/projects
// Fetch all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch projects',
            error: error.message,
        });
    }
});

// POST /api/projects
// Create a new project
router.post('/', async (req, res) => {
    try {
        const { name, description, githubUrl, language } = req.body;

        const project = new Project({
            name,
            description,
            githubUrl,
            language,
        });

        const savedProject = await project.save();

        res.status(201).json(savedProject);
    } catch (error) {
        res.status(400).json({
            message: 'Failed to create project',
            error: error.message,
        });
    }
});

module.exports = router;