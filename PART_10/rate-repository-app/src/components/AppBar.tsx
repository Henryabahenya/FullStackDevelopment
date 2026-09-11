import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#24292e',
    flexDirection: 'row',
  },
  scrollView: {
    flexDirection: 'row',
  },
  tab: {
    padding: 15,
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
      <ScrollView horizontal contentContainerStyle={styles.scrollView}>
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
      </ScrollView>
    </View>
  );
};

export default AppBar;
