import {useNavigation} from '@react-navigation/native'; 
import React, {useState, useEffect} from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Platform
} from 'react-native';
import {useTheme} from '../../../Context/ThemeContext';
import { useResetpasswordMutation } from '../../../redux/apiSlices/authApiSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ResetPasswordScreenUser = ({route}) => {
  const {email} = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();

  const translateY = useSharedValue(0);
  const [resetpassword, {isLoading}] = useResetpasswordMutation();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        translateY.value = withTiming(-event.endCoordinates.height / 25, { duration: 500 });
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        translateY.value = withTiming(0, { duration: 500 });
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleResetPassword = async() => {
    const allpass = {
      email: email,
      password: password,
      password_confirmation: confirmPassword,
    };

    console.log('allpass',allpass);

    try {
      const resp = await resetpassword(allpass).unwrap();
      console.log('response',resp);

      if(resp.status === true){
        Alert.alert('Success', 'Password changed successfully.');
        navigation.navigate('LoginAsUser');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View style={[styles.container, {backgroundColor: theme.background}, animatedStyle]}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <Text style={[styles.title, {color: theme.text}]}>Set a new password</Text>
            <Text style={[styles.subtitle, {color: theme.text}]}>Create a new password. Ensure that password is different from previous one.</Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={[styles.text, {color: theme.text}]}>Password</Text>
            <View style={[styles.passwordContainer, {backgroundColor: theme.whitesmoke}]}>
              <TextInput
                style={[styles.passwordInput, {color: theme.text}]}
                placeholder="**********"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={theme.placeholder}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={theme.placeholder} 
                />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.text, {color: theme.text}]}>Confirm Password</Text>
            <View style={[styles.passwordContainer, {backgroundColor: theme.whitesmoke}]}>
              <TextInput
                style={[styles.passwordInput, {color: theme.text}]}
                placeholder="**********"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor={theme.placeholder}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={theme.placeholder} 
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              onPress={handleResetPassword}
              style={[styles.updateButton, {backgroundColor: theme.primary}]}>
              <Text style={[styles.updateButtonText, {color: theme.background}]}>{ isLoading ? 'Loading...' : 'UPDATE PASSWORD'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: '5%',
    paddingTop: '15%',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: '10%',
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    lineHeight: 30,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },
  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 21,
  },
  formContainer: {
    marginBottom: '5%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: '5%',
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontFamily: 'Poppins-Regular',
  },
  eyeIcon: {
    padding: 8,
  },
  updateButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    lineHeight: 24,
  },
});

export default ResetPasswordScreenUser;