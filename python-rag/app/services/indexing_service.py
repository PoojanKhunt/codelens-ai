from app.services.embedding_service import generate_embedding
from app.services.vector_store import add_symbol

MAX_CHUNK_LINES = 80


def chunk_code(code: str, max_lines: int = MAX_CHUNK_LINES):
    """Split large code blocks into smaller chunks."""
    lines = code.split("\n")
    if len(lines) <= max_lines:
        return [code]

    chunks = []
    for i in range(0, len(lines), max_lines):
        chunk = "\n".join(lines[i:i + max_lines])
        chunks.append(chunk)
    return chunks


def index_symbol(symbol: dict):
    source_code = symbol.get("sourceCode", "")
    file_path = symbol.get("filePath", "")
    name = symbol.get("name", "")
    sym_type = symbol.get("type", "function")

    # detect export/importance signals
    is_exported = (
        "export" in source_code[:100] or
        "public" in source_code[:50] or
        "module.exports" in source_code
    )

    # chunk large functions
    chunks = chunk_code(source_code)

    for i, chunk in enumerate(chunks):
        chunk_id = f"{symbol['_id']}_chunk_{i}" if len(chunks) > 1 else str(symbol["_id"])

        # code-first text format for better embeddings
        text = f"""// {file_path} — {name} ({sym_type})
// Lines {symbol.get('startLine')}-{symbol.get('endLine')}
// Exported: {is_exported}

{chunk}
"""

        embedding = generate_embedding(text)

        metadata = {
            "name": name,
            "type": sym_type,
            "filePath": file_path,
            "startLine": symbol.get("startLine"),
            "endLine": symbol.get("endLine"),
            "projectId": str(symbol.get("projectId")),
            "isExported": is_exported,
            "chunkIndex": i,
            "totalChunks": len(chunks),
        }

        add_symbol(
            symbol_id=chunk_id,
            text=text,
            embedding=embedding,
            metadata=metadata,
        )