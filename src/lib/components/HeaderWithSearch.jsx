import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {IconNotification, search} from '../../assets/Icons/icons';
import {useGetOwnProfileQuery} from '../../redux/apiSlices/authApiSlice';
import {useGetAuthuserNotificationQuery} from '../../redux/apiSlices/notification';
import tw from '../tailwind';

const HeaderWithSearch = ({setSearchQuery, title}) => {
  const navigation = useNavigation();
  const {data, error, isLoading} = useGetOwnProfileQuery();
  const {
    data: notification,
    isLoading: isNotificationLoading,
    isError: isNotificationError,
  } = useGetAuthuserNotificationQuery();
  console.log('notification', notification);
  const unreadNotifications = notification?.data?.filter(
    item => item.read_at === null,
  );
  console.log('unreadNotifications', unreadNotifications);

  if (error) {
    console.log('error', error);
  }

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('red');
  }, []);

  if (isLoading || isNotificationLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Myaccount')}>
          <View style={styles.leftContainer}>
            <Image
              source={{
                uri:
                  data?.data?.image || 'https://www.gravatar.com/avatar/?d=mp',
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.welcomeText}>Welcome Back,</Text>
              <Text style={styles.userName}>
                {data?.data?.name || 'Technician'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Notification')}
          style={styles.notificationButton}>
          <SvgXml xml={IconNotification} />
          {unreadNotifications?.length > 0 && (
            <View
              style={tw` absolute top-0 right-0 bg-[#F7FF83] rounded-full w-4 h-4 flex items-center justify-center`}>
              <Text style={tw`text-[#000000] text-xs font-bold`}>
                {unreadNotifications?.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={title}
          placeholderTextColor="gray"
          onChangeText={text => setSearchQuery(text)}
        />
        <SvgXml xml={search} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  welcomeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: 'black',
  },
  searchIcon: {
    marginLeft: 8,
  },
});

export default HeaderWithSearch;
