import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const SummaryComponent = ({ stepData, sleepData, bmiData, mindfulData, workoutData }) => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Health Summary</Text>
            <DataSection title="Steps" data={stepData} unit="steps" />
            <DataSection title="Sleep" data={sleepData} unit="hours" />
            <DataSection title="BMI" data={bmiData} unit="index" />
            <DataSection title="Mindfulness" data={mindfulData} unit="minutes" />
            <DataSection title="Workouts" data={workoutData} unit="activities" />
        </ScrollView>
    );
};

const DataSection = ({ title, data, unit }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.title}>{title}</Text>
            {data.map((item, index) => (
                <Text key={index} style={styles.item}>
                    {item.date}: {item.value} {unit}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        fontSize: 16,
        marginVertical: 2,
    },
});

export default SummaryComponent;
