import { View, Text, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import React, { useState } from 'react';
import tw from '../../../lib/tailwind';
import { SvgXml } from 'react-native-svg';
import { Downarrow, rightArrow } from '../../../assets/Icons/icons';
import { useGetFaqsQuery } from '../../../redux/apiSlices/FaqApislice';

// Android এর জন্য Layout Animation Enable করা
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0); // First item open initially
  const { data, isLoading, isError } = useGetFaqsQuery();

  const toggleAnswer = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError || !data?.status) {
    return <Text>Failed to load FAQs!</Text>;
  }

  return (
    <View style={tw`p-4 bg-white h-full`}>
      {data?.data?.map((item, index) => (
        <View
          key={item.id}
          style={tw`mb-2 bg-[#F0F0F0] rounded-lg overflow-hidden`}
        >
          <TouchableOpacity
            onPress={() => toggleAnswer(index)}
            style={tw`flex-row justify-between items-center p-4`}
          >
            <Text style={tw`text-[16px] text-black font-medium`}>
              {item.question}
            </Text>
            <Text style={tw`text-[20px] text-black`}>
              {activeIndex === index ? <SvgXml xml={Downarrow} /> : <SvgXml xml={rightArrow} />}
            </Text>
          </TouchableOpacity>
          {activeIndex === index && (
            <View style={tw`bg-gray-200 p-4`}>
              <Text style={tw`text-[16px] text-gray-700`}>
                {item.answer}
              </Text> 
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default FAQ;
