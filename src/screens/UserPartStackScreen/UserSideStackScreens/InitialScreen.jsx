// import React from 'react';
// import { useState, useEffect } from "react";
// import { useNavigation } from '@react-navigation/native';
// import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform, StatusBar } from 'react-native';
// import { SvgXml } from 'react-native-svg';
// import tw from '../../../lib/tailwind';
// import { listNavigationIcon, qrscan } from '../../../assets/Icons/icons';
// import UserHeader from '../../../lib/components/userPartScreen/UserHeader';
// import QRCodeScanner from "./QRScanner";
// import { useGetTicketsQuery } from '../../../redux/apiSlices/ticketApi';
// const InitialScreenUser = () => {
//   const navigation = useNavigation();

//   const runningTickets = [
//     { id: '1', title: 'ViewSonic', code: 'JF2656NCDS8', date: '17/12/2024' },
//   ];
//   const pastTickets = [
//     {
//       id: '1', // Changed ID to make it unique
//       title: 'ViewSonic',
//       code: 'JF2656NCDS8',
//       address: 'Road no. 14, Block-D, Banasree, Dhaka.',
//       date: '10/12/2024',
//     },
//     {
//       id: '2', // Changed ID to make it unique
//       title: 'ViewSonic',
//       code: 'JF2656NCDS8',
//       address: 'Road no. 14, Block-D, Banasree, Dhaka.',
//       date: '10/12/2024',
//     },
//     {
//       id: '3', // Changed ID to make it unique
//       title: 'ViewSonic',
//       code: 'JF2656NCDS8',
//       address: 'Road no. 14, Block-D, Banasree, Dhaka.',
//       date: '10/12/2024',
//     },
//     {
//       id: '4', // Changed ID to make it unique
//       title: 'ViewSonic',
//       code: 'JF2656NCDS8',
//       address: 'Road no. 14, Block-D, Banasree, Dhaka.',
//       date: '10/12/2024',
//     },
//     {
//       id: '5', // Changed ID to make it unique
//       title: 'ViewSonic',
//       code: 'JF2656NCDS8',
//       address: 'Road no. 14, Block-D, Banasree, Dhaka.',
//       date: '10/12/2024',
//     },
//     {
//       id: '6', // Changed ID to make it unique
//       title: 'ViewSonic',
//       code: 'JF2656NCDS8',
//       address: 'Road no. 14, Block-D, Banasree, Dhaka.',
//       date: '10/12/2024',
//     },
//   ];

//   const [scannedData, setScannedData] = useState("");
//   const [hasPermission, setHasPermission] = useState(false);
//   const [isScanning, setIsScanning] = useState(false); // To control scanning state

//   const {data, error, isLoading} = useGetTicketsQuery();

//   console.log('tickets Data',data?.data?.data);
//   console.log('tickets Error',error);

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.centerText}>Something went wrong: {error.error || 'Unknown error'}</Text>
//       </View>
//     );
//   }

//   if(isLoading){
//     return (
//       <View style={styles.container}>
//         <Text style={styles.centerText}>Loading...</Text>
//       </View>
//     );
//   }

//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: "Camera Permission",
//             message: "App needs camera permission to scan QR codes",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK"
//           }
//         );
//         setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
//       } catch (err) {
//         console.warn(err);
//         setHasPermission(false);
//       }
//     } else {
//       setHasPermission(true);
//     }
//   };

//   useEffect(() => {
//     requestCameraPermission();
//   }, []);

//   const onSuccess = (e) => {
//     setScannedData(e.data);
//     setIsScanning(false); // Stop scanning after successful scan
//   };

//   if (!hasPermission) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.centerText}>Camera permission is required</Text>
//         <Button title="Request Permission" onPress={requestCameraPermission} />
//       </View>
//     );
//   }

//   const renderRunningTicket = ({ item }) => (
//     <TouchableOpacity
//       style={tw`shadow-lg bg-white p-4 rounded-lg flex-row items-center justify-between mb-4 mx-2`}
//       onPress={() => navigation.navigate('Details', { ticket: item })}>
//       <View style={styles.leftSection}>
//         <Text style={[styles.text, styles.title]}>{item.title}</Text>
//         <Text style={styles.text}>{item.code}</Text>
//       </View>
//       <Text style={styles.date}>{item.date}</Text>
//       <TouchableOpacity
//         style={[styles.checkoutButton, styles.checinButton]}>
//         <Text style={styles.checkoutText}>Check-in</Text>
//       </TouchableOpacity>

//       <SvgXml xml={listNavigationIcon} style={styles.arrowIcon} />
//     </TouchableOpacity>
//   );

//   const renderPastTicket = ({ item }) => (
//     <TouchableOpacity
//       style={tw`shadow-lg bg-white p-4 rounded-lg flex-row items-center justify-between mb-4 mx-2`}
//       onPress={() => navigation.navigate('Details', { ticket: item })}>
//       <View style={styles.leftSection}>
//         <Text style={[styles.text, styles.title]}>{item.title}</Text>
//         <Text style={styles.text}>{item.code}</Text>
//         <Text style={styles.addres}>{item.address}</Text>
//       </View>
//       <Text style={styles.date}>{item.date}</Text>
//       <TouchableOpacity style={styles.checkoutButton}>
//         <Text style={styles.checkoutText}>Check-out</Text>
//       </TouchableOpacity>
//       <SvgXml xml={listNavigationIcon} style={styles.arrowIcon} />
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <UserHeader />
//       <View >
//         <TouchableOpacity onPress={() => navigation.navigate('qrCamera')} style={tw`border border-dashed rounded-lg flex items-center justify-center p-4 mx-2 my-6 `}>

//           <SvgXml xml={qrscan} />
//           <Text>

//             Scan the QR code of your device
//           </Text>
//         </TouchableOpacity>
//         {/* <Button

//         title={isScanning ? "Stop Scanning" : "Start Scanning"}
//         onPress={() => setIsScanning(prevState => !prevState)}
//       /> */}
//         {isScanning && <QRCodeScanner onSuccess={onSuccess} />}
//         {scannedData ? <Text style={styles.scannedText}>Scanned: {scannedData}</Text> : null}
//       </View>

//       <View>
//         <Text style={styles.sectionTitle}>Open calls</Text>
//         <FlatList
//           data={runningTickets}
//           renderItem={renderRunningTicket}
//           keyExtractor={item => item.id}
//           removeClippedSubviews={false}

//         />
//       </View>
//       <View >
//         <View style={tw`flex flex-row items-center justify-between mb-2`}>
//           <Text style={styles.sectionTitle}>Closed calls</Text>
//           <TouchableOpacity onPress={() => navigation.navigate('viewallclosed')} style={tw`bg-transparent border border-[#FF6769] mr-2 px-4 py-1 rounded-md `}>
//             <Text style={tw` text-[#000000]`}>
//               See all
//             </Text>
//           </TouchableOpacity>
//         </View>
//         <FlatList
//           data={pastTickets}
//           renderItem={renderPastTicket}
//           keyExtractor={item => item.id}
//           ListFooterComponent={<View style={{ marginBottom: '60%' }} />} // Extra bottom space
//           removeClippedSubviews={false}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,

//     backgroundColor: 'white',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//     paddingLeft: 10,
//   },
//   centerText: {
//     fontSize: 18,
//     color: "#777",
//     marginBottom: 10,
//   },
//   scannedText: {
//     marginTop: 20,
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#000",
//     textAlign: 'center',
//     paddingHorizontal: 20,
//   },

//   // card: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   backgroundColor: '#FFFFFF',
//   //   padding: 10,
//   //   borderRadius: 8,
//   //   marginVertical: 5,
//   //   position: 'relative',
//   //   shadowColor: '#00000040',
//   //   shadowOpacity: 0.5,
//   //   shadowRadius: 5,
//   //   elevation: 3,
//   // },
//   leftSection: {
//     flex: 1,
//   },
//   text: {
//     fontSize: 12,
//     color: '#000000',
//     fontWeight: '500',
//     paddingTop: 5,
//   },
//   addres: {
//     fontSize: 14,
//     color: '#878787',
//     fontWeight: '500',
//     paddingTop: 5,
//   },

//   title: {
//     fontWeight: 'bold',
//     color: '#FF0205',
//     fontSize: 16,
//   },
//   date: {
//     position: 'absolute',
//     top: 10,
//     right: '45%',
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#878787',
//   },
//   checkoutButton: {
//     backgroundColor: '#00950A',
//     marginTop: '8%',
//     paddingHorizontal: 20,
//     paddingVertical: 4,
//     borderRadius: 100,
//   },
//   checinButton: {
//     backgroundColor: '#FF8383',
//     marginTop: '5%',
//     marginRight: "15%",
//     paddingHorizontal: 20,
//     paddingVertical: 4,
//     borderRadius: 100,
//   },
//   checkoutText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   arrowIcon: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
// });

// export default InitialScreenUser;

import React from 'react';
import {useState, useEffect} from 'react';
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
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import tw from 'twrnc';
import {listNavigationIcon, qrscan} from '../../../assets/Icons/icons';
import UserHeader from '../../../lib/components/userPartScreen/UserHeader';
import QRCodeScanner from './QRScanner';
import {useGetTicketsQuery} from '../../../redux/apiSlices/ticketApi';

const InitialScreenUser = () => {
  const navigation = useNavigation();
  const [scannedData, setScannedData] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const {data, error, isError, isLoading} = useGetTicketsQuery();

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

  useEffect(() => {
    requestCameraPermission();

    return () => {
      // Clean up any resources or subscriptions here
    };
  }, []);

  const onSuccess = e => {
    setScannedData(e.data);
    setIsScanning(false);
    navigation.navigate('TicketDetails', {scannedData: e.data});
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
    return (
      <View style={styles.container}>
        <Text style={styles.centerText}>Loading tickets...</Text>
      </View>
    );
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
    <ScrollView style={styles.container}>
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
          <View style={styles.scannerContainer}>
            <QRCodeScanner
              onSuccess={onSuccess}
              onCancel={() => setIsScanning(false)}
            />
          </View>
        )}

        {scannedData ? (
          <Text style={styles.scannedText}>Scanned: {scannedData}</Text>
        ) : null}
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
  scannerContainer: {
    height: 300,
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
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
});

export default InitialScreenUser;
