from app.services.embedding_service import generate_embedding
from app.services.vector_store import add_symbol


def build_symbol_text(symbol: dict) -> str:
    """
    Build the text that will be embedded.
    """
    parts = [
        f"Function name: {symbol.get('name', '')}",
        f"Type: {symbol.get('type', '')}",
        f"File: {symbol.get('filePath', '')}",
    ]

    # Optional code content if available later
    if symbol.get("code"):
        parts.append(symbol["code"])

    return "\n".join(parts)


def index_symbol(symbol: dict):
    """
    Generate embedding and store one symbol in Chroma.
    """
    text = build_symbol_text(symbol)
    embedding = generate_embedding(text)

    metadata = {
        "projectId": str(symbol.get("projectId", "")),
        "name": symbol.get("name", ""),
        "type": symbol.get("type", ""),
        "filePath": symbol.get("filePath", ""),
        "startLine": int(symbol.get("startLine", 0)),
        "endLine": int(symbol.get("endLine", 0)),
    }

    add_symbol(
        symbol_id=str(symbol["_id"]),
        text=text,
        embedding=embedding,
        metadata=metadata,
    )