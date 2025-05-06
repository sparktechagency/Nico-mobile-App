import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import tw from '../../../lib/tailwind';
import { useChangePasswordMutation, useGetOwnProfileQuery } from '../../../redux/apiSlices/authApiSlice';
import { editicon } from '../../../assets/Icons/icons';
import { SvgXml } from 'react-native-svg';

const ChangePassword = () => {
  const { data, error, isLoading: profileLoading } = useGetOwnProfileQuery();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    const passwords = {
      current_password: data.currentPassword,
      new_password: data.password,
      new_password_confirmation: data.confirmPassword,
    };

    try {
      const result = await changePassword(passwords).unwrap();
      if (result.status === true) {
        Alert.alert('Success', result.message || 'Password changed successfully.');
        // Reset the form after successful submission
        reset();
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message || 'Failed to change password.');
    }
  };


  if(profileLoading){
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`bg-white h-full`}>
      <View style={tw`p-4`}>
                <View style={tw`bg-[#F0F0F0] p-4 rounded-lg items-center`}>
                    <TouchableOpacity >
                    
                            <View style={tw`w-[100px] h-[100px] rounded-full bg-gray-300 justify-center items-center`}>
                               
                                <Image
                                    source={{ uri: data?.data?.image }}
                                    style={tw`w-full h-full rounded-full`}
                                />

                                <TouchableOpacity
                                   
                                    style={tw`absolute bottom-0 right-0 w-8 h-8  bg-white rounded-full items-center justify-center`}
                                >
                                   
                                        <SvgXml xml={editicon} />
                                  
                                </TouchableOpacity>
                            </View>
          
                    </TouchableOpacity>
                    <Text style={tw`text-[16px] text-[#000000] font-semibold mt-2`}>{ data?.data?.name}</Text>
                    <Text style={tw`text-[12px] text-[#878787] font-medium`}>{data?.data?.email}</Text>
                </View>
            </View>

      <View style={tw`p-4 gap-2`}>
        <View>
          <Text style={tw`text-[16px] pb-[3px] text-[#000000] font-semibold`}>
            Current password
          </Text>
          <Controller
            control={control}
            rules={{
              required: 'Current password is required',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="**********"
                placeholderTextColor={'#818181'}
                secureTextEntry={true}
                style={tw`text-[16px] text-[#000000] font-semibold p-4 bg-[#F0F0F0] rounded-sm`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="currentPassword"
          />
          {errors.currentPassword && (
            <Text style={tw`text-red-500 text-[12px]`}>
              {errors.currentPassword.message}
            </Text>
          )}
        </View>

        <View>
          <Text style={tw`text-[16px] pb-[3px] text-[#000000] font-semibold`}>
            New password
          </Text>
          <Controller
            control={control}
            rules={{
              required: 'New password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="**********"
                placeholderTextColor={'#818181'}
                secureTextEntry={true}
                style={tw`text-[16px] text-[#000000] font-semibold p-4 bg-[#F0F0F0] rounded-sm`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={tw`text-red-500 text-[12px]`}>
              {errors.password.message}
            </Text>
          )}
        </View>

        <View>
          <Text style={tw`text-[16px] pb-[3px] text-[#000000] font-semibold`}>
            Confirm password
          </Text>
          <Controller
            control={control}
            rules={{
              required: 'Confirm password is required',
              validate: (value, formValues) =>
                value === formValues.password || 'Passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="**********"
                placeholderTextColor={'#818181'}
                secureTextEntry={true}
                style={tw`text-[16px] text-[#000000] font-semibold p-4 bg-[#F0F0F0] rounded-sm`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="confirmPassword"
          />
          {errors.confirmPassword && (
            <Text style={tw`text-red-500 text-[12px]`}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          disabled={isLoading}
          style={tw`bg-[#ED1C24] p-4 rounded-lg flex-row items-center justify-center mt-4 max-w-[300px] mx-auto`}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={tw`text-[16px] text-white font-semibold`}>
            {isLoading ? 'Loading...' : 'SAVE CHANGES'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ChangePassword;