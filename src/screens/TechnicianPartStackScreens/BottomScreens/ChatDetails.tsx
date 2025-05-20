// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   RefreshControl,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { SvgXml } from 'react-native-svg';
// import { backIcon } from '../../../assets/Icons/icons';
// import {
//   useGetMessageByreciverIdQuery,
//   useSendMessageMutation,
// } from '../../../redux/apiSlices/MessageApis';
// import tw from 'twrnc';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import type { RootStackParamList } from '../../../navigation/types';
// import { useGetOwnProfileQuery } from '../../../redux/apiSlices/authApiSlice';

// type ChatDetailsProps = NativeStackScreenProps<RootStackParamList, 'ChatDetails'>;

// interface Message {
//   id: number;
//   message: string;
//   created_at: string;
//   sender_id: number;
//   receiver_id: number;
//   is_read: number;
//   updated_at: string;
// }

// interface UserData {
//   id: number;
//   name: string;
//   image?: string;
// }

// const ChatDetails = ({ route }: ChatDetailsProps) => {
//   const { data: userData } = route.params as { data: UserData };
//   const { data: authData } = useGetOwnProfileQuery();
//   const currentUserId = authData?.data?.id;
//   const receiverId = userData.id;
//   const navigation = useNavigation();
//   const scrollViewRef = useRef<ScrollView>(null);

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isAutoScroll, setIsAutoScroll] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Pagination state
//   const [pagination, setPagination] = useState({
//     page: 1,
//     perPage: 10,
//     total: 0,
//     hasMore: true,
//     isLoadingMore: false,
//   });

//   const {
//     data: messagesResponse,
//     isLoading: isInitialLoading,
//     isFetching,
//     isError,
//     refetch,
//   } = useGetMessageByreciverIdQuery({
//     id: receiverId,
//     page: pagination.page,
//     per_page: pagination.perPage
//   });

//   const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

//   // Handle new data from API
//   useEffect(() => {
//     if (messagesResponse?.data) {
//       const newMessages = messagesResponse.data.data || [];
//       const total = messagesResponse.data.total || 0;
//       const lastPage = messagesResponse.data.last_page || 1;

//       setPagination(prev => ({
//         ...prev,
//         total,
//         hasMore: pagination.page < lastPage,
//         isLoadingMore: false,
//       }));

//       if (pagination.page === 1) {
//         // For first load, show newest at bottom
//         setMessages(newMessages);
//       } else {
//         // For pagination, prepend older messages at top
//         setMessages(prev => {
//           const existingIds = new Set(prev.map(m => m.id));
//           const filteredNew = newMessages.filter(m => !existingIds.has(m.id));
//           return [...filteredNew, ...prev];
//         });
//       }
//     }
//   }, [messagesResponse]);

//   // Auto scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (isAutoScroll && messages.length > 0) {
//       const timer = setTimeout(() => {
//         scrollViewRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [messages, isAutoScroll]);

//   const handleSend = async () => {
//     if (!newMessage.trim()) return;

//     // Optimistically add the message
//     const tempId = Date.now();
//     const tempMessage = {
//       id: tempId,
//       message: newMessage.trim(),
//       created_at: new Date().toISOString(),
//       sender_id: currentUserId,
//       receiver_id: receiverId,
//       is_read: 0,
//       updated_at: new Date().toISOString(),
//     };

//     setMessages(prev => [...prev, tempMessage]);
//     setNewMessage('');
//     setIsAutoScroll(true);

//     try {
//       const response = await sendMessage({
//         receiver_id: receiverId,
//         message: newMessage.trim(),
//       }).unwrap();

//       // Replace temp message with real one
//       setMessages(prev =>
//         prev.map(msg => msg.id === tempId ? response.data : msg)
//       );
//     } catch (error) {
//       // Remove temp message if send fails
//       setMessages(prev => prev.filter(msg => msg.id !== tempId));
//       console.error('Send failed:', error);
//     }
//   };

//   const loadMoreMessages = () => {
//     if (pagination.hasMore && !pagination.isLoadingMore) {
//       setPagination(prev => ({
//         ...prev,
//         page: prev.page + 1,
//         isLoadingMore: true
//       }));
//     }
//   };

//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const { contentOffset } = event.nativeEvent;
//     const isNearTop = contentOffset.y <= 50;

//     if (isNearTop && pagination.hasMore && !pagination.isLoadingMore) {
//       loadMoreMessages();
//     }

//     // Disable auto-scroll if user scrolls up
//     if (contentOffset.y < 0) {
//       setIsAutoScroll(false);
//     }
//   };

//   const onRefresh = useCallback(() => {
//     setIsRefreshing(true);
//     setPagination(prev => ({ ...prev, page: 1 }));
//     refetch().finally(() => setIsRefreshing(false));
//   }, [refetch]);

//   if (isInitialLoading && pagination.page === 1) {
//     return (
//       <View style={tw`flex-1 justify-center items-center`}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (isError) {
//     return (
//       <View style={tw`flex-1 justify-center items-center`}>
//         <Text style={tw`text-red-500`}>Error loading messages</Text>
//         <TouchableOpacity onPress={onRefresh} style={tw`mt-2`}>
//           <Text style={tw`text-blue-500`}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={tw`flex-1 bg-white`}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//     >
//       {/* Header */}
//       <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={tw`p-1 mr-2`}
//         >
//           <SvgXml xml={backIcon} />
//         </TouchableOpacity>
//         <View style={tw`flex-row items-center`}>
//           <Image
//             source={
//               userData?.image
//                 ? { uri: userData.image }
//                 : require('../../../assets/Icons/avater.png')
//             }
//             style={tw`w-10 h-10 rounded-full mr-2`}
//           />
//           <Text style={tw`text-base font-semibold`}>{userData?.name || 'N/A'}</Text>
//         </View>
//       </View>

//       {/* Messages */}
//       <ScrollView
//         ref={scrollViewRef}
//         style={tw`flex-1 p-4 mb-2`}
//         contentContainerStyle={tw`flex-col-reverse`} // This reverses the order
//         onScroll={handleScroll}
//         scrollEventThrottle={400}
//         // refreshControl={
//         //   <RefreshControl
//         //     refreshing={isRefreshing}
//         //     onRefresh={onRefresh}
//         //   />
//         // }
//         onContentSizeChange={() => {
//           if (isAutoScroll) {
//             scrollViewRef.current?.scrollToEnd({ animated: true });
//           }
//         }}
//       >
//         {pagination.isLoadingMore && pagination.page > 1 && (
//           <View style={tw`py-4 justify-center items-center`}>
//             <ActivityIndicator size="large" />
//           </View>
//         )}

//         {messages.map((message) => {
//           const isSent = message.sender_id === currentUserId;
//           const messageTime = new Date(message.created_at).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true,
//           });

//           return (
//             <View
//               key={`${message.id}_${message.created_at}`}
//               style={tw.style(
//                 'flex-row mb-4 items-end',
//                 isSent ? 'justify-end' : 'justify-start'
//               )}
//             >
//               {!isSent && (
//                 <Image
//                   source={
//                     userData?.image
//                       ? { uri: userData.image }
//                       : require('../../../assets/Icons/avater.png')
//                   }
//                   style={tw`w-8 h-8 rounded-full mr-2`}
//                 />
//               )}
//               <View
//                 style={tw.style(
//                   'max-w-[70%] p-3 rounded-2xl',
//                   isSent ? 'bg-blue-50 rounded-br-sm' : 'bg-gray-100 rounded-bl-sm'
//                 )}
//               >
//                 <Text style={tw`text-sm leading-5`}>{message.message}</Text>
//                 <Text style={tw`text-xs text-gray-500 mt-1 self-end`}>
//                   {messageTime}
//                   {message.is_read === 0 && isSent && (
//                     <Text style={tw`text-blue-500 ml-1`}>•</Text>
//                   )}
//                 </Text>
//               </View>
//             </View>
//           );
//         })}
//       </ScrollView>

//       {/* Input Section */}
//       <View style={tw`flex-row p-4 border-t border-gray-200 items-end`}>
//         <TextInput
//           style={tw`flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 max-h-25 min-h-10`}
//           value={newMessage}
//           onChangeText={setNewMessage}
//           placeholder="Type a message..."
//           multiline

//         />
//         <TouchableOpacity
//           style={tw.style(
//             'px-5 py-2.5 rounded-full justify-center',
//             !newMessage.trim() || isSending ? 'bg-gray-300' : 'bg-blue-500'
//           )}
//           onPress={handleSend}
//           disabled={!newMessage.trim() || isSending}
//         >
//           {isSending ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text style={tw`text-white font-semibold`}>Send</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default ChatDetails;









// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { SvgXml } from 'react-native-svg';
// import { backIcon } from '../../../assets/Icons/icons';
// import {
//   useGetMessageByreciverIdQuery,
//   useSendMessageMutation,
// } from '../../../redux/apiSlices/MessageApis';
// import tw from 'twrnc';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import type { RootStackParamList } from '../../../navigation/types';
// import { useGetOwnProfileQuery } from '../../../redux/apiSlices/authApiSlice';

// type ChatDetailsProps = NativeStackScreenProps<RootStackParamList, 'ChatDetails'>;

// interface Message {
//   id: number;
//   message: string;
//   created_at: string;
//   sender_id: number;
//   receiver_id: number;
//   is_read: number;
//   updated_at: string;
// }

// interface MessagesResponse {
//   current_page: number;
//   data: Message[];
//   last_page: number;
// }

// interface UserData {
//   id: number;
//   name: string;
//   image?: string;
// }

// const ChatDetails = ({ route }: ChatDetailsProps) => {
//   const { data: userData } = route.params as { data: UserData };

//   console.log('reciveddata', userData);

//   const { data, error, isLoading } = useGetOwnProfileQuery();

//   const currentUserId = data?.data?.id;
//   const receiverId = userData.id;
//   const navigation = useNavigation();
//   const [newMessage, setNewMessage] = useState('');
//   const scrollViewRef = useRef<ScrollView>(null);
//   const [page, setPage] = useState(1);
//   const [allMessages, setAllMessages] = useState<Message[]>([]);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   console.log('all message', allMessages);
//   // API hooks
//   const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
//   const {
//     data: messagesResponse,
//     isLoading: isMessagesLoading,
//     isError,
//     refetch,
//   } = useGetMessageByreciverIdQuery({ id: receiverId, page });

//   // Combine paginated messages
//   useEffect(() => {
//     if (messagesResponse?.data) {
//       if (page === 1) {
//         setAllMessages(messagesResponse.data);
//       } else {
//         setAllMessages(prev => [...messagesResponse.data, ...prev]);
//       }
//     }
//   }, [messagesResponse, page]);

//   // Scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (page === 1 && allMessages?.data?.length > 0) {
//       setTimeout(() => {
//         scrollViewRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     }
//   }, [allMessages, page]);

//   const handleSend = async () => {
//     if (newMessage.trim()) {
//       try {
//         const response = await sendMessage({
//           receiver_id: receiverId,
//           message: newMessage,
//         }).unwrap();
//         console.log('response', response);
//         setNewMessage('');
//         // Refresh first page to show new message
//         setPage(1);
//         refetch();
//       } catch (error) {
//         console.error('Failed to send message:', error);
//       }
//     }
//   };

//   const loadMoreMessages = () => {
//     if (
//       !isMessagesLoading &&
//       messagesResponse &&
//       page < messagesResponse.last_page
//     ) {
//       setPage(prev => prev + 1);
//     }
//   };

//   const onRefresh = useCallback(() => {
//     setIsRefreshing(true);
//     setPage(1);
//     refetch().finally(() => setIsRefreshing(false));
//   }, [refetch]);

//   if (isMessagesLoading && page === 1) {
//     return (
//       <View style={tw`flex-1 justify-center items-center`}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (isError) {
//     return (
//       <View style={tw`flex-1 justify-center items-center`}>
//         <Text style={tw`text-red-500`}>Error loading messages</Text>
//         <TouchableOpacity onPress={onRefresh} style={tw`mt-2`}>
//           <Text style={tw`text-blue-500`}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={tw`flex-1 bg-white`}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
//       {/* Header */}
//       <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={tw`p-1 mr-2`}>
//           <SvgXml xml={backIcon} />
//         </TouchableOpacity>
//         <View style={tw`flex-row items-center`}>
//           {userData?.image ? (
//             <Image
//               source={{ uri: userData.image }}
//               style={tw`w-10 h-10 rounded-full mr-2`}
//             />
//           ) : (
//             <Image
//               source={require('../../../assets/Icons/avater.png')}
//               style={tw`w-10 h-10 rounded-full mr-2`}
//             />
//           )}
//           <Text style={tw`text-base font-semibold`}>{userData?.name || 'N/A'}</Text>
//         </View>
//       </View>

//       {/* Chat Messages */}
//       <ScrollView
//         ref={scrollViewRef}
//         style={tw`flex-1 p-4 mb-2`}
//         onContentSizeChange={() => {
//           if (page === 1) {
//             scrollViewRef.current?.scrollToEnd({ animated: true });
//           }
//         }}
//         onScroll={({ nativeEvent }) => {
//           if (nativeEvent.contentOffset.y <= 0 && !isRefreshing) {
//             loadMoreMessages();
//           }
//         }}
//         scrollEventThrottle={400}
//         refreshControl={
//           <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
//         }>

//         {allMessages?.data?.map((message: Message) => {
//           // console.log(message.sender_id === currentUserId);
//           console.log('message id ', message.sender_id, currentUserId);
//           const isSent = message.sender_id === currentUserId;
//           // const isReceived = message.sender_id !== currentUserId;
//           // console.log('message', isSent, isReceived);
//           const messageTime = new Date(message.created_at).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true,
//           });

//           return (
//             <View
//               key={`${message.id}_${message.created_at}`}
//               style={tw.style(
//                 'flex-row mb-4 items-end',
//                 isSent ? 'justify-end' : 'justify-start'
//               )}>
//               {!isSent && (
//                 <Image
//                   source={
//                     userData?.image
//                       ? { uri: userData.image }
//                       : require('../../../assets/Icons/avater.png')
//                   }
//                   style={tw`w-8 h-8 rounded-full mr-2`}
//                 />
//               )}
//               <View
//                 style={tw.style(
//                   'max-w-[70%] p-3 rounded-2xl',
//                   isSent
//                     ? 'bg-blue-50 rounded-br-sm'
//                     : 'bg-gray-100 rounded-bl-sm'
//                 )}>
//                 <Text style={tw`text-sm leading-5`}>{message.message}</Text>
//                 <Text style={tw`text-xs text-gray-500 mt-1 self-end`}>
//                   {messageTime}
//                   {message.is_read === 0 && isSent && (
//                     <Text style={tw`text-blue-500 ml-1`}>•</Text>
//                   )}
//                 </Text>
//               </View>
//             </View>
//           );
//         })}

//         {isMessagesLoading && page > 1 && (
//           <View style={tw`py-2 justify-center items-center`}>
//             <ActivityIndicator size="small" />
//           </View>
//         )}
//       </ScrollView>

//       {/* Chat Input */}
//       <View style={tw`flex-row p-4 border-t border-gray-200 items-end`}>
//         <TextInput
//           style={tw.style(
//             'flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2',
//             'max-h-25 min-h-10'
//           )}
//           value={newMessage}
//           onChangeText={setNewMessage}
//           placeholder="Type a message..."
//           multiline
//           maxHeight={100}
//         />
//         <TouchableOpacity
//           style={tw.style(
//             'px-5 py-2.5 rounded-full justify-center',
//             !newMessage.trim() || isSending
//               ? 'bg-gray-300'
//               : 'bg-blue-500'
//           )}
//           onPress={handleSend}
//           disabled={!newMessage.trim() || isSending}>
//           {isSending ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text style={tw`text-white font-semibold`}>Send</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default ChatDetails;


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
  NativeSyntheticEvent,
  NativeScrollEvent,
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

interface UserData {
  id: number;
  name: string;
  image?: string;
}

const ChatDetails = ({ route }: ChatDetailsProps) => {
  const { data: userData } = route.params as { data: UserData };
  const { data: authData } = useGetOwnProfileQuery();
  const currentUserId = authData?.data?.id;
  const receiverId = userData.id;
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    hasMore: true,
    isLoadingMore: false,
  });

  const {
    data: messagesResponse,
    isLoading: isInitialLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMessageByreciverIdQuery({
    id: receiverId,
    page: pagination.page,
    per_page: pagination.perPage
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  // Handle new data from API
  useEffect(() => {
    if (messagesResponse?.data) {
      const newMessages = messagesResponse.data.data || [];
      const total = messagesResponse.data.total || 0;
      const lastPage = messagesResponse.data.last_page || 1;
      setPagination(prev => ({
        ...prev,
        total,
        hasMore: prev.page < lastPage,
        isLoadingMore: false,
      }));


      if (pagination.page === 1) {
        // For first load, show newest at bottom
        setMessages(newMessages); // Reverse to show latest at bottom
      } else {
        // For pagination, append older messages at top
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const filteredNew = newMessages.filter(m => !existingIds.has(m.id));
          return [...filteredNew, ...prev]; // Reverse new messages before prepending
        });
      }
    }
  }, [messagesResponse]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAutoScroll && messages.length > 0) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isAutoScroll]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // Optimistically add the message
    const tempId = Date.now();
    const tempMessage = {
      id: tempId,
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
      sender_id: currentUserId,
      receiver_id: receiverId,
      is_read: 0,
      updated_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setIsAutoScroll(true);

    try {
      const response = await sendMessage({
        receiver_id: receiverId,
        message: newMessage.trim(),
      }).unwrap();

      // Replace temp message with real one
      setMessages(prev =>
        prev.map(msg => msg.id === tempId ? response.data : msg)
      );
    } catch (error) {
      // Remove temp message if send fails
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      console.error('Send failed:', error);
    }
  };

  const loadMoreMessages = () => {
    if (pagination.hasMore && !pagination.isLoadingMore) {
      setPagination(prev => ({
        ...prev,
        page: prev.page + 1,
        isLoadingMore: true
      }));
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isNearTop = contentOffset.y <= 50;
    const isAtBottom = contentOffset.y >= contentSize.height - layoutMeasurement.height - 20;

    if (isNearTop && pagination.hasMore && !pagination.isLoadingMore) {
      loadMoreMessages();
    }

    // Enable auto-scroll if user scrolls to bottom
    if (isAtBottom) {
      setIsAutoScroll(true);
    } else {
      setIsAutoScroll(false);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPagination(prev => ({ ...prev, page: 1 }));
    refetch().finally(() => setIsRefreshing(false));
  }, [refetch]);

  if (isInitialLoading && pagination.page === 1) {
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-1 mr-2`}
        >
          <SvgXml xml={backIcon} />
        </TouchableOpacity>
        <View style={tw`flex-row items-center`}>
          <Image
            source={
              userData?.image
                ? { uri: userData.image }
                : require('../../../assets/Icons/avater.png')
            }
            style={tw`w-10 h-10 rounded-full mr-2`}
          />
          <Text style={tw`text-base font-semibold`}>{userData?.name || 'N/A'}</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={tw`flex-1 p-4 mb-2`}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
        onContentSizeChange={() => {
          if (isAutoScroll) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }
        }}
      >
        {pagination.isLoadingMore && pagination.page > 1 && (
          <View style={tw`py-4 justify-center items-center`}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {messages.map((message) => {
          const isSent = message.sender_id === currentUserId;
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
              )}
            >
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
                  isSent ? 'bg-blue-50 rounded-br-sm' : 'bg-gray-100 rounded-bl-sm'
                )}
              >
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
      </ScrollView>

      {/* Input Section */}
      <View style={tw`flex-row p-4 border-t border-gray-200 items-end`}>
        <TextInput
          style={tw`flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 max-h-25 min-h-10`}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={tw.style(
            'px-5 py-2.5 rounded-full justify-center',
            !newMessage.trim() || isSending ? 'bg-gray-300' : 'bg-blue-500'
          )}
          onPress={handleSend}
          disabled={!newMessage.trim() || isSending}
        >
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