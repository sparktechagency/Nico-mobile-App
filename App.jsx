import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/Context/ThemeContext';
import AppNavigation from './src/Navigation/AppNavigation';
import store from './src/redux/store';
import { Provider } from 'react-redux';


const App = () => {
  return (
    <>
      <SafeAreaProvider>
      <Provider store={store}>

          <SafeAreaView style={{flex: 1}} >
          <AppNavigation />
          </SafeAreaView>

      </Provider>
      </SafeAreaProvider>
    </>
  );
};

export default App;
