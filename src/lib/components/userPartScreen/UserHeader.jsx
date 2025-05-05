import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { IconNotification, message } from '../../../assets/Icons/icons';
import avater from '../../../assets/Icons/avater.png';
import { useNavigation } from '@react-navigation/native';
import { useGetOwnProfileQuery } from '../../../redux/apiSlices/authApiSlice';
import tw from 'twrnc'; // ✅ Import twrnc

const UserHeader = () => {
  const { data, error, isLoading } = useGetOwnProfileQuery();
  const Navigation = useNavigation();

  if (error) {
    console.log('error', error);
  }
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <View style={tw`bg-[#ED1C24] pt-10 pb-5 px-5 rounded-b-2xl flex-row items-center justify-between w-full`}>
        <TouchableOpacity onPress={() => Navigation.navigate('Myaccount')}>
          <View style={tw`flex-row items-center mt-2`}>
            <Image source={{ uri: data?.data?.image }} style={tw`w-12 h-12 rounded-full mr-2.5`} />
            <View>
              <Text style={tw`text-white text-lg font-bold`}>{data?.data?.name}</Text>
              <Text style={tw`text-white text-sm`}>{data?.data?.address}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={tw`flex-row items-center gap-4`}>
          <TouchableOpacity onPress={() => Navigation.navigate('Chats')}>
            <SvgXml xml={message} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Navigation.navigate('Notification')}>
            <SvgXml xml={IconNotification} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default UserHeader;
