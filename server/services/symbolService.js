const path = require('path');
const axios = require('axios');
const Symbol = require('../models/Symbol');
const { extractFunctions } = require('./pythonService');

const PYTHON_API = process.env.PYTHON_RAG_URL || 'http://localhost:8000';

const SUPPORTED = ['.js', '.jsx', '.ts', '.tsx', '.py', '.cpp', '.cc', '.cxx', '.h', '.hpp', '.go', '.java'];

async function indexFileSummary(projectId, filePath, repoPath, functions) {
    if (functions.length === 0) return;

    const relativePath = path.relative(repoPath, filePath);
    const functionNames = functions.map(f => f.name).join(', ');
    const ext = path.extname(filePath).slice(1);

    const summarySymbol = {
        _id: `summary_${projectId}_${relativePath.replace(/[/\\]/g, '_')}`,
        projectId,
        name: `${path.basename(filePath)} (file summary)`,
        type: 'file',
        filePath: relativePath,
        startLine: 1,
        endLine: functions[functions.length - 1]?.endLine || 1,
        sourceCode: `File: ${relativePath}
Language: ${ext}
Contains ${functions.length} symbols: ${functionNames}`,
    };

    try {
        await axios.post(`${PYTHON_API}/index-symbol`, { symbol: summarySymbol });
    } catch (e) {
        console.error(`Failed to index file summary for ${relativePath}:`, e.message);
    }
}

async function extractAndStoreSymbols(projectId, files, repoPath) {
    await Symbol.deleteMany({ projectId });

    let totalSymbols = 0;

    for (const filePath of files) {
        if (!SUPPORTED.some(ext => filePath.endsWith(ext))) continue;

        try {
            const functions = await extractFunctions(filePath);

            if (!functions || functions.length === 0) continue;

            const documents = functions.map((fn) => ({
                projectId,
                name: fn.name,
                type: fn.type,
                filePath: path.relative(repoPath, filePath),
                startLine: fn.startLine,
                endLine: fn.endLine,
                sourceCode: fn.code || '',
            }));

            const insertedSymbols = await Symbol.insertMany(documents);

            for (const symbol of insertedSymbols) {
                try {
                    await axios.post(`${PYTHON_API}/index-symbol`, { symbol });
                } catch (error) {
                    console.error(`Failed to index symbol ${symbol.name}:`, error.message);
                }
            }

            // index file summary after all symbols for this file
            await indexFileSummary(projectId, filePath, repoPath, functions);

            totalSymbols += insertedSymbols.length;
        } catch (error) {
            console.error(`Failed to parse ${filePath}:`, error.message);
        }
    }

    return totalSymbols;
}

module.exports = { extractAndStoreSymbols };