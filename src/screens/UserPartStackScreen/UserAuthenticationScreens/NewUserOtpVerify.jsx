import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from '../../../Context/ThemeContext';
import {
  useResendOTPMutation,
  useVerifyOTPMutation,
} from '../../../redux/apiSlices/authApiSlice';
import tw from '../../../lib/tailwind';

const OTP_LENGTH = 6;
const RESEND_TIMEOUT = 30; // seconds

const NewUserOtpVerify = ({route}) => {
  const {email} = route?.params || {};
  const [code, setCode] = useState(Array(OTP_LENGTH).fill(''));
  const [resendEnabled, setResendEnabled] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_TIMEOUT);
  const inputs = useRef([]);
  const navigation = useNavigation();
  const theme = useTheme();
  const translateY = useSharedValue(0);
  const [resendOTP, {isLoading: resendLoading}] = useResendOTPMutation();
  const [verifyOTP, {isLoading: verifyLoading}] = useVerifyOTPMutation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (value, index) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1].focus();
    }

    // Auto-submit if last digit is entered
    if (index === OTP_LENGTH - 1 && value) {
      handleVerifyCode();
    }
  };

  const handleBackspace = index => {
    if (index > 0 && !code[index]) {
      inputs.current[index - 1].focus();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const handleVerifyCode = async () => {
    if (code.some(digit => !digit)) {
      Alert.alert('Incomplete Code', 'Please enter all 6 digits');
      return;
    }

    try {
      const response = await verifyOTP({otp: code.join('')}).unwrap();
      if (response.status === true) {
        Alert.alert('Success', 'Verification successful.');
        navigation.navigate('LoginAsUser');
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert(
        'Verification Failed',
        error.data?.message || 'Invalid verification code. Please try again.',
      );
    }
  };

  const handleResend = async () => {
    if (!resendEnabled) return;

    try {
      const response = await resendOTP({email}).unwrap();
      if (response.status === true) {
        Alert.alert('Success', 'A new OTP has been sent to your email.');
        setResendEnabled(false);
        setCountdown(RESEND_TIMEOUT);
        setCode(Array(OTP_LENGTH).fill(''));
        inputs.current[0].focus();

        // Start countdown again
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendEnabled(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Resend error:', error);
      Alert.alert(
        'Error',
        error.data?.message ||
          'Failed to send verification code. Please try again.',
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View
        style={[
          styles.container,
          {backgroundColor: theme.background},
          animatedStyle,
        ]}>
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, {color: theme.text}]}>
              Verify Your Email
            </Text>
            <Text style={[styles.subtitle, {color: theme.textSecondary}]}>
              We've sent a 6-digit verification code to:
            </Text>
            <Text style={[styles.emailText, {color: theme.primary}]}>
              {email}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputs.current[index] = ref)}
                style={[
                  styles.inputBox,
                  {
                    color: theme.text,
                    borderColor: digit ? theme.primary : theme.border,
                    backgroundColor: theme.inputBackground,
                  },
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={value => handleChange(value, index)}
                onKeyPress={({nativeEvent}) => {
                  if (nativeEvent.key === 'Backspace') handleBackspace(index);
                }}
                selectionColor={theme.primary}
                autoFocus={index === 0}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              {
                backgroundColor: theme.primary,
              },
            ]}
            onPress={handleVerifyCode}
            disabled={!code.every(digit => digit) || verifyLoading}>
            {verifyLoading ? (
              <ActivityIndicator color={theme.background} />
            ) : (
              <Text style={styles.verifyButtonText}>Verify Code</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <Text style={[styles.footerText, {color: theme.textSecondary}]}>
              Didn't receive the code?
            </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={!resendEnabled || resendLoading}
              style={styles.resendButton}>
              {resendLoading ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : (
                <>
                  <Text style={[styles.resendText, {color: theme.primary}]}>
                    {resendEnabled ? 'Resend Code' : `Resend in ${countdown}s`}
                  </Text>
                  {resendEnabled && (
                    <View
                      style={[
                        styles.underline,
                        {backgroundColor: theme.primary},
                      ]}
                    />
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  inputBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: 'white',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  verifyButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    marginBottom: 24,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  footerContainer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
  resendButton: {
    alignItems: 'center',
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  underline: {
    height: 1,
    width: '100%',
    marginTop: 2,
  },
});

export default NewUserOtpVerify;
