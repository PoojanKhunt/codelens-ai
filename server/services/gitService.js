const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');

const workspaceDir = path.join(__dirname, '..', 'workspace');

async function cloneRepository(githubUrl, projectId) {
    const targetDir = path.join(workspaceDir, projectId.toString());

    // Remove directory if it already exists
    if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
    }

    // Ensure workspace exists
    fs.mkdirSync(workspaceDir, { recursive: true });

    // Clone repository
    const git = simpleGit();

    console.log(`Cloning ${githubUrl} into ${targetDir}...`);
    await git.clone(githubUrl, targetDir);
    console.log(`Repository cloned successfully.`);

    return targetDir;
}

module.exports = {
    cloneRepository,
};