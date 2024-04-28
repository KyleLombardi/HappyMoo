// SummaryComponent.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


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
            <DataSection title="Steps" data={stepData} iconName="directions-walk" reply={stepReply} />
            <DataSection title="Sleep" data={sleepData} iconName="nights-stay" reply={sleepReply} />
            <DataSection title="BMI" data={bmiData} iconName="fitness-center" reply={bmiReply} />
            <DataSection title="Mindfulness" data={mindfulData} iconName="spa" reply={mindfulReply} />
            <DataSection title="Workout" data={workoutData} iconName="directions-run" reply={workoutReply} />
        </ScrollView>
    );
};

const DataSection = ({ title, data, reply, iconName }) => {
    return (
        <View style={styles.section}>
            <View style={styles.titleContainer}>
                <Icon name={iconName} size={24} color="#666" style={styles.icon} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <Text style={styles.replyText}>{reply}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',  // Aligns the icon and text horizontally
        alignItems: 'center',  // Centers items vertically within the container
    },
    icon: {
        marginRight: 10,  // Adds spacing between the icon and the text
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',  
    },
    section: {
        fontSize: 18,
        padding: 20,
        marginVertical: 8,
        backgroundColor: '#fff', // White background
        borderWidth: 1,
        borderColor: '#ddd', // Light grey border
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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