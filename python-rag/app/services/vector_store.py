import chromadb

# Persistent local database stored in python-rag/chroma_db/
client = chromadb.PersistentClient(path="./chroma_db")

# Collection for all code symbols
collection = client.get_or_create_collection(
    name="code_symbols"
)


def add_symbol(symbol_id: str, text: str, embedding: list, metadata: dict):
    """
    Store one symbol and its embedding in Chroma.
    """
    collection.add(
        ids=[symbol_id],
        documents=[text],
        embeddings=[embedding],
        metadatas=[metadata],
    )


def search_similar(query_embedding: list, n_results: int = 5):
    """
    Search for the most similar symbols.
    """
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
    )
    return results