import { View, Text } from 'react-native'
import React from 'react'
import tw from '../../../lib/tailwind'
import { useGetPrivacyPolicyQuery } from '../../../redux/apiSlices/FaqApislice';

const PrivacyPolocy = () => {
  const { data } = useGetPrivacyPolicyQuery();
console.log('privacy data',data);
 

  return (
    <View style={tw`bg-white h-full`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-[20px] text-[#000000] font-bold mb-4`}>
        Privacy policy     
        </Text>
       
          <View style={tw`mb-4`}>
            <Text style={tw`text-[16px] text-[#4A4A4A] font-normal`}>
              { data?.message.description}
            </Text>
          </View>
       
      </View>
    </View>
  )
}

export default PrivacyPolocy;
