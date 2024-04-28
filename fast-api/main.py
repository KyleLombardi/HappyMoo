from fastapi import FastAPI, HTTPException
import sys
import os
sys.path.insert(0, os.path.abspath('..'))
from backend import backend as OpenAIChat
import model as Model

# app object
app = FastAPI()

OpenAIChat.setup_assistant()


## Chat messaging
@app.post("/chat/")
async def chat(chat_request: Model.ChatRequest):
    response = generate_response(chat_request.message)
    return {"response": response}

def generate_response(message: str) -> str:
    return OpenAIChat.get_response(message)

## Health data
@app.post("/import_data/")
async def import_data(data_request: Model.DataRequest):
    f = open("../data/{}.json".format(data_request.timestamp), "w")
    f.write(data_request.data)
    f.close()
    OpenAIChat.setup_assistant()
