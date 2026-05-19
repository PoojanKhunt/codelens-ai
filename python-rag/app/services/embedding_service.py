from sentence_transformers import SentenceTransformer

# Load the embedding model once when the service starts
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str):
    """
    Generate a 384-dimensional embedding vector for the input text.
    """
    embedding = model.encode(text)
    return embedding.tolist()