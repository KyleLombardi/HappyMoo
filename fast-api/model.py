from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

class DataRequest(BaseModel):
    data: str
    timestamp: str
