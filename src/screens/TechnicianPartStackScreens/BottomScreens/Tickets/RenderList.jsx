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
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import tw from 'twrnc';
import {useGetTicketsQuery} from '../../../../redux/apiSlices/ticketApi';
import LoadingSkeleton from '../../../../lib/components/LoadingSkeleton';

import {listNavigationIcon} from '../../../../assets/Icons/icons';
import UserHeader from '../../../../lib/components/userPartScreen/UserHeader';
import HeaderWithSearch from '../../../../lib/components/HeaderWithSearch';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const SCANNER_BOX_HEIGHT = 256;

const TicketList = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  console.log('searchQuery', debouncedSearchQuery);
  // Debounce search input (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {data, error, isError, isLoading, refetch} = useGetTicketsQuery(
    debouncedSearchQuery ? {search: debouncedSearchQuery} : {},
  );
  console.log('data', data);
  // Safely process API data to separate open and closed tickets
  const tickets = data?.data?.data || [];
  const openTickets = tickets.filter(ticket =>
    ['New', 'Assigned'].includes(ticket.ticket_status),
  );
  const closedTickets = tickets.filter(ticket =>
    ['Completed', 'Closed'].includes(ticket.ticket_status),
  );

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

  const renderOpenTicket = ({item}) => (
    <TouchableOpacity
      style={[styles.card, tw`bg-white p-4 rounded-lg mb-4 mx-2 `]}
      onPress={() => navigation.navigate('TicketDetails', {ticketData: item})}>
      <View style={styles.ticketContent}>
        <View style={styles.leftSection}>
          <Text style={[styles.text, styles.title]}>
            {item?.asset?.product || 'Unknown Product'}
          </Text>
          <Text style={tw`text-[#000000] text-[14px] font-medium`}>
            {item?.order_number || 'N/A'}
          </Text>
        </View>

        <View style={tw`flex flex-row items-center`}>
          <Text style={tw`absolute -left-14 text-[#878787] -top-2`}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.rightSection}>
          <View style={tw`mb-4`}>
            <SvgXml
              style={tw`absolute top-0 right-0`}
              xml={listNavigationIcon}
            />
          </View>
          <View style={tw`mt-4 mr-10`}>
            <View
              style={[
                styles.statusBadge,
                item.ticket_status === 'Assigned'
                  ? styles.inProgressBadge
                  : styles.newBadge,
                {marginRight: 10, width: 100, textAlign: 'center'},
              ]}>
              <Text style={tw`text-center text-white font-medium`}>
                {item.ticket_status === 'Assigned' ? 'In Progress' : 'New'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderClosedTicket = ({item}) => (
    console.log('item', item?.asset?.product),
    (
      <TouchableOpacity
        style={[styles.card, tw`bg-white p-4 rounded-lg mb-4 mx-2`]}
        onPress={() =>
          navigation.navigate('TicketDetails', {ticketData: item})
        }>
        <View style={styles.ticketContent}>
          <View style={styles.leftSection}>
            <Text style={[styles.text, styles.title]}>
              {item?.asset?.product || 'Unknown Product'}
            </Text>
            <Text style={tw`text-[#000000] text-[14px] font-medium`}>
              {item.order_number || 'N/A'}
            </Text>
            <Text style={styles.text}>{item?.user?.address}</Text>
          </View>
          <View style={tw`flex flex-row items-center`}>
            <Text style={tw`absolute -left-14 text-[#878787] -top-2`}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.rightSection}>
            <View style={tw`mb-4`}>
              <SvgXml
                style={tw`absolute top-0 right-0`}
                xml={listNavigationIcon}
              />
            </View>

            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  styles.completedBadge,
                  tw`mr-12 w-[100px] text-center mt-3`,
                ]}>
                <Text style={tw`text-center text-white font-medium`}>
                  Completed
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  );

  return (
    <ScrollView style={tw`bg-white `}>
      <StatusBar barStyle="light-content" />
      <HeaderWithSearch
        title="Search Tickets"
        setSearchQuery={setSearchQuery}
      />

      {/* Open Tickets Section */}
      <View style={tw`px-2`}>
        <Text style={styles.sectionTitle}>Running Tickets</Text>
        {openTickets.length > 0 ? (
          <FlatList
            data={openTickets}
            renderItem={renderOpenTicket}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            removeClippedSubviews={false}
            contentContainerStyle={{paddingBottom: 20}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No Running tickets found</Text>
          </View>
        )}
      </View>

      {/* Closed Tickets Section */}
      <View style={tw`px-2 mt-4`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={styles.sectionTitle}>Past Tickets</Text>
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
            data={closedTickets}
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
    marginTop: 8,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3748',
    marginVertical: 8,
    paddingHorizontal: 8,
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
    fontSize: 16,
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
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  newBadge: {
    backgroundColor: '#FF8383',
    textAlign: 'center',
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

export default TicketList;
