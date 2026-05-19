from pathlib import Path
from tree_sitter import Parser, Language
from tree_sitter_javascript import language as javascript_language


def get_node_text(source: str, node):
    return source[node.start_byte:node.end_byte]


def extract_javascript_functions(file_path: str):
    parser = Parser()
    JS_LANGUAGE = Language(javascript_language())
    parser.language = JS_LANGUAGE

    source = Path(file_path).read_text(
        encoding="utf-8",
        errors="ignore"
    )

    tree = parser.parse(source.encode("utf-8"))
    root = tree.root_node

    functions = []

    def add_function(name, node, symbol_type="function"):
        functions.append({
            "name": name,
            "type": symbol_type,
            "startLine": node.start_point[0] + 1,
            "endLine": node.end_point[0] + 1,
        })

    def visit(node):
        # 1. Standard function declarations
        if node.type == "function_declaration":
            name_node = node.child_by_field_name("name")
            if name_node:
                add_function(get_node_text(source, name_node), node)

        # 2. Variable declarators:
        # const add = function() {}
        # const add = () => {}
        elif node.type == "variable_declarator":
            name_node = node.child_by_field_name("name")
            value_node = node.child_by_field_name("value")

            if (
                name_node
                and value_node
                and value_node.type in [
                    "function",
                    "function_expression",
                    "arrow_function",
                ]
            ):
                add_function(get_node_text(source, name_node), value_node)

        # 3. Class methods
        elif node.type == "method_definition":
            name_node = node.child_by_field_name("name")
            if name_node:
                add_function(
                    get_node_text(source, name_node),
                    node,
                    "method"
                )

        # 4. Object literal methods (shorthand)
        elif node.type == "pair":
            key_node = node.child_by_field_name("key")
            value_node = node.child_by_field_name("value")

            if (
                key_node
                and value_node
                and value_node.type in [
                    "function",
                    "function_expression",
                    "arrow_function",
                ]
            ):
                add_function(
                    get_node_text(source, key_node),
                    value_node
                )

        # Recursively visit all children
        for child in node.children:
            visit(child)

    visit(root)

    # Remove duplicates
    seen = set()
    unique_functions = []

    for fn in functions:
        key = (
            fn["name"],
            fn["startLine"],
            fn["endLine"],
            fn["type"],
        )
        if key not in seen:
            seen.add(key)
            unique_functions.append(fn)

    return unique_functions