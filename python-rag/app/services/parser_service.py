from pathlib import Path

SUPPORTED_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".cpp",
    ".cc",
    ".c",
    ".h",
    ".hpp",
    ".java",
    ".go",
    ".rs",
}


def scan_source_files(repo_path: str):
    """
    Recursively find all supported source files in a repository.
    Returns a list of absolute file paths.
    """
    repo = Path(repo_path)

    # Debug information
    print(f"Scanning repository: {repo_path}")
    print(f"Exists: {repo.exists()}")
    print(f"Is directory: {repo.is_dir()}")

    if not repo.exists() or not repo.is_dir():
        return []

    files = []

    IGNORED_PATHS = {
        'node_modules', '.git', 'dist', 'build',
        'test', 'tests', '__tests__', '.next', 'coverage'
    }

    for path in repo.rglob("*"):
        if any(part in IGNORED_PATHS for part in path.parts):
            continue
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            files.append(str(path.resolve()))

    print(f"Found {len(files)} source files")

    return files