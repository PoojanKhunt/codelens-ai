from dataclasses import dataclass


@dataclass
class Symbol:
    name: str
    type: str
    language: str
    startLine: int
    endLine: int
    code: str