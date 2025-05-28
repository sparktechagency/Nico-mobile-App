import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import tw from '../../../lib/tailwind';
import {SvgXml} from 'react-native-svg';
import {Downarrow, rightArrow} from '../../../assets/Icons/icons';
import {useGetFaqsQuery} from '../../../redux/apiSlices/FaqApislice';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const {data, isLoading, isError} = useGetFaqsQuery();

  const toggleAnswer = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500 text-lg`}>Failed to load FAQs!</Text>
      </View>
    );
  }

  if (!data || !data.data || !Array.isArray(data.data.data)) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-yellow-500 text-lg`}>No FAQs available</Text>
      </View>
    );
  }

  return (
    <View style={tw`p-4 bg-white h-full`}>
      {data.data.data.map((item, index) => (
        <FAQItem
          key={`faq-${item.id}`}
          item={item}
          isActive={activeIndex === index}
          onPress={() => toggleAnswer(index)}
        />
      ))}
    </View>
  );
};

const FAQItem = ({item, isActive, onPress}) => {
  const animatedHeight = useSharedValue(0);
  const animatedOpacity = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = withTiming(isActive ? 300 : 0, {
      duration: 300,
      easing: Easing.ease,
    });
    animatedOpacity.value = withTiming(isActive ? 1 : 0, {
      duration: 300,
      easing: Easing.ease,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: animatedHeight.value,
    opacity: animatedOpacity.value,
  }));

  return (
    <View style={tw`mb-3 bg-[#F0F0F0] rounded-lg overflow-hidden`}>
      <TouchableOpacity
        onPress={onPress}
        style={tw`flex-row justify-between items-center p-4`}
        activeOpacity={0.7}>
        <Text style={tw`text-[16px] text-black font-medium flex-1 pr-2`}>
          {item.question}
        </Text>
        <View style={tw`w-5 h-5 justify-center items-center`}>
          {isActive ? (
            <SvgXml xml={Downarrow} width="100%" height="100%" />
          ) : (
            <SvgXml xml={rightArrow} width="100%" height="100%" />
          )}
        </View>
      </TouchableOpacity>

      <Animated.View style={[tw`bg-gray-200`, animatedStyle]}>
        <View style={tw`p-4`}>
          <Text style={tw`text-[16px] text-gray-700`}>{item.answer}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default FAQ;
