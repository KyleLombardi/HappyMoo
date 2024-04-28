from openai import OpenAI
import os
import json


organization_id = os.environ.get('ORGANIZATION_ID') # FIXME: if this doesnt work set your organization id environment variable
client = OpenAI(organization=organization_id)

INSTRUCTIONS = "You are a health and wellbeing assistant. Your job is to take in medical data about your patient, figure out the most relevant information to their current issue, and offer thoughtful responses on how to help them."
APPROVED_TYPES = {".json", ".pdf", ".txt"}
UPLOAD_DIR = "./data/"

def main():
    # data_message = json_to_message("sample.json")
    assistant = make_assistant()
    thread = client.beta.threads.create()
    # create_vector_store()
    send_data("sample.json", thread)
    run_prompt(assistant, thread)
    return 0

def create_vector_store():
    vector_store = client.beta.vector_stores.create(name="Health Information")
    filepaths = get_files()


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

def run_prompt(assistant, thread):  
    get_line(thread)
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
            print(text)
            break

    return 0


# When backend is invoked, do the following:

# Create a thread
    # Feed it messages.json
    # Feed it the Assistant

# Call Run on the thread
# Update messages.json

def get_line(thread):
    # read the user inputs from the terminal
    user_input = input("Enter a line: ")
    create_message(thread, user_input)
    return

# Give the AI its role/system and content
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
    main()


# Receive Prompt from User
# Receive data from context JSON
    # Read in a context json (all of the medical context from the apple watch)
        # turn it into a dictionary
        # turn the context into a messages() object 
            # assign role and content to each message()
            # parse the data and send it in as content
# Generate a response
# Store the response in message history JSON
# Send reponse back to the frontend