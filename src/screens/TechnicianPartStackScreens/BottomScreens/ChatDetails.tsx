import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { backIcon } from '../../../assets/Icons/icons';
import {
  useGetMessageByreciverIdQuery,
  useSendMessageMutation,
} from '../../../redux/apiSlices/MessageApis';
import tw from 'twrnc';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { useGetOwnProfileQuery } from '../../../redux/apiSlices/authApiSlice';

type ChatDetailsProps = NativeStackScreenProps<RootStackParamList, 'ChatDetails'>;

interface Message {
  id: number;
  message: string;
  created_at: string;
  sender_id: number;
  receiver_id: number;
  is_read: number;
  updated_at: string;
}

interface MessagesResponse {
  current_page: number;
  data: Message[];
  last_page: number;
}

interface UserData {
  id: number;
  name: string;
  image?: string;
}

const ChatDetails = ({ route }: ChatDetailsProps) => {
  const { data: userData } = route.params as { data: UserData };

  console.log('reciveddata', userData);

  const { data, error, isLoading } = useGetOwnProfileQuery();

  const currentUserId = data?.data?.id;
  const receiverId = userData.id;
  const navigation = useNavigation();
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(1);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  console.log('all message', allMessages);
  // API hooks
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const {
    data: messagesResponse,
    isLoading: isMessagesLoading,
    isError,
    refetch,
  } = useGetMessageByreciverIdQuery({ id: receiverId, page });

  // Combine paginated messages
  useEffect(() => {
    if (messagesResponse?.data) {
      if (page === 1) {
        setAllMessages(messagesResponse.data);
      } else {
        setAllMessages(prev => [...messagesResponse.data, ...prev]);
      }
    }
  }, [messagesResponse, page]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (page === 1 && allMessages?.data?.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [allMessages, page]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        const response = await sendMessage({
          receiver_id: receiverId,
          message: newMessage,
        }).unwrap();
        console.log('response', response);
        setNewMessage('');
        // Refresh first page to show new message
        setPage(1);
        refetch();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const loadMoreMessages = () => {
    if (
      !isMessagesLoading &&
      messagesResponse &&
      page < messagesResponse.last_page
    ) {
      setPage(prev => prev + 1);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(1);
    refetch().finally(() => setIsRefreshing(false));
  }, [refetch]);

  if (isMessagesLoading && page === 1) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>Error loading messages</Text>
        <TouchableOpacity onPress={onRefresh} style={tw`mt-2`}>
          <Text style={tw`text-blue-500`}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      {/* Header */}
      <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-1 mr-2`}>
          <SvgXml xml={backIcon} />
        </TouchableOpacity>
        <View style={tw`flex-row items-center`}>
          {userData?.image ? (
            <Image
              source={{ uri: userData.image }}
              style={tw`w-10 h-10 rounded-full mr-2`}
            />
          ) : (
            <Image
              source={require('../../../assets/Icons/avater.png')}
              style={tw`w-10 h-10 rounded-full mr-2`}
            />
          )}
          <Text style={tw`text-base font-semibold`}>{userData?.name || 'N/A'}</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={tw`flex-1 p-4 mb-2`}
        onContentSizeChange={() => {
          if (page === 1) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }
        }}
        onScroll={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y <= 0 && !isRefreshing) {
            loadMoreMessages();
          }
        }}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>

        {allMessages?.data?.map((message: Message) => {
          // console.log(message.sender_id === currentUserId);
          console.log('message id ', message.sender_id, currentUserId);
          const isSent = message.sender_id === currentUserId;
          // const isReceived = message.sender_id !== currentUserId;
          // console.log('message', isSent, isReceived);
          const messageTime = new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <View
              key={`${message.id}_${message.created_at}`}
              style={tw.style(
                'flex-row mb-4 items-end',
                isSent ? 'justify-end' : 'justify-start'
              )}>
              {!isSent && (
                <Image
                  source={
                    userData?.image
                      ? { uri: userData.image }
                      : require('../../../assets/Icons/avater.png')
                  }
                  style={tw`w-8 h-8 rounded-full mr-2`}
                />
              )}
              <View
                style={tw.style(
                  'max-w-[70%] p-3 rounded-2xl',
                  isSent
                    ? 'bg-blue-50 rounded-br-sm'
                    : 'bg-gray-100 rounded-bl-sm'
                )}>
                <Text style={tw`text-sm leading-5`}>{message.message}</Text>
                <Text style={tw`text-xs text-gray-500 mt-1 self-end`}>
                  {messageTime}
                  {message.is_read === 0 && isSent && (
                    <Text style={tw`text-blue-500 ml-1`}>•</Text>
                  )}
                </Text>
              </View>
            </View>
          );
        })}

        {isMessagesLoading && page > 1 && (
          <View style={tw`py-2 justify-center items-center`}>
            <ActivityIndicator size="small" />
          </View>
        )}
      </ScrollView>

      {/* Chat Input */}
      <View style={tw`flex-row p-4 border-t border-gray-200 items-end`}>
        <TextInput
          style={tw.style(
            'flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2',
            'max-h-25 min-h-10'
          )}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
          maxHeight={100}
        />
        <TouchableOpacity
          style={tw.style(
            'px-5 py-2.5 rounded-full justify-center',
            !newMessage.trim() || isSending
              ? 'bg-gray-300'
              : 'bg-blue-500'
          )}
          onPress={handleSend}
          disabled={!newMessage.trim() || isSending}>
          {isSending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-white font-semibold`}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatDetails;