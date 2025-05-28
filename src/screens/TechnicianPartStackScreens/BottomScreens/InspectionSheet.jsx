import {useNavigation} from '@react-navigation/native';
import React, {useState, useCallback, useEffect} from 'react';
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
import {useGetInspectionSheetQuery} from '../../../redux/apiSlices/inspactionSheets';

const InspectionSheet = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10); // Adjust based on your needs
  const [refreshing, setRefreshing] = useState(false);
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

  const {
    data: responseData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetInspectionSheetQuery({
    page,
    per_page: perPage,
    search: debouncedSearchQuery,
  });

  const navigation = useNavigation();

  // Memoized filtered data
  const {newSheets, pastSheets, openSheets} = React.useMemo(() => {
    const allData = responseData?.data?.data || [];
    return {
      newSheets: allData.filter(
        sheet => sheet.inspection_sheet_type === 'New Sheets',
      ),
      pastSheets: allData.filter(
        sheet => sheet.inspection_sheet_type === 'Past Sheets',
      ),
      openSheets: allData.filter(
        sheet => sheet.inspection_sheet_type === 'Open Sheets',
      ),
    };
  }, [responseData]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
      setPage(1); // Reset to first page on refresh
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!isFetching && page < (responseData?.data?.last_page || 1)) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, page, responseData]);

  const renderFooter = () => {
    if (isFetching && page > 1) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    }

    if (page < (responseData?.data?.last_page || 1)) {
      return (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
          disabled={isFetching}>
          <Text style={styles.loadMoreText}>
            {isFetching ? 'Loading...' : 'Load More'}
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderSheetItem = ({item}) => (
    console.log('item-inspaction', item),
    (
      <TouchableOpacity
        style={tw`shadow-lg bg-white p-4 rounded-lg flex-row items-center justify-between mb-4 mx-2`}
        onPress={() =>
          navigation.navigate('inspactionDetails', {
            id: item?.id,
            type: 'inspection_id',
          })
        }>
        <View style={styles.leftSection}>
          <Text style={[styles.text, styles.title]}>
            {item?.ticket?.asset?.product}
          </Text>
          <Text style={styles.text}> From support agent</Text>
          {item.support_agent_comment && (
            <Text style={styles.addres} numberOfLines={1}>
              {item?.ticket?.problem}
            </Text>
          )}
        </View>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            item.status === 'New' ? styles.checinButton : null,
          ]}>
          <Text style={styles.checkoutText}>
            {item.status === 'New' ? 'Check-in' : 'Check-out'}
          </Text>
        </TouchableOpacity>
        <SvgXml xml={listNavigationIcon} style={styles.arrowIcon} />
      </TouchableOpacity>
    )
  );

  if (isLoading && !refreshing && page === 1) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error loading data</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <HeaderWithSearch
        title=" Search Inspection Sheets"
        setSearchQuery={setSearchQuery}
      />

      <View>
        <Text style={styles.sectionTitle}>Open sheets</Text>
        <FlatList
          data={openSheets}
          renderItem={renderSheetItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      <View>
        <Text style={styles.sectionTitle}>New sheets</Text>
        <FlatList
          data={newSheets}
          renderItem={renderSheetItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      <View>
        <Text style={styles.sectionTitle}>Past sheets</Text>
        <FlatList
          data={pastSheets}
          renderItem={renderSheetItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          ListFooterComponent={
            <>
              {renderFooter()}
              <View style={{marginBottom: '2%'}} />
            </>
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingLeft: 10,
  },
  leftSection: {
    flex: 1,
  },
  text: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
    paddingTop: 5,
  },
  addres: {
    fontSize: 14,
    color: '#878787',
    fontWeight: '500',
    paddingTop: 5,
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
    marginTop: '8%',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 100,
  },
  checinButton: {
    backgroundColor: '#FF8383',
    marginTop: '5%',
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
  arrowIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  loadMoreButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  loadMoreText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  loadingFooter: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#007AFF',
    marginTop: 10,
  },
});

export default InspectionSheet;
