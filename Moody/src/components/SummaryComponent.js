// SummaryComponent.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';


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

  const SummaryComponent = ({ stepData, sleepData, bmiData, mindfulData, workoutData }) => {
    const [stepReply, setStepReply] = useState('');
    const [sleepReply, setSleepReply] = useState('');
    const [bmiReply, setBMIReply] = useState('');
    const [mindfulReply, setMindfulReply] = useState('');
    const [workoutReply, setWorkoutReply] = useState('');

    useEffect(() => {
        fetchReply('Steps data overview').then(setStepReply);
        fetchReply('Sleep data overview').then(setSleepReply);
        fetchReply('BMI data overview').then(setBMIReply);
        fetchReply('Mindfulness data overview').then(setMindfulReply);
        fetchReply('Workout data overview').then(setWorkoutReply);
    }, []); // Add dependencies if necessary

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Health Data Summary</Text>
            <DataSection title="Steps" data={stepData} reply={stepReply} />
            <DataSection title="Sleep" data={sleepData} reply={sleepReply} />
            <DataSection title="BMI" data={bmiData} reply={bmiReply} />
            <DataSection title="Mindfulness" data={mindfulData} reply={mindfulReply} />
            <DataSection title="Workout" data={workoutData} reply={workoutReply} />
        </ScrollView>
    );
};

const DataSection = ({ title, data, reply }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.replyText}>{reply}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10
    },
    dataText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5
    },
    replyText: {
        fontSize: 16,
        color: '#555',
        marginTop: 10,
        fontStyle: 'italic'
    },
});

export default SummaryComponent;