import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Image,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {SvgXml} from 'react-native-svg';
import tw from '../../../lib/tailwind';
import {
  aboutIcon,
  Downarrow,
  imageupload,
  rightArrow,
  successmodalIcon,
  videoUpload,
} from '../../../assets/Icons/icons';
import TicketDetailsHeader from '../../../lib/components/TicketDetailsHeader';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  useGetInspactionDetailsQuery,
  useUpdateInspactionMutation,
} from '../../../redux/apiSlices/inspactionSheets';

const SuccessModal = ({visible, onClose}) => (
  <Modal visible={visible} transparent>
    <View style={tw`flex-1 bg-black/50 justify-center items-center`}>
      <View style={tw`bg-white p-6 rounded-lg w-3/4`}>
        <View style={tw`flex flex-row items-center justify-center`}>
          <SvgXml xml={successmodalIcon} />
        </View>
        <Text style={tw`text-[16px] text-[#00950A] font-bold mb-2 text-center`}>
          SEND SUCCESSFULLY
        </Text>
        <Text
          style={tw`text-[14px] font-normal text-gray-500 text-center px-4 mb-4`}>
          Inspection Sheet Update Successfully
        </Text>
        <TouchableOpacity
          style={tw`bg-[#ED1C24] p-3 rounded-lg max-w-[100px] w-full mx-auto`}
          onPress={onClose}>
          <Text style={tw`text-white text-center font-bold`}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const InspactionDetails = ({navigation, route}) => {
  const {id, type} = route?.params;

  const {data: singlecard, isLoading} = useGetInspactionDetailsQuery({
    type,
    id,
  });
  const [updateInspaction, {isLoading: isUpdating}] =
    useUpdateInspactionMutation();

  const sheet = singlecard?.data;

  const {control, handleSubmit, setValue} = useForm({
    defaultValues: {
      ticket_status: sheet?.status || '',
      technician_comment: sheet?.technician_comment || '',
    },
  });
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const items = [
    {label: 'New', value: 'new'},
    {label: 'Assigned', value: 'assigned'},
    {label: 'Inspection sheet', value: 'inspection'},
    {label: 'Awaiting purchase order', value: 'purchase'},
    {label: 'Job card created', value: 'job-card'},
    {label: 'To be allocated', value: 'to be allocated'},
    {label: 'Awaiting courier', value: 'awaiting courier'},
    {label: 'Collected by Courier', value: 'collected by courier'},
    {label: 'Parts required', value: 'parts required'},
    {label: 'Picking', value: 'picking'},
    {label: 'To be invoiced', value: 'to be invoiced'},
    {label: 'Invoiced', value: 'invoiced'},
    {label: 'Completed', value: 'completed'},
  ];

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0, // 0 means unlimited
        includeBase64: false,
      },
      response => {
        if (!response.didCancel && !response.errorCode) {
          const newImages = response.assets.map(asset => ({
            uri: asset.uri,
            name: asset.fileName || `image_${Date.now()}.jpg`,
            type: asset.type || 'image/jpeg',
          }));
          setImages(prev => [...prev, ...newImages]);
        }
      },
    );
  };

  const handleVideoPick = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
        selectionLimit: 0, // 0 means unlimited
        includeBase64: false,
      },
      response => {
        if (!response.didCancel && !response.errorCode) {
          const newVideos = response.assets.map(asset => ({
            uri: asset.uri,
            name: asset.fileName || `video_${Date.now()}.mp4`,
            type: asset.type || 'video/mp4',
          }));
          setVideos(prev => [...prev, ...newVideos]);
        }
      },
    );
  };

  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = index => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async data => {
    try {
      const formData = new FormData();

      // Add required fields
      formData.append('ticket_status', data.ticket_status.toLowerCase());
      formData.append('technician_comment', data.technician_comment);

      // Add images
      images.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        });
      });

      // Add videos
      videos.forEach((video, index) => {
        formData.append('videos', {
          uri: video.uri,
          name: video.name,
          type: video.type,
        });
      });

      // Make the API call
      const response = await updateInspaction({id, formData}).unwrap();
      console.log('response', response);
      if (response.status === true) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Error',
        error.data?.message || 'Failed to update inspection',
      );
    }
  };

  return (
    <ScrollView style={tw`bg-white flex-1`}>
      <TicketDetailsHeader />

      <View style={tw`bg-[#FFE7E7] p-4 rounded-lg mx-[20px] my-2 mt-6`}>
        <Text style={tw`text-[14px] font-bold text-[#FF6769] mb-1`}>
          {sheet?.ticket?.asset?.brand} {sheet?.ticket?.asset?.product}
        </Text>
        <Text style={tw`text-[#000000] text-[12px] font-medium`}>
          Serial: {sheet?.ticket?.asset?.serial_number}
        </Text>
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Location:</Text>
        <Text style={tw`text-[#000000]`}>{sheet?.ticket?.user?.address}</Text>
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Problem:</Text>
        <Text style={tw`text-gray-600 text-[14px] font-normal`}>
          {sheet?.support_agent_comment || 'No problem description provided'}
        </Text>
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Assigned by:</Text>
        <Text style={tw`text-[#000000]`}>
          {sheet?.assigned.name} (Support Agent)
        </Text>
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>support_agent_comment:</Text>
        <Text style={tw`text-[#000000]`}>{sheet?.support_agent_comment}</Text>
        {sheet?.technician.image && (
          <Image
            source={{uri: sheet?.technician?.image}}
            style={tw`w-16 h-16 rounded-full mt-2`}
          />
        )}
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Ticket status:</Text>
        <Controller
          control={control}
          name="ticket_status"
          render={({field: {value, onChange}}) => (
            <>
              <TouchableOpacity
                onPress={() => setOpen(!open)}
                style={tw`flex-row justify-between items-center mt-2 rounded-lg p-2`}>
                <Text style={tw`text-gray-600`}>
                  {items.find(item => item.value === value)?.label || value}
                </Text>
                <Text style={tw`text-gray-600`}>
                  {open ? (
                    <SvgXml xml={Downarrow} />
                  ) : (
                    <SvgXml xml={rightArrow} />
                  )}
                </Text>
              </TouchableOpacity>

              {open && (
                <View style={tw`mt-2 rounded-lg`}>
                  {items?.map(item => (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => {
                        onChange(item.value);
                        setOpen(false);
                      }}
                      style={tw`border border-gray-300 p-2 ${
                        value === item.value ? 'bg-red-100' : 'bg-white'
                      }`}>
                      <Text style={tw`text-gray-600`}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        />
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Your Comment</Text>
        <Controller
          control={control}
          name="technician_comment"
          rules={{required: true}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="type here"
              multiline
              textAlignVertical="top"
              style={tw`p-2 rounded-lg mt-2 h-[190px]`}
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={sheet?.technician_comment || value}
            />
          )}
        />
      </View>

      {/* Display existing images */}
      {sheet?.image && sheet?.image?.length > 0 && (
        <View style={tw`mx-[20px] my-2`}>
          <Text style={tw`font-bold text-[#FF6769] mb-2`}>
            Existing Images:
          </Text>
          <ScrollView horizontal>
            {sheet?.image.map((img, index) => (
              <Image
                key={index}
                source={{uri: img}}
                style={tw`w-32 h-32 mr-2 rounded-lg`}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Display existing videos */}
      {sheet?.video && sheet?.video?.length > 0 && (
        <View style={tw`mx-[20px] my-2`}>
          <Text style={tw`font-bold text-[#FF6769] mb-2`}>
            Existing Videos:
          </Text>
          <ScrollView horizontal>
            {sheet?.video?.map((vid, index) => (
              <View
                key={index}
                style={tw`w-32 h-32 mr-2 bg-gray-300 rounded-lg items-center justify-center`}>
                <Text style={tw`text-center`}>Video {index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Display newly selected images */}
      {images.length > 0 && (
        <View style={tw`mx-[20px] my-2`}>
          <Text style={tw`font-bold text-[#FF6769] mb-2`}>New Images:</Text>
          <ScrollView horizontal>
            {images.map((img, index) => (
              <View key={index} style={tw`relative mr-2`}>
                <Image
                  source={{uri: img.uri}}
                  style={tw`w-32 h-32 rounded-lg`}
                />
                <TouchableOpacity
                  style={tw`absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center`}
                  onPress={() => removeImage(index)}>
                  <Text style={tw`text-white`}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Display newly selected videos */}
      {videos.length > 0 && (
        <View style={tw`mx-[20px] my-2`}>
          <Text style={tw`font-bold text-[#FF6769] mb-2`}>New Videos:</Text>
          <ScrollView horizontal>
            {videos.map((vid, index) => (
              <View key={index} style={tw`relative mr-2`}>
                <View
                  style={tw`w-32 h-32 bg-gray-300 rounded-lg items-center justify-center`}>
                  <Text style={tw`text-center`}>Video {index + 1}</Text>
                </View>
                <TouchableOpacity
                  style={tw`absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center`}
                  onPress={() => removeVideo(index)}>
                  <Text style={tw`text-white`}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* File upload sections */}
      <View style={tw`flex-row justify-center space-x-4 my-4 gap-4`}>
        <TouchableOpacity
          onPress={handleImagePick}
          style={tw`border-2 border-dashed border-red-300 rounded-lg bg-[#F0F0F0] w-[40%] h-[150px] items-center justify-center`}>
          <SvgXml xml={imageupload} />
          <Text style={tw`text-[#777777] pt-2 font-bold`}>Take Image</Text>
          <Text style={tw`text-red-400`}>
            or <Text style={tw`font-bold`}>BROWSE</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleVideoPick}
          style={tw`border-2 border-dashed border-red-300 rounded-lg bg-[#F0F0F0] w-[40%] h-[150px] items-center justify-center`}>
          <SvgXml xml={videoUpload} />
          <Text style={tw`text-[#777777] pt-2 font-bold`}>Take Video</Text>
          <Text style={tw`text-red-400`}>
            or <Text style={tw`font-bold`}>BROWSE</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        disabled={isUpdating}
        style={tw`bg-[#ED1C24] w-[50%] mx-auto p-4 rounded-lg my-4 items-center`}
        onPress={handleSubmit(onSubmit)}>
        <Text style={tw`text-white font-bold`}>
          {isUpdating ? 'loading....' : 'Submit'}
        </Text>
      </TouchableOpacity>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </ScrollView>
  );
};

export default InspactionDetails;
