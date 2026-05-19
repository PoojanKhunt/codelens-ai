const path = require('path');
const axios = require('axios');
const Symbol = require('../models/Symbol');
const { extractFunctions } = require('./pythonService');

const PYTHON_API =
    process.env.PYTHON_RAG_URL || 'http://localhost:8000';

/**
 * Extract functions from a list of files and store them in MongoDB.
 *
 * @param {string} projectId - MongoDB Project ObjectId
 * @param {string[]} files - Absolute file paths
 * @param {string} repoPath - Absolute repository root path
 */
async function extractAndStoreSymbols(projectId, files, repoPath) {
    // Remove existing symbols for this project
    await Symbol.deleteMany({ projectId });

    let totalSymbols = 0;

    for (const filePath of files) {
        // Process only JavaScript files
        if (!filePath.endsWith('.js')) {
            continue;
        }

        try {
            // Extract functions from the file using the Python AST parser
            const functions = await extractFunctions(filePath);

            // Skip files with no functions
            if (!functions || functions.length === 0) {
                continue;
            }

            // Convert extracted functions into MongoDB documents
            const documents = functions.map((fn) => ({
                projectId,
                name: fn.name,
                type: fn.type,
                filePath: path.relative(repoPath, filePath),
                startLine: fn.startLine,
                endLine: fn.endLine,
            }));

            // Insert symbols into MongoDB
            const insertedSymbols = await Symbol.insertMany(documents);

            // Send each inserted symbol to Python for embedding + Chroma indexing
            for (const symbol of insertedSymbols) {
                try {
                    await axios.post(`${PYTHON_API}/index-symbol`, {
                        symbol,
                    });
                } catch (error) {
                    console.error(
                        `Failed to index symbol ${symbol.name}:`,
                        error.message
                    );
                }
            }

            // Update total count
            totalSymbols += insertedSymbols.length;
        } catch (error) {
            console.error(
                `Failed to parse ${filePath}:`,
                error.message
            );
        }
    }

    return totalSymbols;
}

module.exports = {
    extractAndStoreSymbols,
};