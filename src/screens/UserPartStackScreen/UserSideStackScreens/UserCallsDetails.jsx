// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

// import { SvgXml } from 'react-native-svg';
// import tw from '../../../lib/tailwind';
// import { Downarrow, rightArrow } from '../../../assets/Icons/icons';

// const UserCallsDetails = ({ navigation , route}) => {
//   const {data}= route.params
//   console.log('data',data);
//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState('Completed');

//   const handleSelect = (item) => {
//     setValue(item.label);
//     setOpen(false);
//   };

//   return (
//     <ScrollView style={tw`bg-white flex-1`}>
    

//       <View style={tw`bg-[#FFE7E7] p-4 rounded-lg mx-[20px] my-2  mt-6`}>
//         <Text style={tw`text-[14px] font-bold text-[#FF6769] mb-1`}>ViewSonic monitorrr</Text>
//         <Text style={tw`text-[#000000] text-[12px] font-medium`}>JDSBH53423D</Text>
//       </View>

//       <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2 `}>
//         <Text style={tw`font-bold text-[#FF6769]`}>Serial number:</Text>
//         <Text style={tw`text-[#000000]`}>JF2656NCDS8</Text>
//       </View>

//       <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2 `}>
//         <Text style={tw`font-bold text-[#FF6769]`}>Problem:</Text>
//         <Text style={tw`text-gray-600 text-[14px] font-normal`}>Lorem ipsum dolor sit amet consectetur. Cras in tellus dignissim pretium diam magna sed id. Ipsum est fringilla quam dolor tristique nunc lectus. Ultrices ultrices quis aenean lobortis sit. A sed consectetur venenatis id. Nibh fames nibh tincidunt et sit vitae rhoncus. Cursus feugiat viverra et nullam hac faucibus massa volutpat purus. Viverra et</Text>
//       </View>

//       <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2 `}>
//         <Text style={tw`font-bold text-[#FF6769]`}>Username:</Text>
//         <Text style={tw`text-[#000000]`}>Md. Abid Hasan</Text>
//       </View>
//       <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2 `}>
//         <Text style={tw`font-bold text-[#FF6769]`}>Address:</Text>
//         <Text style={tw`text-[#000000]`}>Road no. 14, Block-D, Banasree, Dhaka.</Text>
//       </View>
//       <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2 `}>
//         <Text style={tw`font-bold text-[#FF6769]`}>Technician name:</Text>
//         <Text style={tw`text-[#000000]`}>Jhone Doe </Text>
//       </View>
//       <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2 `}>
//         <Text style={tw`font-bold text-[#FF6769]`}>Cost:</Text>
//         <Text style={tw`text-[#000000] font-bold`}>$250</Text>
//       </View>




//     </ScrollView>
//   );
// };

// export default UserCallsDetails;
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import tw from '../../../lib/tailwind';
import { Downarrow, rightArrow } from '../../../assets/Icons/icons';

const UserCallsDetails = ({ navigation, route }) => {
  const { data } = route.params || {};
  console.log('Received data:', data);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('Completed');

  const handleSelect = (item) => {
    setValue(item.label);
    setOpen(false);
  };

  if (!data) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>No data found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`bg-white flex-1`}>
      {/* Product Name and Serial Number */}
      <View style={tw`bg-[#FFE7E7] p-4 rounded-lg mx-[20px] my-2 mt-6`}>
        <Text style={tw`text-[14px] font-bold text-[#FF6769] mb-1`}>
          {data?.asset?.product || 'N/A'}
        </Text>
        <Text style={tw`text-[#000000] text-[12px] font-medium`}>
          {data?.asset?.serial_number || 'N/A'}
        </Text>
      </View>

      {/* Problem */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Problem:</Text>
        <Text style={tw`text-gray-600 text-[14px] font-normal`}>
          {data?.problem || 'N/A'}
        </Text>
      </View>

      {/* Username */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Username:</Text>
        <Text style={tw`text-[#000000]`}>
          {data?.user?.name || 'N/A'}
        </Text>
      </View>

      {/* Address */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Address:</Text>
        <Text style={tw`text-[#000000]`}>
          {data?.user?.address || 'N/A'}
        </Text>
      </View>

      {/* Technician Name */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Technician Name:</Text>
        <Text style={tw`text-[#000000]`}>
          {/* You didn't provide technician name in your data. So using static for now */}
          John Doe
        </Text>
      </View>

      {/* Cost */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Cost:</Text>
        <Text style={tw`text-[#000000] font-bold`}>
          {data?.cost ? `$${data.cost}` : 'N/A'} 
        </Text>
      </View>
    </ScrollView>
  );
};

export default UserCallsDetails;
