import backend as bk

def main():
    bk.setup_assistant()
    response = bk.get_response("I feel lethargic and tired. What could be causing that? Name the uploaded files you used to answer")
    print(response)
    return 0

if __name__ == "__main__":
    main()
