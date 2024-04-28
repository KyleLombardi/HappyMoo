import AppleHealthKit, {
  HealthValue,
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.BodyMassIndex,
      AppleHealthKit.Constants.Permissions.MindfulSession,
      AppleHealthKit.Constants.Permissions.Workout,
    ],
    write: [],
  },
};

export const initializeHealthKit = setHasPermissions => {
  AppleHealthKit.initHealthKit(permissions, (err, results) => {
    if (err) {
      console.error('error initializing Healthkit: ', err);
      return;
    }
    setHasPermissions(true);
    console.log('Healthkit initialized...');
  });
};

export const getStepCount = (startDate, endDate, setStepData) => {
  const options = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    interval: 'day',
  };

  AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
    if (err) {
      console.error('Error fetching daily step count samples:', err);
      return;
    }
    setStepData(
      results.map(sample => ({
        date: sample.startDate,
        steps: sample.value,
      })),
    );
  });
};

export const getSleepSamples = (startDate, endDate, setSleepData) => {
  const options = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    type: 'category',
  };

  AppleHealthKit.getSleepSamples(options, (err, results) => {
    if (err) {
      console.error('Error fetching sleep samples:', err);
      return;
    }
    setSleepData(
      results.map(sample => ({
        startDate: sample.startDate,
        endDate: sample.endDate,
        value: sample.value,
      })),
    );
  });
};

export const getBMISamples = (startDate, endDate, setBMIData) => {
  const options = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    type: 'quantity',
  };

  AppleHealthKit.getBmiSamples(options, (err, results) => {
    if (err) {
      console.error('Error fetching BMI records:', err);
      return;
    }
    setBMIData(
      results.map(sample => ({
        date: sample.startDate,
        bmi: sample.value,
      })),
    );
  });
};

export const getMindfulSessions = (startDate, endDate, setMindfulData) => {
  const options = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    type: 'category',
  };

  AppleHealthKit.getMindfulSession(options, (err, results) => {
    if (err) {
      console.error('Error fetching mindful session data:', err);
      return;
    }
    setMindfulData(
      results.map(sample => ({
        startDate: sample.startDate,
        endDate: sample.endDate,
      })),
    );
  });
};

export const getWorkoutSamples = (startDate, endDate, setWorkoutData) => {
  const options = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    type: 'workout',
  };

  AppleHealthKit.getSamples(options, (err, results) => {
    console.log('Workout fetch attempt:', options);
    if (err) {
      console.error('Error fetching workout samples:', err);
      return;
    }
    if (!results) {
      console.log('No workout data returned');
      return;
    }
    console.log('Workout data received:', results);
    const formattedData = results.map(sample => ({
      startDate: sample.startDate,
      endDate: sample.endDate,
      value: sample.value,
    }));
    setWorkoutData(formattedData);
  });
};
