from pathlib import Path

from app.services.parsers.javascript_parser import (
    JavaScriptParser
)

from app.services.parsers.typescript_parser import (
    TypeScriptParser
)

from app.services.parsers.python_parser import (
    PythonParser
)

from app.services.parsers.go_parser import (
    GoParser
)

from app.services.parsers.java_parser import (
    JavaParser
)

from app.services.parsers.cpp_parser import (
    CppParser
)


PARSERS = {

    # JavaScript
    ".js": JavaScriptParser(),
    ".jsx": JavaScriptParser(),

    # TypeScript
    ".ts": TypeScriptParser(),
    ".tsx": TypeScriptParser(),

    # Python
    ".py": PythonParser(),

    # Go
    ".go": GoParser(),

    # Java
    ".java": JavaParser(),

    # C++
    ".cpp": CppParser(),
    ".cc": CppParser(),
    ".cxx": CppParser(),
    ".hpp": CppParser(),
    ".h": CppParser(),
}


def get_parser(file_path: str):

    ext = Path(file_path).suffix.lower()

    return PARSERS.get(ext)