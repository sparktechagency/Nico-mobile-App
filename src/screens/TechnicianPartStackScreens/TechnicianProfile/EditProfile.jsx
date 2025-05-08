import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {SvgXml} from 'react-native-svg';
import tw from '../../../lib/tailwind';
import {editicon} from '../../../assets/Icons/icons';
import {
  useGetOwnProfileQuery,
  useUpdateProfileMutation,
} from '../../../redux/apiSlices/authApiSlice';

const EditProfile = () => {
  const [imageUri, setImageUri] = useState(null);
  const [imagefile, setImageFile] = useState(null);
  const {data, isLoading} = useGetOwnProfileQuery();
  const [updateProfile, {isLoading: isUpdating}] = useUpdateProfileMutation();
  console.log('imagefile', imagefile);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  // Prefill form when data loads
  useEffect(() => {
    if (data?.data) {
      reset({
        name: data.data.name || '',
        address: data.data.address || '',
      });
      setImageUri(data.data.image || null);
    }
  }, [data, reset]);

  const onSubmit = async formData => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('image', {
      uri: imagefile.uri,
      type: imagefile.type,
      name: imagefile.fileName,
    });

    //   console.log('Form Data:', formDataToSend);

    if (!imagefile?.uri) {
      Alert.alert('Image is not found');
    }

    try {
      const resp = await updateProfile(formDataToSend).unwrap();
      console.log('Update Response:', resp);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      console.error('Update Error:', err);
      Alert.alert('Error', 'Failed to updatee profile');
    }
  };

  const handleImagePick = response => {
    setImageFile(response.assets[0]);
    if (
      !response.didCancel &&
      !response.errorCode &&
      response.assets?.[0]?.uri
    ) {
      const uri = response.assets[0].uri;
      setImageUri(uri);
    }
  };
  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('Error: ', response.errorMessage);
        } else {
          setImageUri(response.assets[0].uri);
        }
      },
    );
  };

  const pickImage = (fromCamera = false) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    if (fromCamera) {
      launchCamera(options, handleImagePick);
    } else {
      launchImageLibrary(options, handleImagePick);
    }
  };

  if (isLoading) return <Text style={tw`p-4`}>Loading profile...</Text>;

  return (
    <ScrollView style={tw`bg-white h-full`}>
      <View style={tw`p-4`}>
        <View style={tw`bg-[#F0F0F0] p-4 rounded-lg items-center`}>
          <TouchableOpacity onPress={openGallery}>
            <View
              style={tw`w-[100px] h-[100px] rounded-full bg-gray-300 justify-center items-center`}>
              <Image
                source={{uri: data?.data?.image}}
                style={tw`w-full h-full rounded-full`}
              />

              <TouchableOpacity
                onPress={() => pickImage(true)}
                style={tw`absolute bottom-0 right-0 w-8 h-8  bg-white rounded-full items-center justify-center`}>
                <SvgXml xml={editicon} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <Text style={tw`text-[16px] text-[#000000] font-semibold mt-2`}>
            {data?.data?.name}
          </Text>
          <Text style={tw`text-[12px] text-[#878787] font-medium`}>
            {data?.data?.email}
          </Text>
        </View>
      </View>

      <View style={tw`p-4 gap-4`}>
        {/* Name */}
        <View>
          <Text style={tw`text-[16px] font-semibold mb-1`}>Name</Text>
          <Controller
            control={control}
            name="name"
            rules={{required: 'Name is required'}}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={tw`bg-[#F0F0F0] p-3 rounded text-[16px]`}
                placeholder="Enter your name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text style={tw`text-red-500 text-xs mt-1`}>
              {errors.name.message}
            </Text>
          )}
        </View>

        {/* Email (disabled) */}
        <View>
          <Text style={tw`text-[16px] font-semibold mb-1`}>Email</Text>
          <TextInput
            style={tw`bg-[#F0F0F0] p-3 rounded text-[16px] opacity-70`}
            value={data?.data?.email || ''}
            editable={false}
          />
        </View>

        {/* Address */}
        <View>
          <Text style={tw`text-[16px] font-semibold mb-1`}>Address</Text>
          <Controller
            control={control}
            name="address"
            rules={{required: 'Address is required'}}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={tw`bg-[#F0F0F0] p-3 rounded text-[16px]`}
                placeholder="Enter your address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.address && (
            <Text style={tw`text-red-500 text-xs mt-1`}>
              {errors.address.message}
            </Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isUpdating}
          onPress={handleSubmit(onSubmit)}
          style={tw`bg-[#ED1C24] p-3 rounded-lg mt-6 items-center`}>
          <Text style={tw`text-white font-semibold text-[16px]`}>
            {isUpdating ? 'Updating...' : 'SAVE CHANGES'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
