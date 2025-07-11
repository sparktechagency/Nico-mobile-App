import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import tw from '../../../lib/tailwind';
import Svg, {SvgXml} from 'react-native-svg';
import {
  aboutIcon,
  changepaswordIcon,
  faqIcon,
  LocationIcon,
  logoutIcon,
  privacyIcon,
  rightIcon,
  userIcon,
} from '../../../assets/Icons/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useGetOwnProfileQuery} from '../../../redux/apiSlices/authApiSlice';

const TechnicianProfile = ({navigation}) => {
  const {data, error, isLoading} = useGetOwnProfileQuery();

  console.log('data', data);
  if (error) {
    console.log('error', error);
  }
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  const menuItems = [
    {
      id: 1,
      icon: userIcon,
      title: 'Edit profile',
      route: 'Edit Profile',
    },
    {
      id: 2,
      icon: changepaswordIcon,
      title: 'Change password',
      route: 'Change password',
    },
    {
      id: 3,
      icon: aboutIcon,
      title: 'About us',
      route: 'About us',
    },
    {
      id: 4,
      icon: privacyIcon,
      title: 'Privacy policy',
      route: 'Privacy policy',
    },
    {
      id: 5,
      icon: faqIcon,
      title: 'FAQ',
      route: 'FAQ',
    },
    {
      id: 6,
      icon: logoutIcon,
      title: 'Logout',
    },
  ];
  const handleMenuPress = async item => {
    if (item.title === 'Logout') {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        {
          text: 'Cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              navigation.replace('InitialScreen');
            } catch (error) {
              console.log('Logout Error:', error);
            }
          },
          style: 'destructive',
        },
      ]);
    }

    if (item.route) {
      try {
        navigation.navigate(item.route);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  const renderHeader = () => (
    <View style={tw`px-4 py-6 bg-white flex-row items-center`}>
      <Image
        source={{uri: data?.data?.image}}
        style={tw`w-[50px] h-[50px] rounded-full mr-2`}
      />
      <View style={tw`flex-1  flex-row justify-between`}>
        <View>
          <Text style={tw`text-[16px] font-semibold text-[#000000] `}>
            {data?.data?.name}
          </Text>
          <Text style={tw`text-sm text-gray-500 `}>{data?.data?.email}</Text>
        </View>

        <View style={tw`flex flex-row items-center gap-2`}>
          <View>
            <Text style={tw`text-sm text-gray-500`}>Location</Text>
            <Text
              style={tw`text-[12px] font-medium text-[#000000] text-center`}>
              {data?.data?.address}
            </Text>
          </View>
          <View>
            <SvgXml xml={LocationIcon} />
          </View>
        </View>
      </View>
    </View>
  );

  const renderMenuItem = ({item}) => (
    <TouchableOpacity
      style={tw`mx-4 mb-3 bg-red-50 rounded-xl flex-row items-center justify-between p-4`}
      onPress={() => handleMenuPress(item)}
      activeOpacity={0.7}>
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-xl mr-4 w-6`}>
          <SvgXml xml={item.icon} />
        </Text>
        <Text style={tw`text-base text-gray-800`}>{item.title}</Text>
      </View>
      <Text style={tw`text-lg text-red-400`}>
        <SvgXml xml={rightIcon} />
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        // keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pt-2 pb-6 bg-white h-full`}
        removeClippedSubviews={false}
      />
    </>
  );
};

export default TechnicianProfile;

// import { View, Text } from 'react-native'
// import React from 'react'

// const TechnicianProfile = () => {
//   return (
//     <View>
//       <Text>TechnicianProfile</Text>
//     </View>
//   )
// }

// export default TechnicianProfile
