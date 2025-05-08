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
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {backIcon, filter, NavigationIcon} from '../../../assets/Icons/icons';
import {SvgXml} from 'react-native-svg';
import tw from '../../../lib/tailwind';
import {
  useGetAllTechnicianQuery,
  useGetOrganizationQuery,
} from '../../../redux/apiSlices/MessageApis';

const SelectAtechnician = () => {
  const [filteredOrgId, setFilteredOrgId] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  // Fetch organizations and technicians data
  const {data: orgResponse, isLoading: orgLoading} = useGetOrganizationQuery();
  const {data: techResponse, isLoading: techLoading} = useGetAllTechnicianQuery(
    filteredOrgId ? {id: filteredOrgId} : undefined,
  );

  const navigation = useNavigation();

  // Extract data from responses
  const organizations = orgResponse?.data || [];
  const technicians = techResponse?.data || [];

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleOrgSelect = org => {
    setSelectedOrg(org);
    setFilteredOrgId(org.id);
    setShowFilter(false);
  };

  const clearFilter = () => {
    setSelectedOrg(null);
    setFilteredOrgId(null);
    setShowFilter(false);
  };

  if (orgLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={tw`p-4 flex-row items-center justify-between`}>
        <View style={tw`flex flex-row items-center gap-2`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SvgXml xml={backIcon} />
          </TouchableOpacity>
          <Text style={tw`text-[20px] font-medium text-[#000000]`}>
            Technicians
          </Text>
        </View>

        <View>
          {/* FILTER TECHNICIANS */}
          <TouchableOpacity onPress={toggleFilter} style={tw`relative`}>
            <SvgXml xml={filter} />
            {selectedOrg && (
              <View
                style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center`}>
                <Text style={tw`text-white text-xs`}>1</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Filter Dropdown Modal */}
          <Modal
            visible={showFilter}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowFilter(false)}>
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowFilter(false)}>
              <View style={styles.filterDropdown}>
                <Text style={styles.filterTitle}>Filter by Organization</Text>
                {organizations.map(org => (
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
      <View style={styles.contentContainer}>
        {techLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : technicians.length === 0 ? (
          <Text style={styles.noDataText}>
            {filteredOrgId
              ? 'No technicians found for this organization'
              : 'Select an organization to view technicians'}
          </Text>
        ) : (
          <FlatList
            data={technicians}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('ChatDetail', {data: item})}>
                <View style={styles.chatCard}>
                  <Image
                    source={{
                      uri: item.image || '../../../assets/Icons/avater.png',
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
                      <Text style={styles.messageCount}>
                        {item.unread_count || 0} new messages
                      </Text>
                      <SvgXml xml={NavigationIcon} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            removeClippedSubviews={false}
          />
        )}
      </View>
    </View>
  );
};

export default SelectAtechnician;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 20,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterDropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxHeight: '60%',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  filterOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
  clearButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ff4444',
    fontWeight: '500',
  },
});
