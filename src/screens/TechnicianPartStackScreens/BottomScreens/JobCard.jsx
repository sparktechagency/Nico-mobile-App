import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
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
  const [searchQuery, setSearchQuery] = useState('');

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  console.log('searchQuery-0-----------', debouncedSearchQuery);
  // Debounce search input (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetjobcardQuery({
    page,
    per_page: perPage,
    search: debouncedSearchQuery,
  });
  console.log('responseData', responseData);

  const jobCards = responseData?.data?.data || [];
  const totalPages = Math.ceil(responseData?.data?.total / perPage) || 1;

  // Filter job cards by status
  const newCards = jobCards.filter(
    item =>
      item.job_status === 'New' ||
      item.job_status === 'View the problem' ||
      item.job_status === 'Assigned',
  );
  const pastCards = jobCards.filter(
    item => !['New', 'View the problem', 'Assigned'].includes(item.job_status),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderJobCardItem = ({item}) => {
    console.log('item', item);
    const isNewCard = newCards.includes(item);
    const asset = item?.inspection_sheet?.ticket?.asset || {};
    const ticket = item?.inspection_sheet?.ticket || {};
    const user = item?.inspection_sheet?.ticket?.user || {};

    return (
      <TouchableOpacity
        style={[styles.card, isNewCard ? styles.newCard : styles.pastCard]}
        onPress={() => navigation.navigate('jobcarddetails', {jobcard: item})}>
        <View style={styles.cardHeader}>
          <Text style={styles.assetBrand}>{asset.product || 'No Brand'}</Text>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          <SvgXml xml={listNavigationIcon} />
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.serialNumber}>
            #{ticket.order_number || 'N/A'}
          </Text>

          <View
            style={[
              styles.statusBadge,
              isNewCard ? styles.newBadge : styles.completedBadge,
            ]}>
            <Text style={styles.statusText}>
              {isNewCard ? 'Check-in' : 'Completed'}
            </Text>
          </View>
        </View>

        <View style={tw`flex flex-row items-center justify-between `}>
          <Text style={styles.address}>{user.address || 'No Address'}</Text>
          <Text style={tw`text-sm font-semibold text-[#00950A]`}>
            ${ticket.cost || 'N/A'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED1C24" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error loading job cards: {error?.data?.message || error.message}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithSearch
        title="Search Job Cards"
        setSearchQuery={setSearchQuery}
      />

      <FlatList
        data={[
          {title: 'New Cards', data: newCards},
          {title: 'Past Cards', data: pastCards},
        ]}
        keyExtractor={item => item.title}
        renderItem={({item}) => (
          <View>
            <Text style={styles.sectionTitle}>
              {item.title} ({item.data.length})
            </Text>
            {item.data.length > 0 ? (
              <FlatList
                data={item.data}
                renderItem={renderJobCardItem}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>
                No {item.title.toLowerCase()}
              </Text>
            )}
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ED1C24']}
          />
        }
        ListFooterComponent={
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={() => handlePageChange(page - 1)}
              disabled={page === 1}
              style={[
                styles.paginationButton,
                page === 1 && styles.disabledButton,
              ]}>
              <Text style={styles.paginationText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageText}>
              Page {page} of {totalPages}
            </Text>

            <TouchableOpacity
              onPress={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              style={[
                styles.paginationButton,
                page === totalPages && styles.disabledButton,
              ]}>
              <Text style={styles.paginationText}>Next</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ED1C24',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#ED1C24',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 15,
    color: '#333333',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#888888',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newCard: {
    borderLeftWidth: 2,
    borderLeftColor: '#ED1C24',
  },
  pastCard: {
    borderLeftWidth: 2,
    borderLeftColor: '#00950A',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  assetBrand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ED1C24',
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#888888',
    marginHorizontal: 10,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  serialNumber: {
    fontSize: 14,
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadge: {
    backgroundColor: '#FF8383',
    marginRight: 58,
  },
  completedBadge: {
    backgroundColor: '#00950A',
    marginRight: 58,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#888888',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  paginationButton: {
    backgroundColor: '#ED1C24',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  paginationText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pageText: {
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default JobCard;
