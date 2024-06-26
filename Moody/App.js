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
import SummaryComponent from './src/components/SummaryComponent';
import BrowseComponent from './src/components/BrowseComponent';
import navigationStyles from './src/styles/navigationStyles'; 
import Icon from 'react-native-vector-icons/MaterialIcons';


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
            workout: workoutData,
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
      postHealthData(data);
      return data;
    } catch (e) {
      console.error('Failed to read the health data from file:', e);
      return null; // return null or appropriate default value if error occurs
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
      font: 'SF Pro Display',
    },
  };
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: navigationStyles.tabBarStyle,
          headerShown: false,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: navigationStyles.labelStyle
        }}
      >
      <Tab.Screen
      name="Chat"
      component={ChatComponent}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="chat" color='black' size={size} />
        ),
      }}
      />
      <Tab.Screen
      name="Summary"
      children={() => <SummaryComponent
                        stepData={stepData}
                        sleepData={sleepData}
                        bmiData={bmiData}
                        mindfulData={mindfulData}
                        workoutData={workoutData} />}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="assessment" color='black' size={size} />
        ),
      }}
    />
      <Tab.Screen
        name="Browse"
        component={BrowseComponent}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color='black' size={size} />
          ),
        }}
      />
      </Tab.Navigator >
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

function Summary({navigation, stepData, sleepData, bmiData, mindfulData}) {
  return (
    <View style={styles.container}>
      <SummaryComponent
        stepData={stepData}
        sleepData={sleepData}
        bmiData={bmiData}
        mindfulData={mindfulData}
      />
    </View>
  );
}

function Browse({navigation}) {
  return (
    <View style={styles.container}>
      <BrowseComponent />
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

async function postHealthData(healthData) {
  try {
    await fetch('http://127.0.0.1:8000/import_data/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: JSON.stringify(healthData),
        timestamp: new Date(),
      }),
    });
    console.log(healthData);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

export default App;
