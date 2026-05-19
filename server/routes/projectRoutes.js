const express = require('express');
const Project = require('../models/Project');
const { cloneRepository } = require('../services/gitService');

const { extractAndStoreSymbols } = require('../services/symbolService');
const axios = require('axios');

const router = express.Router();

const PYTHON_API = 'http://localhost:8000';

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