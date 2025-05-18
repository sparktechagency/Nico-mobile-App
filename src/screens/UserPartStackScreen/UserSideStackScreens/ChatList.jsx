import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import HeaderOnlySerch from '../../../lib/components/HeaderOnlySerch';
import {useNavigation} from '@react-navigation/native';
import {addicon, NavigationIcon} from '../../../assets/Icons/icons';
import {SvgXml} from 'react-native-svg';
import {useGetAuthUserChatlistQuery} from '../../../redux/apiSlices/MessageApis';

const ChatList = () => {
  const navigation = useNavigation();

  const {data: chatList} = useGetAuthUserChatlistQuery();

  console.log('Chat list', chatList);

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
    <View style={styles.container}>
      <HeaderOnlySerch />
      <View style={styles.contentContainer}>
        <FlatList
          data={chatesData}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatDetail', {id: item.id})}>
              <View style={styles.chatCard}>
                <Image source={item.image} style={styles.avatar} />

                <View style={styles.chatInfo}>
                  <View style={styles.flexitem}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatTime}>{item.time}</Text>
                  </View>
                  <View style={styles.flexitem}>
                    <Text style={styles.messageCount}>click to view chat</Text>
                    <SvgXml xml={NavigationIcon} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          removeClippedSubviews={false}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('SelectAtechnician')}
          style={styles.addButton}>
          <SvgXml xml={addicon} width={50} height={50} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 20,
    flex: 1,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F1F1F1',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  flexitem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  chatTime: {
    fontSize: 12,
    color: '#A8A8A8',
  },
  messageCount: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '400',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
