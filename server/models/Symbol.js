const mongoose = require('mongoose');

const symbolSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            index: true,
        },
        type: {
            type: String,
            required: true,
            default: 'function',
        },
        filePath: {
            type: String,
            required: true,
        },
        startLine: {
            type: Number,
            required: true,
        },
        endLine: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Symbol', symbolSchema);