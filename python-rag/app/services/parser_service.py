from pathlib import Path
from app.config.ignore_patterns import IGNORE_DIRS, IGNORE_FILES, IGNORE_PATTERNS

SUPPORTED_EXTENSIONS = {
    ".py", ".js", ".jsx", ".ts", ".tsx",
    ".cpp", ".cc", ".c", ".h", ".hpp",
    ".java", ".go", ".rs",
}

def scan_source_files(repo_path: str):
    repo = Path(repo_path)

    if not repo.exists() or not repo.is_dir():
        return []

    files = []

    for path in repo.rglob("*"):
        # skip ignored directories
        if any(part in IGNORE_DIRS for part in path.parts):
            continue

        if not path.is_file():
            continue

        # skip ignored filenames
        if path.name in IGNORE_FILES:
            continue

        # skip ignored patterns
        if any(pattern in path.name for pattern in IGNORE_PATTERNS):
            continue

        if path.suffix.lower() in SUPPORTED_EXTENSIONS:
            files.append(str(path.resolve()))

    print(f"Found {len(files)} source files after filtering")
    return files