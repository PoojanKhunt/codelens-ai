const path = require('path');
const Symbol = require('../models/Symbol');
const { extractFunctions } = require('./pythonService');

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
        // For now, only process JavaScript files
        if (!filePath.endsWith('.js')) {
            continue;
        }

        try {
            const functions = await extractFunctions(filePath);

            const documents = functions.map((fn) => ({
                projectId,
                name: fn.name,
                type: fn.type,
                filePath: path.relative(repoPath, filePath),
                startLine: fn.startLine,
                endLine: fn.endLine,
            }));

            if (documents.length > 0) {
                await Symbol.insertMany(documents);
                totalSymbols += documents.length;
            }
        } catch (error) {
            console.error(`Failed to parse ${filePath}:`, error.message);
        }
    }

    return totalSymbols;
}

module.exports = {
    extractAndStoreSymbols,
};