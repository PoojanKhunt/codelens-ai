const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        description: {
            type: String,
            default: '',
            maxlength: 500,
        },

        githubUrl: {
            type: String,
            default: '',
        },

        status: {
            type: String,
            enum: ['created', 'indexing', 'ready', 'error'],
            default: 'created',
        },

        language: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Project', projectSchema);