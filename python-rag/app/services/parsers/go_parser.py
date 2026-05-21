from pathlib import Path

from tree_sitter import Parser, Language

from tree_sitter_go import (
    language as go_language
)

from app.services.parsers.base_parser import (
    BaseParser
)


class GoParser(BaseParser):

    def __init__(self):

        self.parser = Parser()

        GO_LANGUAGE = Language(
            go_language()
        )

        self.parser.language = GO_LANGUAGE

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
                "language": "go",

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

            # functions
            if node.type == "function_declaration":

                name_node = node.child_by_field_name(
                    "name"
                )

                if name_node:

                    add_symbol(
                        self.get_node_text(
                            source,
                            name_node
                        ),
                        node
                    )

            # methods
            elif node.type == "method_declaration":

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
                        "method"
                    )

            # structs/interfaces
            elif node.type == "type_declaration":

                add_symbol(
                    "type_declaration",
                    node,
                    "type"
                )

            for child in node.children:
                visit(child)

        visit(root)

        return symbols