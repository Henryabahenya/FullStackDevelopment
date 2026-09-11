import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const SignIn = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>The sign-in view</Text>
    </View>
  );
};

export default SignIn;
