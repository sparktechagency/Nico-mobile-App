import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {backIcon, filter, NavigationIcon} from '../../../assets/Icons/icons';
import {SvgXml} from 'react-native-svg';
import tw from '../../../lib/tailwind';
import {useGetAllTechnicianQuery} from '../../../redux/apiSlices/MessageApis';
import {useGetOwnProfileQuery} from '../../../redux/apiSlices/authApiSlice';

const SelectAtechnician = () => {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const {data: userData} = useGetOwnProfileQuery();
  const usrRole = userData?.data?.role;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch technicians data
  const {
    data: techResponse,
    isLoading: techLoading,
    isError,
    error,
  } = useGetAllTechnicianQuery(
    searchQuery || selectedOrg
      ? {
          role: selectedOrg?.id || 'technician',
          ...(selectedOrg?.id && {role: selectedOrg.id}),
          ...(searchQuery && {search: searchQuery}),
        }
      : {role: 'technician'},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const navigation = useNavigation();

  // Transform technicians data for FlatList
  const technicians =
    techResponse?.data?.map(tech => ({
      id: tech.id.toString(),
      name: tech.name,
      image: tech.image,
      created_at: tech.created_at,
      unread_count: tech.unread_count || 0,
    })) || [];

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleOrgSelect = org => {
    setSelectedOrg(org);
    setSearchQuery('');
    setShowFilter(false);
  };

  const clearFilter = () => {
    setSelectedOrg(null);
    setShowFilter(false);
  };

  const handleSearch = text => {
    setSearchQuery(text);
    if (text) {
      setSelectedOrg(null);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChatDetail', {data: item})}>
      <View style={styles.chatCard}>
        <Image
          source={{
            uri: item.image || 'https://via.placeholder.com/50',
          }}
          style={styles.avatar}
          defaultSource={require('../../../assets/Icons/avater.png')}
        />
        <View style={styles.chatInfo}>
          <View style={styles.flexitem}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.chatTime}>
              {new Date(item.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={styles.flexitem}>
            <Text style={styles.messageCount}>Click to view chat</Text>
            <SvgXml xml={NavigationIcon} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={tw`p-4 flex-row items-center justify-between`}>
        <View style={tw`flex flex-row items-center gap-2`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SvgXml xml={backIcon} />
          </TouchableOpacity>
          <Text style={tw`text-[20px] font-medium text-[#000000]`}>
            {usrRole === 'technician' ? 'Select a user' : 'Select Technician'}
          </Text>
        </View>

        <View style={tw`${usrRole === 'user' ? 'hidden' : 'flex'}`}>
          <TouchableOpacity onPress={toggleFilter} style={tw`relative`}>
            <SvgXml xml={filter} />
            {selectedOrg && (
              <View
                style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center`}>
                <Text style={tw`text-white text-xs`}>1</Text>
              </View>
            )}
          </TouchableOpacity>

          <Modal
            visible={showFilter}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowFilter(false)}>
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowFilter(false)}>
              <View style={styles.filterDropdown}>
                <Text style={styles.filterTitle}>Filter by Role</Text>
                {[
                  {id: 'organization', name: 'Organization'},
                  {id: 'location_employee', name: 'Location Employee'},
                  {id: 'support_agent', name: 'Support Agent'},
                  {id: 'third_party', name: 'Third Party'},

                  {id: 'user', name: 'User'},
                ].map(org => (
                  <TouchableOpacity
                    key={org.id}
                    style={[
                      styles.filterOption,
                      selectedOrg?.id === org.id && styles.selectedOption,
                    ]}
                    onPress={() => handleOrgSelect(org)}>
                    <Text
                      style={[
                        styles.optionText,
                        selectedOrg?.id === org.id && styles.selectedOptionText,
                      ]}>
                      {org.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearFilter}>
                  <Text style={styles.clearButtonText}>Clear Filter</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search by name or email"
          style={styles.searchInput}
          onChangeText={handleSearch}
          value={searchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={clearSearch}
            style={styles.clearSearchButton}>
            <Text style={styles.clearSearchText}>×</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.contentContainer}>
        {techLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : isError ? (
          <Text style={styles.noDataText}>
            Error loading technicians: {error?.message}
          </Text>
        ) : technicians.length === 0 ? (
          <Text style={styles.noDataText}>
            {selectedOrg
              ? `No ${selectedOrg.name}s found`
              : searchQuery
              ? 'No results found'
              : 'Search or select a role to view technicians'}
          </Text>
        ) : (
          <FlatList
            data={technicians}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            removeClippedSubviews={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  flexitem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chatTime: {
    fontSize: 12,
    color: '#888',
  },
  messageCount: {
    fontSize: 12,
    color: '#555',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#333',
  },
  clearSearchButton: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 20,
    color: '#999',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterDropdown: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxHeight: '70%',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  filterOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  selectedOption: {
    backgroundColor: '#F0F8FF',
  },
  optionText: {
    fontSize: 14,
    color: '#444',
  },
  selectedOptionText: {
    color: '#0066CC',
    fontWeight: '600',
  },
  clearButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FF4444',
    fontWeight: '500',
  },
});

export default SelectAtechnician;
