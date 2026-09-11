import { View, Text, Pressable, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#24292e',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  tab: {
    padding: 10,
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.tab}>
        <Text style={styles.tabText}>Repositories</Text>
      </Pressable>
    </View>
  );
};

export default AppBar;
