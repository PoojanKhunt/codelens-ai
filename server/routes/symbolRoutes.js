const express = require('express');
const path = require('path');
const axios = require('axios');

const Project = require('../models/Project');
const { extractAndStoreSymbols } = require('../services/symbolService');

const router = express.Router();
const PYTHON_API = 'http://localhost:8000';

// POST /api/symbols/scan/:projectId
router.post('/scan/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        // Find project
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found',
            });
        }

        // Repository path
        const repoPath = path.join(
            __dirname,
            '..',
            'workspace',
            projectId
        );

        // Ask Python service to scan source files
        const scanResponse = await axios.post(
            `${PYTHON_API}/scan`,
            {
                repo_path: repoPath,
            }
        );

        const files = scanResponse.data.files;

        // Extract functions and store in MongoDB
        const symbolCount = await extractAndStoreSymbols(
            projectId,
            files,
            repoPath
        );

        res.json({
            message: 'Symbol extraction completed',
            filesScanned: files.length,
            symbolsStored: symbolCount,
        });
    } catch (error) {
        console.error('Symbol scan failed:', error.message);

        res.status(500).json({
            message: 'Symbol extraction failed',
            error: error.message,
        });
    }
});

module.exports = router;