from openai import OpenAI
import os
import json

organization_id = os.environ.get('ORGANIZATION_ID') # FIXME: if this doesnt work set your organization id environment variable
client = OpenAI(organization=organization_id)

INSTRUCTIONS = "You are a health and wellbeing assistant. Your job is to take in medical data about your patient, figure out the most relevant information to their current issue, and offer thoughtful responses on how to help them."
APPROVED_TYPES = {".json", ".pdf", ".txt"}
UPLOAD_DIR = "./data/"

thread = None
assistant = None

def setup_assistant():
    global thread, assistant
    assistant = make_assistant()
    thread = client.beta.threads.create()
    send_data("sample.json", thread)


def send_data(file_name, thread):
    with open(file_name, 'r') as file:
        health_data = json.load(file)
    for (key, value) in health_data.items():
        message = f"{key} : {value}"
        create_message(thread, message)

def get_response(input):
    global thread, assistant
    create_message(thread, input)
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant.id,
    )
    while True:
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        if run.status == "completed":
            messages = client.beta.threads.messages.list(thread_id=thread.id)
            latest_message = messages.data[0]
            text = latest_message.content[0].text.value
            return text
        
def make_assistant():
    assistant = client.beta.assistants.create(
        name = "Health Assistant",
        instructions = INSTRUCTIONS,
        model = "gpt-3.5-turbo",
        tools = [{"type": "file_search"}] # FIXME: add support to input files like context jsons, medical pdf
    )
    return assistant

def create_message(thread, message: str):
    client.beta.threads.messages.create(
        thread_id = thread.id,
        role="user",
        content = message
    )


if __name__ == "__main__":
    setup_assistant()
    while True:
        user_input = input("Enter a line: ")
        response = get_response(user_input)
        print(response)