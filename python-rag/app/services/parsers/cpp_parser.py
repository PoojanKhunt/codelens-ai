from pathlib import Path
from tree_sitter import Parser, Language
from tree_sitter_cpp import language as cpp_language
from app.services.parsers.base_parser import BaseParser


class CppParser(BaseParser):

    def __init__(self):
        self.parser = Parser()
        self.parser.language = Language(cpp_language())

    def get_node_text(self, source, node):
        return source[node.start_byte:node.end_byte]

    def parse(self, file_path: str):
        source = Path(file_path).read_text(encoding="utf-8", errors="ignore")
        tree = self.parser.parse(source.encode("utf-8"))
        root = tree.root_node
        symbols = []

        def add_symbol(name, node, symbol_type="function"):
            symbols.append({
                "name": name,
                "type": symbol_type,
                "language": "cpp",
                "startLine": node.start_point[0] + 1,
                "endLine": node.end_point[0] + 1,
                "code": self.get_node_text(source, node),
            })

        def visit(node):
            if node.type == "function_definition":
                declarator = node.child_by_field_name("declarator")
                if declarator:
                    inner = declarator
                    while inner and inner.type in ("pointer_declarator", "reference_declarator"):
                        inner = inner.child_by_field_name("declarator")
                    if inner and inner.type == "function_declarator":
                        name_node = inner.child_by_field_name("declarator")
                        if name_node:
                            add_symbol(self.get_node_text(source, name_node), node)

            elif node.type == "class_specifier":
                n = node.child_by_field_name("name")
                if n:
                    add_symbol(self.get_node_text(source, n), node, "class")

            elif node.type == "struct_specifier":
                n = node.child_by_field_name("name")
                if n:
                    add_symbol(self.get_node_text(source, n), node, "struct")

            for child in node.children:
                visit(child)

        visit(root)
        return symbols