const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');

const workspaceDir = path.join(__dirname, '..', 'workspace');

async function cloneRepository(githubUrl, projectId) {
    const targetDir = path.join(workspaceDir, projectId.toString());

    // Remove existing directory if present
    if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
    }

    // Ensure workspace exists
    fs.mkdirSync(workspaceDir, { recursive: true });

    const git = simpleGit();

    console.log(`Cloning ${githubUrl} into ${targetDir}...`);

    // Shallow clone: only latest snapshot, much faster and more reliable
    await git.clone(githubUrl, targetDir, [
        '--depth',
        '1',
        '--single-branch'
    ]);

    console.log('Repository cloned successfully.');

    return targetDir;
}

module.exports = {
    cloneRepository,
};