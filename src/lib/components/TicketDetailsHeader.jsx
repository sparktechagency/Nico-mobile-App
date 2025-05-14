import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '../tailwind';
import {SvgXml} from 'react-native-svg';
import {backIcon} from '../../assets/Icons/icons';

const TicketDetailsHeader = ({status, ticketId}) => {
  const navigation = useNavigation();

  useEffect(() => {
    StatusBar.setBarStyle('white-content');
    StatusBar.setBackgroundColor('red');
  }, []);

  return (
    <View style={styles.headerContainer}>
      <View style={tw`flex flex-row justify-between max-w-[70%]`}>
        <View style={tw`flex flex-row items-center justify-center gap-4`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SvgXml xml={backIcon} style={styles.arrowIcon} />
          </TouchableOpacity>

          <Text style={styles.title}>Details</Text>
        </View>

        {(ticketId || status) && (
          <View style={tw`pt-4`}>
            {ticketId && <Text style={styles.code}>#{ticketId}</Text>}

            {status && (
              <TouchableOpacity style={styles.checinButton}>
                <Text style={styles.checkoutText}>{status}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  code: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: 5,
  },
  checinButton: {
    backgroundColor: '#FF8383',

    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 100,
    marginTop: 5,
  },
  checkoutText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});
export default TicketDetailsHeader;
