import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import HeaderOnlySerch from '../../../lib/components/HeaderOnlySerch';
import { useNavigation } from '@react-navigation/native';
import { addicon } from '../../../assets/Icons/icons';
import { SvgXml } from 'react-native-svg';
import { useGetAuthUserChatlistQuery } from '../../../redux/apiSlices/MessageApis';
import tw from 'twrnc';

interface ChatUser {
  id: number;
  name: string;
  image?: string;
  email: string;
}

interface ChatItem {
  id: number;
  user: ChatUser;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface ChatListResponse {
  chat_list: ChatItem[];

}

interface TransformedChatItem {
  id: number;
  name: string;
  image: { uri: string } | number;
  message: string;
  time: string;
  user: ChatUser;
  is_read: boolean;
}

const Chats = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const navigation = useNavigation();

  // Debounce search input (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // API call with debounced search query
  const {
    data: chatList,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAuthUserChatlistQuery<ChatListResponse>(
    debouncedSearchQuery ? { search: debouncedSearchQuery } : {},
  );

  // Transform API data for FlatList
  const transformChatData = (): TransformedChatItem[] => {
    if (!chatList?.chat_list) return [];

    return chatList.chat_list.map(chat => ({
      id: chat.id,
      name: chat.user?.name || 'Unknown User',
      image: chat.user?.image
        ? { uri: chat.user.image }
        : require('../../../assets/Icons/avater.png'),
      message: chat.message,
      time: new Date(chat.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      user: {
        id: chat.user?.id,
        name: chat.user?.name,
        image: chat.user?.image,
        email: chat.user?.email,
      },
      is_read: chat.is_read,
    }));
  };

  const renderItem = ({ item }: { item: TransformedChatItem }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChatDetail', { data: item.user })}
      style={tw`mb-2`}>
      <View style={tw`flex-row items-center p-4 bg-gray-50 rounded-lg`}>
        <Image
          source={item.image}
          style={tw`w-12 h-12 rounded-full mr-3`}
          resizeMode="cover"
        />
        <View style={tw`flex-1`}>
          <View style={tw`flex-row justify-between mb-1`}>
            <Text style={tw`text-base font-bold text-black`}>{item.name}</Text>
            <Text style={tw`text-xs text-gray-500`}>{item.time}</Text>
          </View>
          <Text
            style={[
              tw`text-sm text-gray-600`,
              !item.is_read && tw`font-semibold text-black`
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !isFetching) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>
          Error: {error?.data?.message || 'Failed to load chats'}
        </Text>
        <TouchableOpacity
          onPress={refetch}
          style={tw`mt-4 px-4 py-2 bg-blue-500 rounded`}
        >
          <Text style={tw`text-white`}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <HeaderOnlySerch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search chats..."
      />

      <View style={tw`flex-1 p-4`}>
        <FlatList
          data={transformChatData()}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={tw`flex-1 justify-center items-center mt-10`}>
              <Text style={tw`text-gray-500 text-lg`}>
                {debouncedSearchQuery
                  ? 'No matching chats found'
                  : 'No chats available'}
              </Text>
            </View>
          }
          contentContainerStyle={tw`pb-16`}
          refreshing={isFetching}
          onRefresh={refetch}
          removeClippedSubviews={false}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('SelectAtechnician')}
        style={tw`absolute bottom-5 right-5 bg-[#ED1C24] rounded-full p-3 shadow-lg`}>
        <SvgXml xml={addicon} width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
};

export default Chats;