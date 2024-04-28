from openai import OpenAI
import os
import json


organization_id = os.environ.get('ORGANIZATION_ID') # FIXME: if this doesnt work set your organization id environment variable
client = OpenAI(organization=organization_id)

INSTRUCTIONS = "You are a health and wellbeing assistant. Your job is to take in medical data about your patient, figure out the most relevant information to their current issue, and offer thoughtful responses on how to help them."

def main():
    return 0

def run_prompt():
    assistant = make_assistant()
    thread = client.beta.threads.create()
    get_lines(thread)
    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id,
        assistant_id=assistant.id,
    )
    return 0


# When backend is invoked, do the following:

# Create a thread
    # Feed it messages.json
    # Feed it the Assistant

# Call Run on the thread
# Update messages.json

def get_lines(thread):
    input = ""
    lines = []
    while input != "exit":
        input = input()
        lines.append(input)
    create_messages(thread, lines)

# Give the AI its role/system and content
def make_assistant():
    assistant = client.beta.assistants.create(
        name = "Health Assistant",
        instructions = INSTRUCTIONS,
        model = "gpt-3.5-turbo",
        tools = [{"type:" "file_search"}] # FIXME: add support to input files like context jsons, medical pdf
    )
    return assistant

def create_messages(thread, messages: list[str], ):
    for m in messages:
        message = client.beta.threads.messages.create(
            thread_id = thread.id,
            role="user",
            content = m   
        )
    return



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

