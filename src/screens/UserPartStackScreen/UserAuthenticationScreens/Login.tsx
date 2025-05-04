import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Checkbox} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to install this package
import { useUselogdinMutation } from '../../../redux/apiSlices/authApiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
type RootStackParamList = {
  UserInitialScreen: undefined;
  ForgotPasswordAsUser: undefined;
  PreviousScreen: undefined; // Add your previous screen name here
};

type Theme = {
  background: string;
  text: string;
  primary: string;
  placeholder: string;
  border: string;
  error: string;
  buttonText: string;
  headerIcon: string;
};

// Mock hooks (replace with your actual implementations)
const useTheme = (): Theme => ({
  background: '#FFFFFF',
  text: '#000000',
  primary: '#ED1C24',
  placeholder: '#999999',
  border: '#CCCCCC',
  error: '#FF0000',
  buttonText: '#FFFFFF',
  headerIcon: '#000000',
});



// Main Component
const LoginScreenForUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const translateY = useSharedValue(0);
  const [uselogdin, {isLoading}] = useUselogdinMutation();

  const handleBack = () => {
    navigation.goBack(); // Or navigate to specific screen: navigation.navigate('PreviousScreen');
  };

  const handleLogin = async () => {
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      const result = await uselogdin({email, password});
      console.log('Login Result:', result);
      if(result.error){
        Alert.alert('Login Failed', result.error?.message);
      }
      if (result?.data?.access_token) {
        Alert.alert('Login Success', 'You have successfully logged in.');
        AsyncStorage.setItem('token', JSON.stringify(result?.data?.access_token));
        navigation.navigate('UserInitialScreen');
      }
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
    }
  };

  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        translateY.value = withTiming(-e.endCoordinates.height / 3, {duration: 250});
      }
    );
    
    const hideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        translateY.value = withTiming(0, {duration: 250});
      }
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.background}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View style={[styles.content, animatedStyle]}>
            {/* Header with Back Button */}
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color={theme.headerIcon} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled">
              <View style={styles.header}>
                <Text style={[styles.title, {color: theme.text}]}>Login to your account</Text>
                <Text style={[styles.subtitle, {color: theme.text}]}>
                  Please enter your email & password to continue
                </Text>
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={[styles.errorText, {color: theme.error}]}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.form}>
                <Text style={[styles.label, {color: theme.text}]}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: error ? theme.error : theme.border,
                      color: theme.text,
                    },
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={[styles.label, {color: theme.text}]}>Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: error ? theme.error : theme.border,
                      color: theme.text,
                    },
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <View style={styles.optionsRow}>
                  <View style={styles.rememberMe}>
                    <Checkbox
                      status={rememberMe ? 'checked' : 'unchecked'}
                      onPress={() => setRememberMe(!rememberMe)}
                      color={theme.primary}
                    />
                    <Text style={[styles.rememberText, {color: theme.text}]}>
                      Remember me
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPasswordAsUser')}>
                    <Text style={[styles.forgotText, {color: theme.primary}]}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.button, {backgroundColor: theme.primary}]}
                  onPress={handleLogin}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color={theme.buttonText} />
                  ) : (
                    <Text style={[styles.buttonText, {color: theme.buttonText}]}>
                      Sign In
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  errorBox: {
    backgroundColor: 'rgba(255,0,0,0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
  },
  forgotText: {
    fontWeight: '500',
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreenForUser;