import { View, StyleSheet } from 'react-native';
import AppBar from '../components/AppBar';
import RepositoryList from '../components/RepositoryList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e4e8',
  },
});

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <AppBar />
      <RepositoryList />
    </View>
  );
}
