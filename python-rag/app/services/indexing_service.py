from app.services.embedding_service import generate_embedding
from app.services.vector_store import add_symbol


def index_symbol(symbol: dict):
    """
    Build a rich text representation of a symbol, generate an embedding,
    and store it in Chroma.
    """

    # Include the full source code if available
    source_code = symbol.get("sourceCode", "")

    text = f"""
Name: {symbol.get('name')}
Type: {symbol.get('type')}
File: {symbol.get('filePath')}
Lines: {symbol.get('startLine')}-{symbol.get('endLine')}

Description:
{symbol.get('description', '')}

Source Code:
{source_code}
"""

    embedding = generate_embedding(text)

    metadata = {
        "name": symbol.get("name"),
        "type": symbol.get("type"),
        "filePath": symbol.get("filePath"),
        "startLine": symbol.get("startLine"),
        "endLine": symbol.get("endLine"),
        "projectId": str(symbol.get("projectId")),
    }

    add_symbol(
        symbol_id=str(symbol["_id"]),
        text=text,
        embedding=embedding,
        metadata=metadata,
    )