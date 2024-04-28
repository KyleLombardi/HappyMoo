import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';

export default function ChatComponent() {
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (message.trim().length === 0) {
      Alert.alert('Error', 'Please enter a message before sending.');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message
        }),
      });
      const data = await response.json();
      Alert.alert('Response', data.response);
      setMessage(''); // Clear the message input after sending
    } catch (error) {
      Alert.alert('Error', 'Could not send the message.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message here"
      />
      <Button
        title="Send"
        onPress={sendMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});
