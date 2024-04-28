import React, { useEffect } from 'react';
import { SafeAreaView, Text, StatusBar, Button } from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';

/* Permission options */
const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
} as HealthKitPermissions;

const App = () => {
  useEffect(() => {
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        console.error('[ERROR] Cannot grant permissions!');
        return;
      }

      console.log('HealthKit initialized');
      fetchHeartRateData();
    });
  }, []);

  const fetchHeartRateData = () => {
    const options = {
      startDate: new Date(2020, 1, 1).toISOString(), // Use a more relevant date
    };

    AppleHealthKit.getHeartRateSamples(
      options,
      (callbackError: string, results: HealthValue[]) => {
        if (callbackError) {
          console.error('[ERROR] Failed to fetch heart rate samples:', callbackError);
          return;
        }
        // Handle the results
        console.log(results);
      },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar barStyle="dark-content" />
      <Text>Hello, HealthKit!</Text>
    </SafeAreaView>
  );
};

export default App;
