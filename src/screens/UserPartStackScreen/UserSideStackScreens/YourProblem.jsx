import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import tw from '../../../lib/tailwind';
import {useGetQrvaluesQuery} from '../../../redux/apiSlices/QrApi';
import {useCreateATicketMutation} from '../../../redux/apiSlices/ticketApi';

const YourProblem = ({navigation, route}) => {
  const {scannedData} = route.params;
  console.log('scannedData', scannedData.value);

  const {data} = useGetQrvaluesQuery({id: scannedData.value});

  console.log('FetchedQrdata', data?.data);
  const [problemDescription, setProblemDescription] = useState('');
  const [createATicket, {isLoading}] = useCreateATicketMutation();
  const handleSend = async () => {
    const sendData = {
      asset_id: String(data?.data?.id),
      problem: problemDescription,
    };

    try {
      const response = await createATicket(sendData).unwrap();

      console.log('Response:', response);

      if (response?.status === true) {
        Alert.alert('Success', 'Ticket created successfully!');
        navigation.goBack(); // go back to previous screen
      }
    } catch (error) {
      console.log('Error details:', error);
      Alert.alert('Error', error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView style={tw`bg-white flex-1`}>
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2 `}>
        <Text style={tw`text-[14px] font-bold text-[#FF6769] mb-1`}>
          Device name
        </Text>
        <Text style={tw`text-[#000000] text-[12px] font-medium`}>
          {data?.data?.product}
        </Text>
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2 `}>
        <Text style={tw`font-bold text-[#FF6769]`}>Organization name</Text>
        <Text style={tw`text-[#000000]`}>{data?.data?.organization?.name}</Text>
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2 `}>
        <Text style={tw`font-bold text-[#FF6769]`}>Serial number</Text>
        <Text style={tw`text-[#000000]`}>{data?.data?.serial_number}</Text>
      </View>
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2 `}>
        <Text style={tw`font-bold text-[#FF6769]`}>Your Address</Text>
        <Text style={tw`text-[#000000]`}>{data?.data?.location}</Text>
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2 `}>
        <Text style={tw`font-bold text-[#FF6769]`}>Problem:</Text>
        <TextInput
          placeholder="Write your problem..."
          multiline={true}
          numberOfLines={8}
          style={tw`text-[#494848]`}
          value={problemDescription}
          onChangeText={setProblemDescription} // Add this to capture input
        />
      </View>
      <TouchableOpacity
        disabled={isLoading}
        onPress={handleSend}
        style={[
          tw`bg-[#ED1C24] w-[50%] mx-auto p-4 rounded-lg mt-4 items-center`,
          isLoading && tw`opacity-50`,
        ]}>
        <Text style={tw`text-white font-bold`}>
          {isLoading ? 'Sending...' : 'Send'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default YourProblem;
