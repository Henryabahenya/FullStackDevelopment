import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
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
    marginRight: 15,
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
      <Link href="/" asChild>
        <Pressable style={styles.tab}>
          <Text style={styles.tabText}>Repositories</Text>
        </Pressable>
      </Link>
      <Link href="/sign-in" asChild>
        <Pressable style={styles.tab}>
          <Text style={styles.tabText}>Sign in</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default AppBar;
