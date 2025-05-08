import React, {useEffect} from 'react';
import {LogBox, BackHandler} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/Context/ThemeContext';
import AppNavigation from './src/Navigation/AppNavigation';
import store from './src/redux/store';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  // Ignore specific mounting warnings
  useEffect(() => {
    LogBox.ignoreLogs([
      'Cannot remove child at index',
      'Warning: childCount may be incorrect',
    ]);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider>
            <AppNavigation />
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
    </SafeAreaView>
  );
};

export default App;
