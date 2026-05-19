from fastapi import FastAPI
from pydantic import BaseModel

from app.services.parser_service import scan_source_files

app = FastAPI()


class ScanRequest(BaseModel):
    repo_path: str


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