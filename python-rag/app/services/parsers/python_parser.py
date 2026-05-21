from pathlib import Path

from tree_sitter import Parser, Language

from tree_sitter_python import (
    language as python_language
)

from app.services.parsers.base_parser import (
    BaseParser
)


class PythonParser(BaseParser):

    def __init__(self):

        self.parser = Parser()

        PY_LANGUAGE = Language(
            python_language()
        )

        self.parser.language = PY_LANGUAGE

    def get_node_text(self, source, node):

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

        symbols = []

        def add_symbol(
            name,
            node,
            symbol_type="function"
        ):

            symbols.append({
                "name": name,
                "type": symbol_type,
                "language": "python",

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

        def visit(node, inside_class=False):

            # functions
            if node.type == "function_definition":

                name_node = node.child_by_field_name(
                    "name"
                )

                if name_node:

                    add_symbol(
                        self.get_node_text(
                            source,
                            name_node
                        ),
                        node,
                        "method" if inside_class
                        else "function"
                    )

            # classes
            elif node.type == "class_definition":

                name_node = node.child_by_field_name(
                    "name"
                )

                if name_node:

                    add_symbol(
                        self.get_node_text(
                            source,
                            name_node
                        ),
                        node,
                        "class"
                    )

                for child in node.children:
                    visit(child, True)

                return

            for child in node.children:
                visit(child, inside_class)

        visit(root)

        return symbols