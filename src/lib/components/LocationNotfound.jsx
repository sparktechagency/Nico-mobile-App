import {View, Text} from 'react-native';
import React from 'react';
import {SvgXml} from 'react-native-svg';
import tw from '../tailwind';
import {cardicon} from '../../assets/Icons/icons';

const LocationNotfound = () => {
  return (
    <View>
      <View style={tw`text-center max-w-lg mx-auto mt-[60%]`}>
        <View style={tw`flex justify-center items-center`}>
          <SvgXml xml={cardicon} />
        </View>
        <Text style={tw` text-[#000000] text-[20px] font-semibold text-center`}>
          Select a job card
        </Text>
        <Text style={tw` text-[#000000] text-[16px] font-medium text-center`}>
          Click on the address to get the location
        </Text>
      </View>
    </View>
  );
};

export default LocationNotfound;
