const express = require('express');
const Project = require('../models/Project');
const { cloneRepository } = require('../services/gitService');

const router = express.Router();

// GET /api/projects
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
router.post('/', async (req, res) => {
    try {
        const { name, description, githubUrl, language } = req.body;

        // Create project
        const project = new Project({
            name,
            description,
            githubUrl,
            language,
        });

        await project.save();

        // Clone repository if GitHub URL is provided
        if (githubUrl && githubUrl.trim() !== '') {
            try {
                await cloneRepository(githubUrl, project._id);

                project.status = 'indexing';
                await project.save();
            } catch (cloneError) {
                console.error('Repository clone failed:', cloneError.message);

                project.status = 'error';
                await project.save();
            }
        }

        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({
            message: 'Failed to create project',
            error: error.message,
        });
    }
});

module.exports = router;