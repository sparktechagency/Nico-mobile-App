import React, {useState, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  StatusBar,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import tw from 'twrnc';
import {listNavigationIcon, qrscan} from '../../../assets/Icons/icons';
import UserHeader from '../../../lib/components/userPartScreen/UserHeader';
import QRCodeScanner from './QRScanner';
import {useGetTicketsQuery} from '../../../redux/apiSlices/ticketApi';
import LoadingSkeleton from '../../../lib/components/LoadingSkeleton';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const SCANNER_BOX_HEIGHT = 256;

const InitialScreenUser = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const {data, error, isError, isLoading, refetch} = useGetTicketsQuery();
  const scanLinePos = useRef(new Animated.Value(0)).current;

  // Safely process API data to separate open and closed tickets
  const tickets = data?.data?.data || [];
  const openTickets = tickets.filter(ticket =>
    ['New', 'Assigned'].includes(ticket.ticket_status),
  );
  const closedTickets = tickets.filter(ticket =>
    ['Completed', 'Closed'].includes(ticket.ticket_status),
  );

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to scan QR codes',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
        setHasPermission(false);
      }
    } else {
      setHasPermission(true);
    }
  };

  const startScanAnimation = () => {
    scanLinePos.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLinePos, {
          toValue: SCANNER_BOX_HEIGHT,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLinePos, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  useEffect(() => {
    if (isScanning) {
      startScanAnimation();
    } else {
      scanLinePos.stopAnimation();
    }
  }, [isScanning]);

  useEffect(() => {
    requestCameraPermission();
    return () => {
      // Clean up any resources or subscriptions here
    };
  }, []);

  const onSuccess = e => {
    console.log('Scanned Code:-------------', e);
    setScannedData(e);
    setIsScanning(false);
    navigation.navigate('Your Problem', {scannedData: e});
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.centerText}>
          Error loading tickets: {error?.message || 'Unknown error'}
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.centerText}>Camera permission is required</Text>
        <Button title="Request Permission" onPress={requestCameraPermission} />
      </View>
    );
  }

  const renderOpenTicket = ({item}) => (
    <TouchableOpacity
      style={[styles.card, tw`bg-white p-4 rounded-lg mb-4 mx-2`]}
      onPress={() => navigation.navigate('Details', {data: item})}>
      <View style={styles.ticketContent}>
        <View style={styles.leftSection}>
          <Text style={[styles.text, styles.title]}>
            {item.asset?.product || 'Unknown Product'}
          </Text>
          <Text style={styles.text}>
            Serial: {item.asset?.serial_number || 'N/A'}
          </Text>
          <Text style={styles.text}>Status: {item.ticket_status}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                item.ticket_status === 'Assigned'
                  ? styles.inProgressBadge
                  : styles.newBadge,
              ]}>
              <Text style={styles.statusText}>
                {item.ticket_status === 'Assigned' ? 'In Progress' : 'New'}
              </Text>
            </View>
            <SvgXml xml={listNavigationIcon} width={20} height={20} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderClosedTicket = ({item}) => (
    <TouchableOpacity
      style={[styles.card, tw`bg-white p-4 rounded-lg mb-4 mx-2`]}
      onPress={() => navigation.navigate('Details', {data: item})}>
      <View style={styles.ticketContent}>
        <View style={styles.leftSection}>
          <Text style={[styles.text, styles.title]}>
            {item.asset?.product || 'Unknown Product'}
          </Text>
          <Text style={styles.text}>
            Serial: {item.asset?.serial_number || 'N/A'}
          </Text>
          <Text style={styles.text}>Status: {item.ticket_status}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, styles.completedBadge]}>
              <Text style={styles.statusText}>Completed</Text>
            </View>
            <SvgXml xml={listNavigationIcon} width={20} height={20} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}>
      <StatusBar barStyle="light-content" />
      <UserHeader />

      {/* QR Scanner Section */}
      <View style={tw`px-2`}>
        <TouchableOpacity
          onPress={() => setIsScanning(true)}
          style={tw`border-2 border-dashed border-gray-300 rounded-lg items-center justify-center p-4 my-4`}>
          <SvgXml xml={qrscan} width={40} height={40} />
          <Text style={tw`mt-2 text-gray-600`}>
            Scan the QR code of your device
          </Text>
        </TouchableOpacity>

        {isScanning && (
          <Modal
            animationType="fade"
            onRequestClose={() => setIsScanning(false)}>
            <View
              style={tw`flex-1 bg-black bg-opacity-80 justify-center items-center`}>
              {/* SCANNER BOX */}
              <View
                style={tw`w-64 h-64 border-4 border-[#ED1C24] rounded-xl overflow-hidden relative`}>
                {/* QR Scanner */}
                <QRCodeScanner
                  onSuccess={onSuccess}
                  onCancel={() => setIsScanning(false)}
                  cameraStyle={{height: SCANNER_BOX_HEIGHT}}
                />

                {/* SCANNING LINE */}
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      transform: [{translateY: scanLinePos}],
                    },
                  ]}
                />

                {/* CORNER BORDERS */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>

              {/* SCAN INSTRUCTION TEXT */}
              <Text style={tw`text-white mt-4 text-lg`}>
                Align QR code within frame
              </Text>

              {/* CANCEL BUTTON */}
              <TouchableOpacity
                onPress={() => setIsScanning(false)}
                style={tw`mt-6 px-6 py-2 bg-red-500 rounded-full`}>
                <Text style={tw`text-white font-semibold`}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>

      {/* Open Tickets Section */}
      <View style={tw`px-2`}>
        <Text style={styles.sectionTitle}>
          Open Calls ({openTickets.length})
        </Text>
        {openTickets.length > 0 ? (
          <FlatList
            data={openTickets}
            renderItem={renderOpenTicket}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            removeClippedSubviews={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No open tickets found</Text>
          </View>
        )}
      </View>

      {/* Closed Tickets Section */}
      <View style={tw`px-2 mt-4`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={styles.sectionTitle}>
            Closed Calls ({closedTickets.length})
          </Text>
          {closedTickets.length > 3 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('ClosedTickets')}
              style={tw`border border-red-400 rounded-md px-3 py-1`}>
              <Text style={tw`text-gray-700`}>See all</Text>
            </TouchableOpacity>
          )}
        </View>

        {closedTickets.length > 0 ? (
          <FlatList
            data={closedTickets.slice(0, 3)}
            renderItem={renderClosedTicket}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            ListFooterComponent={<View style={tw`h-20`} />}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No closed tickets found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  card: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 2,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginVertical: 8,
  },
  centerText: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#edf2f7',
    borderRadius: 8,
    marginVertical: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#718096',
  },
  scannedText: {
    marginTop: 8,
    fontSize: 14,
    color: '#2d3748',
    textAlign: 'center',
    backgroundColor: '#ebf8ff',
    padding: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 13,
    color: '#4a5568',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e53e3e',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  newBadge: {
    backgroundColor: '#FF8383',
  },
  inProgressBadge: {
    backgroundColor: '#00950A',
  },
  completedBadge: {
    backgroundColor: '#00950A',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  scanLine: {
    position: 'absolute',
    height: 2,
    width: '100%',
    backgroundColor: '#ED1C24',
    shadowColor: '#ED1C24',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#ED1C24',
    borderWidth: 0,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
});

export default InitialScreenUser;
