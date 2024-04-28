from fastapi import FastAPI, HTTPException
import sys
import os
sys.path.insert(0, os.path.abspath('..'))
from backend import backend as OpenAIChat
import model as Model

OpenAIChat.setup_assistant()

# app object
app = FastAPI()

## Chat messaging
@app.post("/chat/")
async def chat(chat_request: Model.ChatRequest):
    response = generate_response(chat_request.message)
    return {"response": response}

def generate_response(message: str) -> str:
    return OpenAIChat.get_response(message)
    # try:
    #     openai_response = openai.ChatCompletion.create(
    #         model="gpt-4",
    #         messages=[{"role": "user", "content": message}]
    #     )
    #     return openai_response.choices[0].message['content']

    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))

## Health data
