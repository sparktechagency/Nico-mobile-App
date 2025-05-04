// import { useNavigation } from '@react-navigation/native';
// import React, { useState, useEffect } from 'react';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from 'react-native-reanimated';
// import {
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   ScrollView,
//   Keyboard,
//   TouchableWithoutFeedback,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { useTheme } from '../../../Context/ThemeContext';
// import {  useUsesignUpMutation } from '../../../redux/apiSlices/authApiSlice';

// const SignUpScreen = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [password, setPassword] = useState('');
//   const [validationError, setValidationError] = useState('');
//   const navigation = useNavigation();
//   const theme = useTheme();

//   const [usesignUp, { isLoading }] = useUsesignUpMutation();
//   const translateY = useSharedValue(0);

//   const handleSignUp = async () => {
//     // Reset validation error
//     setValidationError('');
    
//     // Validate form fields
//     if (!name || !email || !address || !password) {
//       setValidationError('Please fill in all fields.');
//       return;
//     }
  
//     try {
//       const result = await usesignUp({ name, email, address, password }).unwrap();
//       console.log('Sign Up Success:', result);
      
//       // Navigate after successful signup
//       navigation.navigate('UserInitialScreen');
      
//     } catch (error: any) {
//       console.error('Sign Up Error:', error);
//       // Proper error handling for RTK Query
//       let errorMessage = 'Signup failed. Please try again.';
      
//       if (error.data?.message) {
//         errorMessage = error.data.message;
//       } else if (error.error) {
//         errorMessage = error.error;
//       } else if (error.status === 409) {
//         errorMessage = 'Email already exists';
//       }
      
//       Alert.alert('Sign Up Failed', errorMessage);
//     }
//   };

//   // Keyboard handling (your existing code)
//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       'keyboardDidShow',
//       event => {
//         translateY.value = withTiming(-event.endCoordinates.height / 25, {
//           duration: 500,
//         });
//       },
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       'keyboardDidHide',
//       () => {
//         translateY.value = withTiming(0, { duration: 500 });
//       },
//     );

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <Animated.View
//         style={[styles.container, { backgroundColor: theme.background }, animatedStyle]}>
//         <ScrollView
//           contentContainerStyle={styles.scrollContainer}
//           keyboardShouldPersistTaps="handled">
          
//           {/* First Part */}
//           <View style={styles.headerContainer}>
//             <Text style={[styles.title, { color: theme.text }]}>Sign Up to your account</Text>
//             <Text style={[styles.subtitle, { color: theme.text }]}>
//               Please enter your details to continue
//             </Text>
//           </View>
          
//           {/* Second Part - Input Fields */}
//           <View style={styles.formContainer}>
//             {validationError ? (
//               <Text style={[styles.errorText, { color: theme.error }]}>
//                 {validationError}
//               </Text>
//             ) : null}

//             <Text style={[styles.text, { color: theme.text }]}>Name</Text>
//             <TextInput
//               style={[
//                 styles.input, 
//                 { 
//                   backgroundColor: theme.whitesmoke, 
//                   color: theme.text,
//                   borderColor: validationError ? theme.error : '#ccc'
//                 }
//               ]}
//               placeholder="John Doe"
//               value={name}
//               onChangeText={setName}
//               placeholderTextColor={theme.placeholder}
//             />

//             <Text style={[styles.text, { color: theme.text }]}>Email</Text>
//             <TextInput
//               style={[
//                 styles.input, 
//                 { 
//                   backgroundColor: theme.whitesmoke, 
//                   color: theme.text,
//                   borderColor: validationError ? theme.error : '#ccc'
//                 }
//               ]}
//               placeholder="example@gmail.com"
//               keyboardType="email-address"
//               value={email}
//               onChangeText={setEmail}
//               placeholderTextColor={theme.placeholder}
//               autoCapitalize="none"
//             />

//             <Text style={[styles.text, { color: theme.text }]}>Address</Text>
//             <TextInput
//               style={[
//                 styles.input, 
//                 { 
//                   backgroundColor: theme.whitesmoke, 
//                   color: theme.text,
//                   borderColor: validationError ? theme.error : '#ccc'
//                 }
//               ]}
//               placeholder="1234 Main St"
//               value={address}
//               onChangeText={setAddress}
//               placeholderTextColor={theme.placeholder}
//             />

//             <Text style={[styles.text, { color: theme.text }]}>Password</Text>
//             <TextInput
//               style={[
//                 styles.input, 
//                 { 
//                   backgroundColor: theme.whitesmoke, 
//                   color: theme.text,
//                   borderColor: validationError ? theme.error : '#ccc'
//                 }
//               ]}
//               placeholder="**********"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//               placeholderTextColor={theme.placeholder}
//             />
            
//             <TouchableOpacity
//               onPress={handleSignUp}
//               style={[styles.signUpButton, { backgroundColor: theme.primary }]}
//               disabled={isLoading}
//               >
//               {isLoading ? (
//                 <ActivityIndicator color={theme.background} />
//               ) : (
//                 <Text style={[styles.buttonText, { color: theme.background }]}>
//                   Sign Up
//                 </Text>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* Third Part */}
//           <View style={styles.footerContainer}>
//             <Text style={[styles.footerText, { color: theme.text }]}>
//               Already have an account?
//             </Text>
//             <TouchableOpacity onPress={() => navigation.navigate("LoginAsUser")}>
//               <Text style={[styles.link, { color: theme.blue }]}>Log In</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </Animated.View>
//     </TouchableWithoutFeedback>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: '5%',
//     paddingTop: '15%',
//   },
//   headerContainer: {
//     alignItems: 'center',
//     marginBottom: '10%',
//   },
//   title: {
//     fontFamily: 'Poppins-Medium',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     lineHeight: 30,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontFamily: 'Poppins-Regular',
//     fontSize: 13,
//     lineHeight: 21,
//     textAlign: 'center',
//   },
//   text: {
//     fontFamily: 'Poppins-Medium',
//     fontSize: 14,
//     lineHeight: 21,
//   },
//   formContainer: {
//     marginBottom: '5%',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: '4%',
//     marginBottom: '5%',
//   },
//   signUpButton: {
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     fontFamily: 'Poppins-Bold',
//     lineHeight: 24,
//   },
//   footerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: '10%',
//   },
//   footerText: {
//     fontFamily: 'Poppins-Regular',
//     fontSize: 13,
//     lineHeight: 21,
//   },
//   link: {
//     fontFamily: 'Poppins-Medium',
//     fontSize: 13,
//     lineHeight: 21,
//   },
// });

// export default SignUpScreen;

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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../Context/ThemeContext';
import { useUsesignUpMutation } from '../../../redux/apiSlices/authApiSlice';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigation = useNavigation();
  const theme = useTheme();
  const translateY = useSharedValue(0);

  const [usesignUp, { isLoading }] = useUsesignUpMutation();

  const handleSignUp = async () => {
    setValidationError('');
    
    // Basic validation
    if (!name.trim() || !email.trim() || !address.trim() || !password.trim()) {
      setValidationError('All fields are required');
      return;
    }

 

    const formdata = new FormData();
    formdata.append('name', name);
    formdata.append('email', email);
    formdata.append('address', address);
    formdata.append('password', password);
    
    // Convert formdata._parts into object
    const formDataObject = Object.fromEntries(formdata._parts);
    console.log('Form Data Object:', formDataObject);
    
   try {
    const res = await usesignUp(formDataObject).unwrap();
    console.log('Sign Up Success:', res);
    if(res.status === true){
      navigation.navigate('NewUserOtpVerify');
      Alert.alert(
        'Success', 
        'Verification link sent to your email',
        [{ text: 'OK', onPress: () => navigation.navigate('NewUserOtpVerify',{email}) }],
      );
    }

    if(res.error){
      Alert.alert('Error', res.message || 'Failed to sign up');
    }

   } catch (error) {
    console.error('Error signing up:', error);
    Alert.alert('Error', error?.message || 'Failed to sign up');
    
   }
  };

  // Keyboard handling
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View
        style={[styles.container, { backgroundColor: theme.background }, animatedStyle]}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: theme.text }]}>Sign Up to your account</Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              Please enter your details to continue
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            {validationError ? (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {validationError}
              </Text>
            ) : null}

            <Text style={[styles.label, { color: theme.text }]}>Name</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.whitesmoke, 
                  color: theme.text,
                  borderColor: validationError ? theme.error : '#ccc'
                }
              ]}
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              placeholderTextColor={theme.placeholder}
            />

            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.whitesmoke, 
                  color: theme.text,
                  borderColor: validationError ? theme.error : '#ccc'
                }
              ]}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={theme.placeholder}
              autoCapitalize="none"
            />

            <Text style={[styles.label, { color: theme.text }]}>Address</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.whitesmoke, 
                  color: theme.text,
                  borderColor: validationError ? theme.error : '#ccc'
                }
              ]}
              placeholder="1234 Main St"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor={theme.placeholder}
            />

            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.whitesmoke, 
                  color: theme.text,
                  borderColor: validationError ? theme.error : '#ccc'
                }
              ]}
              placeholder="**********"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={theme.placeholder}
            />
            
            <TouchableOpacity
            disabled={isLoading}
              onPress={handleSignUp}
              style={[styles.signUpButton, { 
                backgroundColor:  theme.primary 
              }]}
         
            >
               <Text style={[styles.buttonText, { color: theme.background }]}>
                {isLoading ? 'Signing Up...' : 'Sign Up'}
               </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={[styles.footerText, { color: theme.text }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("LoginAsUser")}>
              <Text style={[styles.link, { color: theme.blue }]}>Log In</Text>
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
    padding: 20,
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    opacity: 0.7,
  },
  label: {
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
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  signUpButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  link: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 5,
  },
});

export default SignUpScreen;