/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import ViewSite from './src/Page';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const windowHeight = Dimensions.get('window').height
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {/*<ScrollView
        contentInsetAdjustmentBehavior="automatic"
  style={backgroundStyle}>*/}
        <View
          style={{
            backgroundColor: Colors.white,
            flex: 1,
            minHeight: windowHeight
        }}>
          <ViewSite />
        </View>
      {/*</ScrollView>*/}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
