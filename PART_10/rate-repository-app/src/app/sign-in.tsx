import { View, StyleSheet } from 'react-native';
import AppBar from '../components/AppBar';
import SignIn from '../components/SignIn';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e4e8',
  },
});

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <AppBar />
      <SignIn />
    </View>
  );
}
