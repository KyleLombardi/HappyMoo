// src/components/BrowseComponent.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';

const blogPosts = [
    { id: '1', title: '5 Ways to Improve Your Wellness', url: 'https://example.com/post1' },
    { id: '2', title: 'Understanding Mindfulness and Health', url: 'https://example.com/post2' },
    { id: '3', title: 'The Benefits of Daily Exercise', url: 'https://example.com/post3' },
    { id: '4', title: 'Healthy Eating on a Budget', url: 'https://example.com/post4' }
];

const BrowseComponent = () => {
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => Linking.openURL(item.url)}>
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={blogPosts}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff'
    },
    item: {
        padding: 20,
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BrowseComponent;
