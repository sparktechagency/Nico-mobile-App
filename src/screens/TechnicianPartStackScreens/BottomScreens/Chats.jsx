import {Text, View, FlatList, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import HeaderOnlySerch from '../../../lib/components/HeaderOnlySerch';
import {useNavigation} from '@react-navigation/native';
import {NavigationIcon} from '../../../assets/Icons/icons';
import {SvgXml} from 'react-native-svg';
import tw from 'twrnc';

const Chats = () => {
  const navigation = useNavigation();

  const chatesData = [
    {
      id: 1,
      name: 'Organization',
      image: require('../../../assets/Icons/avater.png'),
      time: '10:00 AM',
      messageCount: 2,
    },
    {
      id: 2,
      name: 'Location employee',
      image: require('../../../assets/Icons/avater.png'),
      time: '10:00 AM',
      messageCount: 6,
    },
    {
      id: 3,
      name: 'Organization',
      image: require('../../../assets/Icons/avater.png'),
      time: '10:00 AM',
      messageCount: 7,
    },
    {
      id: 4,
      name: 'Location employee',
      image: require('../../../assets/Icons/avater.png'),
      time: '10:00 AM',
      messageCount: 8,
    },
  ];

  return (
    <View style={tw`flex-1 bg-white`}>
      <HeaderOnlySerch />
      <View style={tw`p-5`}>
        <FlatList
          data={chatesData}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatDetail', {id: item.id})}>
              <View
                style={tw`flex-row items-center p-3 bg-gray-200 rounded-md mb-3 shadow`}>
                <Image
                  source={item.image}
                  style={tw`w-12 h-12 rounded-full mr-3`}
                />

                <View style={tw`flex-1`}>
                  <View style={tw`flex-row items-center justify-between py-1`}>
                    <Text style={tw`text-base font-bold text-black`}>
                      {item.name}
                    </Text>
                    <Text style={tw`text-xs text-gray-400`}>{item.time}</Text>
                  </View>
                  <View style={tw`flex-row items-center justify-between py-1`}>
                    <Text style={tw`text-xs font-normal text-black`}>
                      {item.messageCount} new messages
                    </Text>
                    <SvgXml xml={NavigationIcon} width={20} height={20} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          removeClippedSubviews={false}
        />
      </View>
    </View>
  );
};

export default Chats;
