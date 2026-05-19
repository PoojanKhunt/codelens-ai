const axios = require('axios');

const PYTHON_API =
    process.env.PYTHON_RAG_URL || 'http://localhost:8000';

async function extractFunctions(filePath) {
    const response = await axios.post(
        `${PYTHON_API}/extract-functions`,
        {
            file_path: filePath,
        }
    );

    // Return ONLY the array of functions
    return response.data.functions || [];
}

module.exports = {
    extractFunctions,
};
