from pathlib import Path
from tree_sitter import Parser, Language
from tree_sitter_javascript import language as javascript_language


def extract_javascript_functions(file_path: str):
    # Create parser
    parser = Parser()

    # Convert PyCapsule -> Language object
    JS_LANGUAGE = Language(javascript_language())

    # Assign language to parser
    parser.language = JS_LANGUAGE

    # Read source code
    source = Path(file_path).read_text(
        encoding="utf-8",
        errors="ignore"
    )

    # Parse source
    tree = parser.parse(source.encode("utf-8"))
    root = tree.root_node

    functions = []

    # Find top-level function declarations
    for node in root.children:
        if node.type == "function_declaration":
            name_node = node.child_by_field_name("name")

            if name_node:
                function_name = source[
                    name_node.start_byte:name_node.end_byte
                ]

                functions.append({
                    "name": function_name,
                    "type": "function",
                    "startLine": node.start_point[0] + 1,
                    "endLine": node.end_point[0] + 1
                })

    return functions