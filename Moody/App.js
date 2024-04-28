import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {
  initializeHealthKit,
  getStepCount,
  getSleepSamples,
  getBMISamples,
  getMindfulSessions,
  getWorkoutSamples,
} from './src/components/healthData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import ChatComponent from './src/components/ChatComponent';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

const Tab = createBottomTabNavigator();

const App = () => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [stepData, setStepData] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [bmiData, setBMIData] = useState([]);
  const [mindfulData, setMindfulData] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);

  useEffect(() => {
    initializeHealthKit(setHasPermissions);
  }, []);

  useEffect(() => {
    if (hasPermissions) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Fetch the last 30 days of data
      const endDate = new Date();
      getStepCount(startDate, endDate, setStepData);
      getSleepSamples(startDate, endDate, setSleepData);
      getBMISamples(startDate, endDate, setBMIData);
      getMindfulSessions(startDate, endDate, setMindfulData);
      getWorkoutSamples(startDate, endDate, setWorkoutData);
    }
  }, [hasPermissions]);

  useEffect(() => {
    // Store step data as JSON in a file whenever it changes
    const storeDataToFile = async () => {
      if (
        stepData.length > 0 ||
        sleepData.length > 0 ||
        bmiData.length > 0 ||
        mindfulData.length > 0
      ) {
        const path = RNFS.DocumentDirectoryPath + '/healthData.json';
        try {
          const jsonData = JSON.stringify({
            steps: stepData,
            sleep: sleepData,
            bmi: bmiData,
            mindfulness: mindfulData,
            workout: workoutData
          });
          await RNFS.writeFile(path, jsonData, 'utf8');
          console.log('Health data saved to', path);
        } catch (e) {
          console.error('Failed to save the health data to file:', e);
        }
      }
    };

    storeDataToFile();
  }, [stepData, sleepData, bmiData, mindfulData, workoutData]);

  const fetchDataFromFile = async () => {
    const path = RNFS.DocumentDirectoryPath + '/healthData.json';
    try {
        const jsonData = await RNFS.readFile(path, 'utf8');
        const data = JSON.parse(jsonData);
        console.log('Read health data from file:', data);
        return data;
    } catch (e) {
        console.error('Failed to read the health data from file:', e);
        return null;  // return null or appropriate default value if error occurs
    }
};

useEffect(() => {
  fetchDataFromFile().then(data => {
      if (data) {
          setStepData(data.steps);
          setSleepData(data.sleep);
          setBMIData(data.bmi);
          setMindfulData(data.mindfulness);
          setWorkoutData(data.workout);
      }
  });
}, []);

// set a style for the navigation tabs
const screenOptions = {
  activeTintColor: 'black',
  inactiveTintColor: 'grey',
  labelStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    font: 'SF Pro Display'
  }
};
  return (
    <NavigationContainer>
      <View style={styles.container}>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen name="Summary" component={() => <Summary stepData={stepData} sleepData={sleepData} bmiData={bmiData} mindfulData={mindfulData} workoutData={workoutData} />} />
        <Tab.Screen name="Browse" component={Browse} />
      </Tab.Navigator >
      </View>
    </NavigationContainer>
  );
};

function Chat({navigation}) {
  return (
    <View style={styles.container}>
      <ChatComponent />
    </View>
  );
}

function Summary({ navigation, stepData, sleepData, bmiData, mindfulData }) {
  return (
      <View style={styles.container}>
      </View>
  );
}

function Browse({navigation}) {
  return (
    <View>
      <Text>Browse</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
});

export default App;
