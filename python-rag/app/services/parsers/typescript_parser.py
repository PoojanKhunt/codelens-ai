from pathlib import Path

from tree_sitter import Parser, Language

from tree_sitter_typescript import (
    language_typescript
)

from app.services.parsers.base_parser import (
    BaseParser
)


class TypeScriptParser(BaseParser):

    def __init__(self):

        self.parser = Parser()

        TS_LANGUAGE = Language(
            language_typescript()
        )

        self.parser.language = TS_LANGUAGE

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

        symbols = []

        def add_symbol(
            name,
            node,
            symbol_type="function"
        ):

            symbols.append({
                "name": name,

                "type": symbol_type,

                "language": "typescript",

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

                    add_symbol(
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

                    add_symbol(
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

                    add_symbol(
                        self.get_node_text(
                            source,
                            name_node
                        ),
                        node,
                        "method"
                    )

            # classes
            elif node.type == "class_declaration":

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

            # interfaces
            elif node.type == "interface_declaration":

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
                        "interface"
                    )

            # enums
            elif node.type == "enum_declaration":

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
                        "enum"
                    )

            for child in node.children:
                visit(child)

        visit(root)

        seen = set()

        unique_symbols = []

        for sym in symbols:

            key = (
                sym["name"],
                sym["startLine"],
                sym["endLine"],
                sym["type"],
            )

            if key not in seen:

                seen.add(key)

                unique_symbols.append(sym)

        return unique_symbols