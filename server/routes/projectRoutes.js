const express = require('express');
const axios = require('axios');

const Project = require('../models/Project');
const protect = require('../middleware/authMiddleware');

const { cloneRepository } = require('../services/gitService');
const { extractAndStoreSymbols } = require('../services/symbolService');

const router = express.Router();

const PYTHON_API = 'http://localhost:8000';

const Symbol = require('../models/Symbol');

// Protect all routes in this file
router.use(protect);

//
// GET /api/projects
// Return only projects belonging to the logged-in user
//
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({
            userId: req.user._id,
        }).sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch projects',
            error: error.message,
        });
    }
});

// DELETE /api/projects/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // delete symbols too
        await Symbol.deleteMany({ projectId: req.params.id });

        res.json({ message: 'Project deleted' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

//
// POST /api/projects
// Create a project associated with the logged-in user
//
router.post('/', async (req, res) => {
    try {
        const { name, description, githubUrl, language } = req.body;

        // Create project linked to current user
        const project = new Project({
            userId: req.user._id,
            name,
            description,
            githubUrl,
            language,
        });

        await project.save();

        // Clone repository if GitHub URL is provided
        if (githubUrl && githubUrl.trim() !== '') {
            try {
                // Clone repository
                const repoPath = await cloneRepository(
                    githubUrl,
                    project._id
                );

                // Update status
                project.status = 'indexing';
                await project.save();

                // Scan repository using Python service
                const scanResponse = await axios.post(
                    `${PYTHON_API}/scan`,
                    {
                        repo_path: repoPath,
                    }
                );

                const files = scanResponse.data.files;

                // Extract and store symbols
                const symbolCount = await extractAndStoreSymbols(
                    project._id,
                    files,
                    repoPath
                );

                // Mark project as fully indexed
                project.status = 'indexed';
                await project.save();

                console.log(
                    `Indexed ${symbolCount} symbols for ${project.name}`
                );
            } catch (cloneError) {
                console.error(
                    'Repository clone/index failed:',
                    cloneError.message
                );

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