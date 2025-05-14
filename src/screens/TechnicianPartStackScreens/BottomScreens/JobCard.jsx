import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SvgXml} from 'react-native-svg';

import tw from '../../../lib/tailwind';
import {listNavigationIcon} from '../../../assets/Icons/icons';
import HeaderWithSearch from '../../../lib/components/HeaderWithSearch';
import {useGetjobcardQuery} from '../../../redux/apiSlices/jobCard';

const JobCard = () => {
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: responseData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetjobcardQuery({page, per_page: perPage});

  // Filter data based on status
  const newCards = responseData?.data?.data?.filter(
    item => item.status === 'New' || item.status === 'View the problem',
  );
  const pastCards = responseData?.data?.data?.filter(
    item => item.status !== 'New' && item.status !== 'View the problem',
  );

  const totalPages = Math.ceil(responseData?.data?.total / perPage) || 1;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const renderRunningTicket = ({item}) => (
    <TouchableOpacity
      style={tw`shadow-lg bg-white p-4 rounded-lg mb-4 mx-2`}
      onPress={() => navigation.navigate('jobcarddetails', {ticket: item})}>
      <View style={tw`flex flex-row items-center justify-between w-full`}>
        <Text style={styles.title}>
          {item?.ticket?.asset?.name || 'No Asset Name'}
        </Text>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <View>
          <SvgXml xml={listNavigationIcon} />
        </View>
      </View>
      <View style={tw`flex flex-row items-center justify-between w-full`}>
        <Text style={styles.text}>Ticket #{item.ticket_id}</Text>
        <TouchableOpacity style={styles.checinButton}>
          <Text style={styles.checkoutText}>Check-in</Text>
        </TouchableOpacity>
      </View>
      <View style={tw`flex flex-row items-center justify-between w-full`}>
        <Text style={styles.addres}>
          {item?.ticket?.asset?.address || 'No Address'}
        </Text>
        <Text
          style={tw`text-[16px] font-bold text-[#00950A] absolute right-0 top-2`}>
          {item?.price ? `$${item.price}` : '$0'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPastTicket = ({item}) => (
    <TouchableOpacity
      style={tw`shadow-lg bg-white p-4 rounded-lg mb-4 mx-2`}
      onPress={() => navigation.navigate('jobcarddetails', {ticket: item})}>
      <View style={tw`flex flex-row items-center justify-between w-full`}>
        <Text style={styles.title}>
          {item?.ticket?.asset?.name || 'No Asset Name'}
        </Text>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <View>
          <SvgXml xml={listNavigationIcon} />
        </View>
      </View>
      <View style={tw`flex flex-row items-center justify-between w-full`}>
        <Text style={styles.text}>Ticket #{item.ticket_id}</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Completed</Text>
        </TouchableOpacity>
      </View>
      <View style={tw`flex flex-row items-center justify-between w-full`}>
        <Text style={styles.addres}>
          {item?.ticket?.asset?.address || 'No Address'}
        </Text>
        <Text
          style={tw`text-[16px] font-bold text-[#00950A] absolute right-0 top-2`}>
          {item?.price ? `$${item.price}` : '$0'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Error loading data</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <HeaderWithSearch />
      <View>
        <Text style={styles.sectionTitle}>New cards ({newCards?.length})</Text>
        {newCards?.length > 0 ? (
          <FlatList
            data={newCards}
            renderItem={renderRunningTicket}
            keyExtractor={item => item.id.toString()}
          />
        ) : (
          <Text style={styles.noDataText}>No new cards available</Text>
        )}
      </View>
      <View>
        <Text style={styles.sectionTitle}>
          Past cards ({pastCards?.length})
        </Text>
        {pastCards?.length > 0 ? (
          <FlatList
            data={pastCards}
            renderItem={renderPastTicket}
            keyExtractor={item => item.id.toString()}
          />
        ) : (
          <Text style={styles.noDataText}>No past cards available</Text>
        )}
      </View>

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={handlePrevPage}
          disabled={page === 1}
          style={[
            styles.paginationButton,
            page === 1 && styles.disabledButton,
          ]}>
          <Text style={styles.paginationText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.pageInfo}>
          Page {page} of {totalPages}
        </Text>

        <TouchableOpacity
          onPress={handleNextPage}
          disabled={page === totalPages}
          style={[
            styles.paginationButton,
            page === totalPages && styles.disabledButton,
          ]}>
          <Text style={styles.paginationText}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginBottom: 60}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingLeft: 10,
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#878787',
  },
  text: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  addres: {
    fontSize: 14,
    color: '#878787',
    fontWeight: '500',
    paddingTop: 2,
  },
  title: {
    fontWeight: 'bold',
    color: '#FF0205',
    fontSize: 16,
  },
  date: {
    position: 'absolute',
    top: 10,
    right: '45%',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#878787',
  },
  checkoutButton: {
    backgroundColor: '#00950A',
    marginTop: 0,
    marginRight: '15%',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 100,
  },
  checinButton: {
    backgroundColor: '#FF8383',
    marginTop: 0,
    marginRight: '15%',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 100,
  },
  checkoutText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#FF0205',
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobCard;
