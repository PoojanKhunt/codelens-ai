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

    for path in repo.rglob("*"):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            files.append(str(path.resolve()))

    print(f"Found {len(files)} source files")

    return files