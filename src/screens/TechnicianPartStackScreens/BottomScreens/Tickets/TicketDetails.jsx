import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import TicketDetailsHeader from '../../../../lib/components/TicketDetailsHeader';
import tw from 'twrnc';
import {rightArrow} from '../../../../assets/Icons/icons';
import {SvgXml} from 'react-native-svg';

const TicketDetails = ({navigation, route}) => {
  const {ticketData} = route.params;

  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ScrollView style={tw`bg-white flex-1`} contentContainerStyle={tw`pb-6`}>
      <TicketDetailsHeader />

      {/* Asset Information */}
      <View style={tw`bg-[#FFE7E7] p-4 rounded-lg mx-5 my-2 mt-6`}>
        <Text style={tw`text-[14px] font-bold text-[#FF6769] mb-1`}>
          {ticketData.asset.brand} {ticketData.asset.product}
        </Text>
        <Text style={tw`text-[#000000] text-[12px] font-medium`}>
          {ticketData.asset.serial_number}
        </Text>
      </View>

      {/* Location */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-5 my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Location:</Text>
        <Text style={tw`text-[#000000]`}>{ticketData.user.address}</Text>
      </View>

      {/* Problem Description */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-5 my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Problem:</Text>
        <Text style={tw`text-gray-600 text-[14px] font-normal`}>
          {ticketData.problem}
        </Text>
      </View>

      {/* Assigned By */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-5 my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Assigned by:</Text>
        <Text style={tw`text-[#000000]`}>{ticketData.user.name}</Text>
        <Text style={tw`text-gray-500 text-xs mt-1`}>
          Created on: {formatDate(ticketData.created_at)}
        </Text>
      </View>

      {/* Ticket Status (Disabled) */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-5 my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Ticket status:</Text>
        <View
          style={tw`flex-row justify-between items-center mt-2 rounded-lg p-2 bg-white`}>
          <Text style={tw`text-gray-600`}>{ticketData.ticket_status}</Text>
          <SvgXml xml={rightArrow} />
        </View>
      </View>

      {/* Additional Information */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-5 my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Order Number:</Text>
        <Text style={tw`text-[#000000]`}>{ticketData.order_number}</Text>

        <Text style={tw`font-bold text-[#FF6769] mt-2`}>Estimated Cost:</Text>
        <Text style={tw`text-[#000000]`}>${ticketData.cost}</Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={tw`bg-[#ED1C24] w-[50%] mx-auto p-3 rounded-lg mt-4 items-center`}
        onPress={() =>
          navigation.navigate('inspactionDetails', {
            id: ticketData.id,
            type: 'ticket_id',
          })
        }
        accessible
        accessibilityLabel="Go to inspection sheet"
        accessibilityRole="button">
        <Text style={tw`text-white font-bold`}>Go to sheet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TicketDetails;
