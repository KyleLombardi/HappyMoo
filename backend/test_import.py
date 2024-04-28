import backend as bk

def main():
    bk.setup_assistant()
    response = bk.get_response("I see a change in my appearances. What could be ausing that?")
    print(response)
    return 0

if __name__ == "__main__":
    main()
