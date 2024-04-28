import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

async function fetchReply(msg) {
  try {
    const response = await fetch('http://127.0.0.1:8000/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message: msg}),
    });
    const data = await response.json();
    console.log(data); // You can remove or modify this line based on your logging preferences
    return data.response; // Assuming the backend sends back a JSON object with a 'reply' field
  } catch (error) {
    console.error('Fetch error:', error);
    return "Sorry, I couldn't fetch the reply."; // Fallback message
  }
}

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false); // To manage the send button and loading state
  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (inputText.trim() && !isSending) {
      setIsSending(true);
      const newMessage = {text: inputText, sender: 'user'};
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
      const replyText = await fetchReply(inputText);
      const botMessage = {text: replyText, sender: 'bot'};
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsSending(false);
    }
  };
  useEffect(() => {
    scrollViewRef.current.scrollToEnd({animated: true});
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: true})
        }>
        {messages.map((msg, index) => (
          <Text
            key={index}
            style={
              msg.sender === 'user' ? styles.messageUser : styles.messageBot
            }>
            {msg.text}
          </Text>
        ))}
        {isSending && <ActivityIndicator size="small" color="#0000ff" />}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message here..."
          editable={!isSending} // Disable input when sending
        />
        <TouchableOpacity
          style={styles.button}
          onPress={sendMessage}
          disabled={isSending}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageUser: {
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
    marginRight: 10,
    marginLeft: 'auto',
    maxWidth: '80%',
  },
  messageBot: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
    marginLeft: 10,
    marginRight: 'auto',
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: 'gray',
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ChatComponent;
