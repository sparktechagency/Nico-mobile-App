import React, {useCallback} from 'react';
import {Text, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import tw from 'twrnc';
import {
  useGetAuthuserNotificationQuery,
  useReadNotificationMutation,
} from '../../redux/apiSlices/notification';
import {Checkbox} from 'react-native-paper';

const Notification = () => {
  const {data, isLoading, isError} = useGetAuthuserNotificationQuery();
  const [readNotification, {isLoading: isReadLoading, isError: isReadError}] =
    useReadNotificationMutation();
  console.log('notification', data);
  const handleReadNotification = useCallback(
    async id => {
      try {
        const response = await readNotification({id}).unwrap();
        if (response.status === true) {
          Alert.alert('Success', 'Notification marked as read.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to read notification.');
      }
    },
    [readNotification],
  );

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text>Error loading notifications</Text>
      </View>
    );
  }

  const transformNotificationData = notification => {
    const dateObj = new Date(notification.created_at);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    let title = '';
    let content = '';

    switch (notification.type) {
      case 'App\\Notifications\\JobCardNotification':
        title = 'Job Card Update';
        content = 'There is an update on your job card';
        break;
      case 'App\\Notifications\\InspectionSheetNotification':
        title = 'Inspection Sheet';
        content = 'New inspection sheet available';
        break;
      case 'App\\Notifications\\NewTicketNotification':
        title = 'New Ticket';
        content = 'A new ticket has been created';
        break;
      default:
        title = 'Notification';
        content = 'You have a new notification';
    }

    return {
      id: notification.id,
      title,
      content,
      date,
      time,
      isRead: notification.read_at !== null,
      read_at: notification.read_at,
    };
  };

  const notifications = data?.data?.map(transformNotificationData) || [];
  const NotificationItem = ({item}) => (
    <TouchableOpacity
      disabled={isReadLoading || item.isRead}
      onPress={() => handleReadNotification(item.id)}
      style={tw`mb-2`}>
      <View
        style={tw.style(
          `flex-row justify-between items-center p-4 rounded-lg`,
          !item.isRead ? `bg-blue-100` : `bg-gray-100`, // <-- use item.isRead
        )}>
        <View style={tw`flex-1 mr-2`}>
          <Text style={tw`text-base font-semibold text-red-400 mb-1`}>
            {item.title}
          </Text>
          <Text style={tw`text-sm text-black`}>{item.content}</Text>
        </View>
        <View style={tw`flex flex-row items-end`}>
          <View>
            <Text style={tw`text-xs text-gray-500`}>{item.date}</Text>
            <Text style={tw`text-xs text-gray-500`}>{item.time}</Text>
            <Text style={tw`text-xs text-gray-500`}>
              {item.isRead ? 'Read' : 'Unread'}
            </Text>
          </View>

          <Checkbox
            color={item.isRead ? '#00950A' : 'white'}
            status={item.isRead ? 'checked' : 'unchecked'}
            onPress={() => handleReadNotification(item.id)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <FlatList
        data={notifications}
        renderItem={({item}) => <NotificationItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={tw`p-4`}
        removeClippedSubviews={false}
      />
    </View>
  );
};

export default Notification;
