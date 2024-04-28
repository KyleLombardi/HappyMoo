import backend as bk

def main():
    bk.setup_assistant()
    while True:
        query = input("Tell the bot how you feel:")
        break
    
    response = bk.get_response(query)
    # response = bk.get_response("I feel lethargic and tired. What could be causing that? Use the json files to answer")
    print(response)
    return 0

if __name__ == "__main__":
    main()
