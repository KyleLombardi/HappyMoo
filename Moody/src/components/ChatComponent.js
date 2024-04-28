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
} from 'react-native';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {text: inputText, sender: 'user'};
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
      triggerReply(newMessage);
    }
  };

  const triggerReply = newMessage => {
    // Simulate a reply after a slight delay
    setTimeout(() => {
      const reply = {
        text: 'Thanks for your message! This is an automatic reply.',
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, reply]);
    }, 1000);
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
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message here..."
          onSubmitEditing={sendMessage} // Allows sending by pressing the enter key
        />
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
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
