// src/components/BrowseComponent.js
import React from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';

const blogPosts = [
    { id: '1', title: '5 Ways to Improve Your Wellness', url: 'https://www.meetup.com/blog/five-ways-to-wellbeing/' },
    { id: '2', title: 'Understanding Mindfulness and Health', url: 'https://mpfi.org/how-does-mindfulness-change-the-brain-a-neurobiologists-perspective-on-mindfulness-meditation/?psafe_param=1' },
    { id: '3', title: 'The Benefits of Daily Exercise', url: 'https://selfchec.org/healthy-habits/exercise/how-much-exercise/' },
    { id: '4', title: 'Healthy Eating on a Budget', url: 'https://somethingnutritiousblog.com/eating-healthy-on-a-budget/' }
];

const BrowseComponent = () => {
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => Linking.openURL(item.url)}>
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Recommendations</Text>
            <FlatList
                data={blogPosts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
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
    item: {
        fontSize: 18,
        padding: 20,
        marginVertical: 8,
        backgroundColor: '#fff', 
        borderWidth: 1,  
        borderColor: '#ddd',  
        borderRadius: 10, 
        shadowColor: "#000", 
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,  // Only works on Android for drop shadow
    },
    listContainer: {
        paddingBottom: 20,
    },
});


export default BrowseComponent;
