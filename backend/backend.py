from openai import OpenAI
import os
import json
import sys

sys.path.insert(0, os.path.abspath('..'))

organization_id = os.environ.get('ORGANIZATION_ID') # FIXME: if this doesnt work set your organization id environment variable
client = OpenAI(organization=organization_id)

INSTRUCTIONS = "You are a health and wellbeing assistant. Your job is to take in medical data about your patient, figure out the most relevant information to their current issue, and offer thoughtful responses on how to help them."
APPROVED_TYPES = {".json", ".pdf", ".txt"}
UPLOAD_DIR = "../data/"

thread = None
assistant = None

def setup_assistant():
    global thread, assistant
    assistant = make_assistant()
    thread = client.beta.threads.create()
    # send_data("sample.json", thread)

def create_vector_store():
    global vector_store
    vector_store = client.beta.vector_stores.create(name="Health Information")

    # Ready the files for upload to OpenAI
    file_paths = get_files()
    file_streams = [open(path, "rb") for path in file_paths]
    print(file_paths)

    # Use the upload and poll SDK helper to upload the files, add them to the vector store,
    # and poll the status of the file batch for completion.
    file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
    vector_store_id=vector_store.id, files=file_streams
    )
 
    # You can print the status and the file counts of the batch to see the result of this operation. 
    print(file_batch.status)
    

def get_files():
    dir = UPLOAD_DIR
    filepaths_in_dir = []
    for file in os.listdir(dir):
        if is_approved_type(file):
            filepaths_in_dir.append(dir + file)
    return filepaths_in_dir

def is_approved_type(filename):
    for type in APPROVED_TYPES:
        if filename.endswith(type):
            return True
    return False


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
            
            message_content = latest_message.content[0].text
            annotations = message_content.annotations
            citations = []
            for index, annotation in enumerate(annotations):
                message_content.value = message_content.value.replace(
                    annotation.text, f"[{index}]"
                )
                if file_citation := getattr(annotation, "file_citation", None):
                    cited_file = client.files.retrieve(file_citation.file_id)
                    citations.append(f"[{index}] {cited_file.filename}")

            print("\n".join(citations))

            return text
        
def make_assistant():
    create_vector_store()
    assistant = client.beta.assistants.create(
        name = "Health Assistant",
        instructions = INSTRUCTIONS,
        model = "gpt-3.5-turbo",
        tool_resources = {"file_search": {"vector_store_ids": [vector_store.id]}} # FIXME: add support to input files like context jsons, medical pdf
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
