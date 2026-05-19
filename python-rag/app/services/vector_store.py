import chromadb

# Create (or open) a persistent Chroma database stored locally
client = chromadb.PersistentClient(path="./chroma_db")

# Create (or load) the collection used to store code symbols
collection = client.get_or_create_collection(name="code_symbols")


def add_symbol(symbol_id: str, text: str, embedding: list, metadata: dict):
    """
    Store a symbol and its embedding in Chroma.

    Parameters:
        symbol_id: Unique identifier for the symbol (MongoDB _id)
        text: Combined textual representation of the symbol
        embedding: Vector embedding generated from the text
        metadata: Additional information (name, type, filePath, projectId, etc.)
    """
    collection.add(
        ids=[symbol_id],
        documents=[text],
        embeddings=[embedding],
        metadatas=[metadata],
    )


def search_similar(
    query_embedding: list,
    n_results: int = 5,
    project_id: str = None,
):
    """
    Search for symbols similar to the query embedding.

    Parameters:
        query_embedding: Embedding vector for the user's natural language query
        n_results: Number of top matches to return
        project_id: If provided, restrict search to this project only

    Returns:
        Chroma query results dictionary
    """

    # Restrict search to a single project when project_id is provided
    where = {"projectId": project_id} if project_id else None

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where=where,
    )

    return results