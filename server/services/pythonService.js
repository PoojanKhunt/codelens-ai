const axios = require('axios');

const PYTHON_API = 'http://localhost:8000';

async function extractFunctions(filePath) {
    const response = await axios.post(
        `${PYTHON_API}/extract-functions`,
        {
            file_path: filePath,
        }
    );

    return response.data.functions;
}

module.exports = {
    extractFunctions,
};