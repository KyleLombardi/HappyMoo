import React from 'react';
// import type {PropsWithChildren} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
enableScreens();

const Tab = createBottomTabNavigator();

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen name="Summary" component={Summary} />
        <Tab.Screen name="Browse" component={Browse} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

function Chat({navigation}) {
  return (
    <View>
      <Text>Chat</Text>
    </View>
  );
}
function Summary({navigation}) {
  return (
    <View>
      <Text>Summary</Text>
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

export default App;