from app.services.parsers.parser_registry import (
    get_parser
)


def extract_symbols(file_path: str):

    parser = get_parser(file_path)

    if not parser:
        return []

    return parser.parse(file_path)