from fastapi import FastAPI
from pydantic import BaseModel

from app.services.parser_service import scan_source_files
from app.services.ast_parser import extract_javascript_functions
from app.services.indexing_service import index_symbol
from app.services.embedding_service import generate_embedding
from app.services.vector_store import search_similar

app = FastAPI()


class ScanRequest(BaseModel):
    repo_path: str


class ExtractRequest(BaseModel):
    file_path: str

class SymbolRequest(BaseModel):
    symbol: dict

class QueryRequest(BaseModel):
    query: str
    project_id: str
    n_results: int = 5


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "python-rag"
    }


@app.post("/scan")
def scan_repository(request: ScanRequest):
    files = scan_source_files(request.repo_path)

    return {
        "count": len(files),
        "files": files
    }


@app.post("/extract-functions")
def extract_functions(request: ExtractRequest):
    functions = extract_javascript_functions(request.file_path)

    return {
        "count": len(functions),
        "functions": functions
    }

@app.post("/index-symbol")
def index_symbol_endpoint(request: SymbolRequest):
    index_symbol(request.symbol)

    return {
        "status": "success",
        "message": f"Indexed symbol {request.symbol.get('name', '')}"
    }

@app.post("/query")
def query_symbols(request: QueryRequest):
    # Embed the natural language query
    query_embedding = generate_embedding(request.query)

    # Search Chroma for similar symbols
    results = search_similar(
        query_embedding=query_embedding,
        n_results=request.n_results,
        project_id=request.project_id
    )

    # Format results
    matches = []
    ids = results.get("ids", [[]])[0]
    distances = results.get("distances", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    documents = results.get("documents", [[]])[0]

    for i, symbol_id in enumerate(ids):
        matches.append({
            "id": symbol_id,
            "score": round(1 - distances[i], 4),  # convert distance to similarity
            "name": metadatas[i].get("name"),
            "type": metadatas[i].get("type"),
            "filePath": metadatas[i].get("filePath"),
            "startLine": metadatas[i].get("startLine"),
            "endLine": metadatas[i].get("endLine"),
            "text": documents[i],
        })

    return {"query": request.query, "results": matches}