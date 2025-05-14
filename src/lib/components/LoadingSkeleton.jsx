import React from 'react';
import {View} from 'react-native';
import tw from '../tailwind';

const SkeletonBox = ({
  width = '100%',
  height = 20,
  rounded = 'rounded-md',
  style,
}) => {
  return <View style={[tw`bg-gray-300 ${rounded}`, {width, height}, style]} />;
};

const LoadingSkeleton = () => {
  return (
    <View style={tw`p-4`}>
      {/* Device Name Skeleton */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mb-4`}>
        <SkeletonBox width="60%" height={20} />
        <SkeletonBox width="80%" height={16} style={tw`mt-2`} />
      </View>

      {/* Organization Name Skeleton */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mb-4`}>
        <SkeletonBox width="50%" height={20} />
        <SkeletonBox width="70%" height={16} style={tw`mt-2`} />
      </View>

      {/* Serial Number Skeleton */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mb-4`}>
        <SkeletonBox width="50%" height={20} />
        <SkeletonBox width="70%" height={16} style={tw`mt-2`} />
      </View>

      {/* Your Address Skeleton */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mb-4`}>
        <SkeletonBox width="50%" height={20} />
        <SkeletonBox width="90%" height={16} style={tw`mt-2`} />
      </View>

      {/* Problem TextInput Skeleton */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mb-4`}>
        <SkeletonBox width="40%" height={20} />
        <SkeletonBox width="100%" height={100} style={tw`mt-2`} />
      </View>

      {/* Button Skeleton */}
      <View style={tw`items-center mt-4`}>
        <SkeletonBox width="50%" height={50} rounded="rounded-full" />
      </View>
    </View>
  );
};

export default LoadingSkeleton;
