import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import InitialScreen from '../screens/InitialScreen';
import SplashScreen from '../screens/SplashScreen';

// User side authentication screens start
import ForgotPasswordAsUser from '../screens/UserPartStackScreen/UserAuthenticationScreens/ForgotPassword';
import LoginAsUser from '../screens/UserPartStackScreen/UserAuthenticationScreens/Login';
import ResetPasswordAsUser from '../screens/UserPartStackScreen/UserAuthenticationScreens/ResetPassword';
import SignupAsUser from '../screens/UserPartStackScreen/UserAuthenticationScreens/Signup';
import VerificationAsUser from '../screens/UserPartStackScreen/UserAuthenticationScreens/Verification';
// User side authentication screens end

// User side Main screens start

import UserInitialScreen from '../screens/UserPartStackScreen/UserSideStackScreens/InitialScreen';

// User side Main screens end

// Technician side authentication screens start
import ForgotPassword from '../screens/TechnicianPartStackScreens/ForgotPassword';
import LoginScreen from '../screens/TechnicianPartStackScreens/LoginScreen';
import SetNewPassword from '../screens/TechnicianPartStackScreens/SetNewPassword';
import Verification from '../screens/TechnicianPartStackScreens/Verification';
// Technician side authentication screens start End

// Technician side Profile screens start Start
import TechnicianProfile from '../screens/TechnicianPartStackScreens/TechnicianProfile/TechnicianProfile';
// Technician side Profile screens start End

import TechnicianBottomTab from './TechnicianBottomTab';
import ChatDetails from '../screens/TechnicianPartStackScreens/BottomScreens/ChatDetails';
import Notification from '../screens/notification/Notification';
import EditProfile from '../screens/TechnicianPartStackScreens/TechnicianProfile/EditProfile';
import ChnagePassword from '../screens/TechnicianPartStackScreens/TechnicianProfile/ChnagePassword';
import AboutUs from '../screens/TechnicianPartStackScreens/TechnicianProfile/AboutUs';
import PrivacyPolocy from '../screens/TechnicianPartStackScreens/TechnicianProfile/PrivacyPolocy';
import FAQ from '../screens/TechnicianPartStackScreens/TechnicianProfile/FAQ';
import TicketDetails from '../screens/TechnicianPartStackScreens/BottomScreens/Tickets/TicketDetails';
import InspactionDetails from '../screens/TechnicianPartStackScreens/BottomScreens/InspactionDetails';
import JobcardDetails from '../screens/TechnicianPartStackScreens/BottomScreens/JobcardDetails';
import QrcodeCameraScreen from '../screens/UserPartStackScreen/UserSideStackScreens/QrcodeCameraScreen';
import YourProblem from '../screens/UserPartStackScreen/UserSideStackScreens/YourProblem';
import ViewAllClosed from '../screens/UserPartStackScreen/UserSideStackScreens/ViewAllClosed';
import UserCallsDetails from '../screens/UserPartStackScreen/UserSideStackScreens/UserCallsDetails';
import ChatList from '../screens/UserPartStackScreen/UserSideStackScreens/ChatList';
import {StatusBar, TouchableOpacity} from 'react-native';
import NewUserOtpVerify from '../screens/UserPartStackScreen/UserAuthenticationScreens/NewUserOtpVerify';
import SelectAtechnician from '../screens/UserPartStackScreen/UserSideStackScreens/SelectAtechnician';
import {useGetOwnProfileQuery} from '../redux/apiSlices/authApiSlice';
import TicketList from '../screens/TechnicianPartStackScreens/BottomScreens/Tickets/RenderList';
import Chats from '../screens/TechnicianPartStackScreens/BottomScreens/Chats';
import {SvgXml} from 'react-native-svg';
import {backIcon} from '../assets/Icons/icons';
// import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const {data, error, isLoading} = useGetOwnProfileQuery();
  console.log('user data', data?.data?.role);

  return (
    <NavigationContainer
      onStateChange={state => {
        // Helps prevent navigation state corruption
        if (!state) return;
      }}>
      <StatusBar
        backgroundColor="#ED1C24"
        barStyle="light-content"
        translucent={false}
      />
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InitialScreen"
          component={InitialScreen}
          options={{
            headerShown: false,
            animationEnabled: false, // Disable all animations
            gestureEnabled: false, // Disable gestures
          }}
        />
        {/* User side authentication screens start */}

        <Stack.Screen
          name="SignupAsUser"
          component={SignupAsUser}
          options={{
            headerShown: true,
            animation: 'none',
            headerTitle: '', // Hide title
            headerShadowVisible: false, // Removes the bottom shadow (for native stack)
            headerStyle: {
              elevation: 0, // Removes shadow on Android
              shadowOpacity: 0, // Removes shadow on iOS
            },
          }}
        />

        <Stack.Screen
          name="LoginAsUser"
          component={LoginAsUser}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

        <Stack.Screen
          name="ForgotPasswordAsUser"
          component={ForgotPasswordAsUser}
          options={{
            headerShown: true,
            animation: 'none',
            headerTitle: '', // Hide title
            headerShadowVisible: false, // Removes the bottom shadow (for native stack)
            headerStyle: {
              elevation: 0, // Removes shadow on Android
              shadowOpacity: 0, // Removes shadow on iOS
            },
          }}
        />

        <Stack.Screen
          name="VerificationAsUser"
          component={VerificationAsUser}
          options={{
            headerShown: true,
            animation: 'none',
            headerTitle: '', // Hide title
            headerShadowVisible: false, // Removes the bottom shadow (for native stack)
            headerStyle: {
              elevation: 0, // Removes shadow on Android
              shadowOpacity: 0, // Removes shadow on iOS
            },
          }}
        />
        <Stack.Screen
          name="NewUserOtpVerify"
          component={NewUserOtpVerify}
          options={{
            headerShown: true,
            animation: 'none',
            headerTitle: '', // Hide title
            headerShadowVisible: false, // Removes the bottom shadow (for native stack)
            headerStyle: {
              elevation: 0, // Removes shadow on Android
              shadowOpacity: 0, // Removes shadow on iOS
            },
          }}
        />

        <Stack.Screen
          name="ResetPasswordAsUser"
          component={ResetPasswordAsUser}
          options={{
            headerShown: true,
            animation: 'none',
            headerTitle: '', // Hide title
            headerShadowVisible: false, // Removes the bottom shadow (for native stack)
            headerStyle: {
              elevation: 0, // Removes shadow on Android
              shadowOpacity: 0, // Removes shadow on iOS
            },
          }}
        />

        {/* User side authentication screens End */}

        {/* User side Main screens Start*/}

        <Stack.Screen
          name="UserInitialScreen"
          component={UserInitialScreen}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

        <Stack.Screen
          name="technicianInitialScreen"
          component={TicketList}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

        <Stack.Screen
          name="qrCamera"
          component={QrcodeCameraScreen}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        <Stack.Screen
          name="Your Problem"
          component={YourProblem}
          options={{
            headerStyle: {
              backgroundColor: 'red',

              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
              elevation: 0,

              shadowOpacity: 0,
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="viewallclosed"
          component={ViewAllClosed}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        <Stack.Screen
          name="Details"
          component={UserCallsDetails}
          options={{
            headerStyle: {
              backgroundColor: 'red',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: 'white',
          }}
        />

        {/* User side Main screens End*/}

        {/* Technician side authentication screens start */}

        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerShown: true,
            animation: 'none',
            headerTitle: '', // Hide title
            headerShadowVisible: false,
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />

        <Stack.Screen
          name="Verification"
          component={Verification}
          options={{
            headerShown: true,
            animation: 'none',
            headerTitle: '', // Hide title
            headerShadowVisible: false, // Removes the bottom shadow (for native stack)
            headerStyle: {
              elevation: 0, // Removes shadow on Android
              shadowOpacity: 0, // Removes shadow on iOS
            },
          }}
        />

        <Stack.Screen
          name="SetNewPassword"
          component={SetNewPassword}
          options={{
            headerShown: true,
            animation: 'none',
            headerTitle: '', // Hide title
            headerShadowVisible: false, // Removes the bottom shadow (for native stack)
            headerStyle: {
              elevation: 0, // Removes shadow on Android
              shadowOpacity: 0, // Removes shadow on iOS
            },
          }}
        />

        {/* Technician side authentication screens End */}

        {/* // Technician side Profile screens start Start */}
        <Stack.Screen
          name="Myaccount"
          component={TechnicianProfile}
          options={{
            headerStyle: {
              backgroundColor: 'red',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="Edit Profile"
          component={EditProfile}
          options={({navigation}) => ({
            title: 'Edit Profile',
            headerStyle: {
              backgroundColor: 'red',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 100,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleAlign: 'center',
            headerTintColor: 'white',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <SvgXml xml={backIcon} />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="Change password"
          component={ChnagePassword}
          options={({navigation}) => ({
            title: 'Change password',
            headerStyle: {
              backgroundColor: 'red',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 100,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleAlign: 'center',
            headerTintColor: 'white',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <SvgXml xml={backIcon} />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="About us"
          component={AboutUs}
          options={({navigation}) => ({
            title: 'About us',
            headerStyle: {
              backgroundColor: 'red',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 100,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleAlign: 'center',
            headerTintColor: 'white',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <SvgXml xml={backIcon} />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="Privacy policy"
          component={PrivacyPolocy}
          options={({navigation}) => ({
            title: 'Privacy policy',
            headerStyle: {
              backgroundColor: 'red',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 100,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleAlign: 'center',
            headerTintColor: 'white',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <SvgXml xml={backIcon} />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="FAQ"
          component={FAQ}
          options={({navigation}) => ({
            title: 'FAQ',
            headerStyle: {
              backgroundColor: 'red',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 100,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleAlign: 'center',
            headerTintColor: 'white',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <SvgXml xml={backIcon} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="TicketDetails"
          component={TicketDetails}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="inspactionDetails"
          component={InspactionDetails}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="jobcarddetails"
          component={JobcardDetails}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{
            headerStyle: {
              backgroundColor: 'red',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: 'white',
          }}
        />

        {/* // Technician side Profile screens start End */}

        {/* // Technician side Bottom Navigator  screen start  */}

        <Stack.Screen
          name="TechnicianBottomTab"
          component={TechnicianBottomTab}
          options={{
            headerShown: false,
            // animation: 'none',
            presentation: 'transparentModal',
          }}
        />
        <Stack.Screen
          name="Chats"
          component={Chats}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SelectAtechnician"
          component={SelectAtechnician}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChatDetail"
          component={ChatDetails}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>

      {/* // Technician side Bottom Navigator  screen End  */}
    </NavigationContainer>
  );
};

export default AppNavigation;
