from fastapi import FastAPI
from pydantic import BaseModel

from app.services.parser_service import scan_source_files
from app.services.ast_parser import extract_javascript_functions
from app.services.indexing_service import index_symbol

app = FastAPI()


class ScanRequest(BaseModel):
    repo_path: str


class ExtractRequest(BaseModel):
    file_path: str

class SymbolRequest(BaseModel):
    symbol: dict


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