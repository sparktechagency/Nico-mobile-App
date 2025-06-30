import {Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '../Context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import InitialAppLogo from '../assets/Icons/splahslogo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from '../lib/tailwind'; // ✅ twrnc import
import {useGetOwnProfileQuery} from '../redux/apiSlices/authApiSlice';

const InitialScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {data, error, isLoading} = useGetOwnProfileQuery();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
          navigation.replace(
            `${
              data?.data?.role === 'user'
                ? 'UserInitialScreen'
                : 'TechnicianBottomTab'
            }`,
          );
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    checkToken();
  }, []);

  return (
    <View style={tw`flex-1 bg-white px-4 justify-center items-center`}>
      {/* App Logo */}
      <View style={tw`mb-4`}>
        <Image source={InitialAppLogo} />
      </View>

      {/* Welcome Text */}
      <Text
        style={tw`text-center text-[14px] text-black opacity-80 font-semibold  mb-10 leading-[21px]`}>
        Welcome to Track'd. The world's leading asset management and ticket
        logging platform.
      </Text>

      {/* Buttons */}
      <View style={tw`w-full justify-center items-center`}>
        {/* Sign Up Button */}
        <TouchableOpacity
          style={[
            tw`w-[90%] py-3 border rounded items-center mb-4`,
            {borderColor: theme.primary},
          ]}
          onPress={() => navigation.navigate('SignupAsUser')}>
          <Text
            style={[tw`text-[16px] font-bold leading-6`, {color: theme.text}]}>
            SIGN UP AS A USER
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[
            tw`w-[90%] py-3 border rounded items-center`,
            {borderColor: theme.primary},
          ]}
          onPress={() => navigation.navigate('LoginAsUser')}>
          <Text
            style={[tw`text-[16px] font-bold leading-6`, {color: theme.text}]}>
            LOGIN AS A TECHNICIAN
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InitialScreen;
