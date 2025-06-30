import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../../../Context/ThemeContext';
import { useForgetPasswordMutation } from '../../../redux/apiSlices/authApiSlice';

const ForgotPasswordScreenUser = () => {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigation = useNavigation();
  const theme = useTheme();

  const translateY = useSharedValue(0);
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        translateY.value = withTiming(-event.endCoordinates.height / 25, {
          duration: 500,
        });
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleforgot = async () => {
    setValidationError('');

    // Basic validation
    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    try {
      const result = await forgetPassword({ email }).unwrap();
      console.log('API Success:', result);

      // Handle successful response
      if (result.status === true) {
        navigation.navigate('VerificationAsUser', { email });
        Alert.alert(
          'Success',
          'Password reset link sent to your email',
          [{ text: 'OK', onPress: () => navigation.navigate('VerificationAsUser', { email }) }],
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to send reset link');
      }
    } catch (error: any) {
      console.log('API Error:', error);

      let errorMessage = 'Failed to send reset link. Please try again.';

      if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.error) {
        errorMessage = error.error;
      }

      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: theme.background },
          animatedStyle,
        ]}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: theme.text }]}>
              Forgot your password
            </Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              Enter your registered email
            </Text>
          </View>
          <View style={styles.formContainer}>
            {validationError ? (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {validationError}
              </Text>
            ) : null}

            <Text style={[styles.text, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.whitesmoke,
                  color: theme.text,
                  borderColor: validationError ? theme.error : '#ccc'
                },
              ]}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={theme.placeholder}
              autoCapitalize="none"
            />
            <TouchableOpacity
              disabled={isLoading}
              onPress={handleforgot}
              style={[styles.sendCodeButton, { backgroundColor: theme.primary }]}>
              {isLoading ? (
                <ActivityIndicator color={theme.background} />
              ) : (
                <Text style={[styles.sendCodeButtonText, { color: theme.background }]}>
                  Send Code
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 140,
    height: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    opacity: 0.7,
  },
  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  sendCodeButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCodeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreenUser;