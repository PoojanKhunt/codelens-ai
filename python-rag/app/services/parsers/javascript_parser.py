from pathlib import Path

from tree_sitter import Parser, Language

from tree_sitter_javascript import (
    language as javascript_language
)

from app.services.parsers.base_parser import (
    BaseParser
)


class JavaScriptParser(BaseParser):

    def __init__(self):

        self.parser = Parser()

        JS_LANGUAGE = Language(
            javascript_language()
        )

        self.parser.language = JS_LANGUAGE

    def get_node_text(self, source: str, node):

        return source[
            node.start_byte:node.end_byte
        ]

    def parse(self, file_path: str):

        source = Path(file_path).read_text(
            encoding="utf-8",
            errors="ignore"
        )

        tree = self.parser.parse(
            source.encode("utf-8")
        )

        root = tree.root_node

        functions = []

        def add_function(
            name,
            node,
            symbol_type="function"
        ):

            functions.append({
                "name": name,

                "type": symbol_type,

                "language": "javascript",

                "startLine":
                    node.start_point[0] + 1,

                "endLine":
                    node.end_point[0] + 1,

                "code":
                    self.get_node_text(
                        source,
                        node
                    ),
            })

        def visit(node):

            # function hello() {}
            if node.type == "function_declaration":

                name_node = node.child_by_field_name(
                    "name"
                )

                if name_node:

                    add_function(
                        self.get_node_text(
                            source,
                            name_node
                        ),
                        node
                    )

            # const x = () => {}
            elif node.type == "variable_declarator":

                name_node = node.child_by_field_name(
                    "name"
                )

                value_node = node.child_by_field_name(
                    "value"
                )

                if (
                    name_node
                    and value_node
                    and value_node.type in [
                        "function",
                        "function_expression",
                        "arrow_function",
                    ]
                ):

                    add_function(
                        self.get_node_text(
                            source,
                            name_node
                        ),
                        value_node
                    )

            # class methods
            elif node.type == "method_definition":

                name_node = node.child_by_field_name(
                    "name"
                )

                if name_node:

                    add_function(
                        self.get_node_text(
                            source,
                            name_node
                        ),
                        node,
                        "method"
                    )

            # object literal methods
            elif node.type == "pair":

                key_node = node.child_by_field_name(
                    "key"
                )

                value_node = node.child_by_field_name(
                    "value"
                )

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
                        self.get_node_text(
                            source,
                            key_node
                        ),
                        value_node
                    )

            for child in node.children:
                visit(child)

        visit(root)

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