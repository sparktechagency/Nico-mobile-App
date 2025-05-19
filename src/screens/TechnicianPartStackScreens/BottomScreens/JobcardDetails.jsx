import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {SvgXml} from 'react-native-svg';
import tw from '../../../lib/tailwind';
import {
  Downarrow,
  imageupload,
  locationicon,
  rightArrow,
  successmodalIcon,
  videoUpload,
} from '../../../assets/Icons/icons';
import TicketDetailsHeader from '../../../lib/components/TicketDetailsHeader';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  useGetSingleJobCardQuery,
  useUpdateJobCardMutation,
} from '../../../redux/apiSlices/jobCard';

const SuccessModal = ({visible, onClose}) => (
  <Modal visible={visible} transparent>
    <View style={tw`flex-1 bg-black/50 justify-center items-center`}>
      <View style={tw`bg-white p-6 rounded-lg w-3/4`}>
        <View style={tw`flex flex-row items-center justify-center`}>
          <SvgXml xml={successmodalIcon} />
        </View>
        <Text style={tw`text-[16px] text-[#00950A] font-bold mb-2 text-center`}>
          CONGRATULATION
        </Text>
        <Text
          style={tw`text-[14px] font-normal text-gray-500 text-center px-4 mb-4`}>
          Your work is done
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

const JobcardDetails = ({navigation, route}) => {
  const {jobcard} = route.params;
  const id = jobcard?.id;

  const {data: singlecard, isLoading} = useGetSingleJobCardQuery(id);
  const [updateJobCard, {isLoading: isUpdating}] = useUpdateJobCardMutation();
  const cardData = singlecard?.data;

  const {control, handleSubmit, setValue} = useForm({
    defaultValues: {
      status: cardData?.status || 'New',
      technician_comment: cardData?.technician_comment || '',
    },
  });

  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const statusItems = [
    {label: 'New', value: 'New'},
    {label: 'Assigned', value: 'Assigned'},
    {label: 'Inspection sheet', value: 'Inspection'},
    {label: 'Awaiting purchase order', value: 'Purchase'},
    {label: 'Job card created', value: 'Job-card'},
    {label: 'To be allocated', value: 'to be allocated'},
    {label: 'Awaiting courier', value: 'awaiting courier'},
    {label: 'Collected by Courier', value: 'collected by courier'},
    {label: 'Parts required', value: 'parts required'},
    {label: 'Picking', value: 'Picking'},
    {label: 'To be invoiced', value: 'to be invoiced'},
    {label: 'Invoiced', value: 'Invoiced'},
    {label: 'Completed', value: 'Completed'},
  ];

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0,
        includeBase64: false,
      },
      response => {
        if (!response.didCancel && !response.errorCode && response.assets) {
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
        selectionLimit: 0,
        includeBase64: false,
      },
      response => {
        if (!response.didCancel && !response.errorCode && response.assets) {
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
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const removeVideo = index => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const onSubmit = async data => {
    try {
      const formData = new FormData();

      // Add required fields
      formData.append('job_status', data.status.toLowerCase());
      formData.append('technician_comment', data.technician_comment);

      // Add images as an array
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, {
          uri: image.uri,
          name: image.name || `image_${index}.jpg`,
          type: image.type || 'image/jpeg',
        });
      });

      // Add videos as an array
      videos.forEach((video, index) => {
        formData.append(`videos[${index}]`, {
          uri: video.uri,
          name: video.name || `video_${index}.mp4`,
          type: video.type || 'video/mp4',
        });
      });

      // Log FormData contents for debugging
      for (const [key, value] of formData._parts) {
        console.log(key, value);
      }

      // Make the API call
      const response = await updateJobCard({id, formData}).unwrap();

      if (response.status === true) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.data?.message || 'Failed to update job card');
    }
  };
  // ... [Rest of your component code remains the same until the submit button]

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#ED1C24" />
      </View>
    );
  }

  if (!cardData) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>No data available</Text>
      </View>
    );
  }
  return (
    <ScrollView style={tw`bg-white flex-1`}>
      {/* ... [All your existing UI components] ... */}
      <TicketDetailsHeader />

      {/* Asset Information */}
      <View style={tw`bg-[#FFE7E7] p-4 rounded-lg mx-[20px] my-2 mt-6`}>
        <Text style={tw`text-[14px] font-bold text-[#FF6769] mb-1`}>
          {cardData?.inspection_sheet?.ticket?.asset?.brand || 'No Asset Name'}
        </Text>
        <Text style={tw`text-[#000000] text-[12px] font-medium`}>
          {cardData?.inspection_sheet?.ticket?.asset?.serial_number ||
            'No Serial Number'}
        </Text>
      </View>

      {/* Problem Description */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>More about problem:</Text>
        <Text style={tw`text-gray-600 text-[14px] font-normal`}>
          {cardData?.support_agent_comment || 'No description available'}
        </Text>
      </View>

      {/* Customer Information */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Name:</Text>
        <Text style={tw`text-[#000000]`}>
          {cardData?.inspection_sheet?.ticket?.user?.name || 'No Name'}
        </Text>
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Address:</Text>
        <View style={tw`flex flex-row items-center justify-between`}>
          <Text style={tw`text-[#000000]`}>
            {cardData?.inspection_sheet?.ticket?.user?.address || 'No Address'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Location')}>
            <SvgXml xml={locationicon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Assignment Information */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Assigned by:</Text>
        <Text style={tw`text-[#000000]`}>
          {cardData?.inspection_sheet?.assigned?.name || 'No Assignee'}
        </Text>
      </View>

      {/* Ticket Details */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Ticket number:</Text>
        <Text style={tw`text-[#000000]`}>#{cardData?.ticket_id}</Text>
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Purchase order number:</Text>
        <Text style={tw`text-[#000000]`}>
          #{cardData?.inspection_sheet?.ticket?.order_number || 'Not available'}
        </Text>
      </View>

      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Total value:</Text>
        <Text style={tw`text-[#000000]`}>
          ${cardData?.inspection_sheet?.ticket?.cost || '0'}
        </Text>
      </View>

      {/* Signature */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>
          Signature of location employee:
        </Text>
        {cardData?.location_employee_signature ? (
          <Image
            source={{uri: cardData.location_employee_signature}}
            style={tw`w-full h-40 mt-2`}
            resizeMode="contain"
          />
        ) : (
          <Text style={tw`text-[#000000]`}>No signature available</Text>
        )}
      </View>

      {/* Status Selection */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Ticket status:</Text>
        <Controller
          control={control}
          name="status"
          render={({field: {value, onChange}}) => (
            <>
              <TouchableOpacity
                onPress={() => setOpen(!open)}
                style={tw`flex-row justify-between items-center mt-2 rounded-lg p-2`}>
                <Text style={tw`text-gray-600`}>{value}</Text>
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
                  {statusItems.map(item => (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => {
                        onChange(item.label);
                        setOpen(false);
                      }}
                      style={tw`border border-gray-300 p-2 ${
                        value === item.label ? 'bg-red-100' : 'bg-white'
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

      {/* Technician Comment */}
      <View style={tw`bg-[#F0F0F0] p-4 rounded-lg mx-[20px] my-2`}>
        <Text style={tw`font-bold text-[#FF6769]`}>Your Comment</Text>
        <Controller
          control={control}
          name="technician_comment"
          rules={{required: true}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="Type your comments here..."
              multiline
              textAlignVertical="top"
              style={tw`p-2 rounded-lg mt-2 h-[190px]`}
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={cardData?.technician_comment || value}
            />
          )}
        />
      </View>

      {/* Existing Media */}
      {cardData?.image?.length > 0 && (
        <View style={tw`mx-[20px] my-2`}>
          <Text style={tw`font-bold text-[#FF6769] mb-2`}>
            Existing Images:
          </Text>
          <ScrollView horizontal>
            {cardData.image.map((img, index) => (
              <View key={index} style={tw`mr-2`}>
                <Image source={{uri: img}} style={tw`w-32 h-32 rounded-lg`} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {cardData?.video?.length > 0 && (
        <View style={tw`mx-[20px] my-2`}>
          <Text style={tw`font-bold text-[#FF6769] mb-2`}>
            Existing Videos:
          </Text>
          <ScrollView horizontal>
            {cardData.video.map((vid, index) => (
              <View
                key={index}
                style={tw`w-32 h-32 mr-2 rounded-lg bg-gray-300 justify-center items-center`}>
                <Text style={tw`text-center`}>Video {index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* New Media Uploads */}
      {images.length > 0 && (
        <View style={tw`mx-[20px] my-2`}>
          <Text style={tw`font-bold text-[#FF6769] mb-2`}>
            New Images ({images.length}):
          </Text>
          <ScrollView horizontal>
            {images.map((img, index) => (
              <View key={index} style={tw`mr-2 relative`}>
                <Image
                  source={{uri: img.uri}}
                  style={tw`w-32 h-32 rounded-lg`}
                />
                <View
                  style={tw`absolute bottom-0 left-0 right-0 bg-black/50 p-1`}>
                  <Text style={tw`text-white text-xs`} numberOfLines={1}>
                    {img.name}
                  </Text>
                  <Text style={tw`text-white text-xs`}>
                    {Math.round(img.size / 1024)} KB
                  </Text>
                </View>
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

      {videos.length > 0 && (
        <View style={tw`mx-[20px] my-2`}>
          <Text style={tw`font-bold text-[#FF6769] mb-2`}>
            New Videos ({videos.length}):
          </Text>
          <ScrollView horizontal>
            {videos.map((vid, index) => (
              <View key={index} style={tw`mr-2 relative`}>
                <View
                  style={tw`w-32 h-32 rounded-lg bg-gray-300 justify-center items-center`}>
                  <Text style={tw`text-center`}>Video Preview</Text>
                </View>
                <View
                  style={tw`absolute bottom-0 left-0 right-0 bg-black/50 p-1`}>
                  <Text style={tw`text-white text-xs`} numberOfLines={1}>
                    {vid.name}
                  </Text>
                  <Text style={tw`text-white text-xs`}>
                    {Math.round(vid.size / 1024)} KB
                  </Text>
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

      {/* Upload Buttons */}
      <View style={tw`flex-row justify-center space-x-4 my-4 gap-4`}>
        <TouchableOpacity
          onPress={handleImagePick}
          style={tw`border-2 border-dashed border-red-300 rounded-lg bg-[#F0F0F0] w-[40%] h-[150px] items-center justify-center`}>
          <SvgXml xml={imageupload} />
          <Text style={tw`text-[#777777] pt-2 font-bold`}>Add Images</Text>
          <Text style={tw`text-red-400`}>
            or <Text style={tw`font-bold`}>BROWSE</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleVideoPick}
          style={tw`border-2 border-dashed border-red-300 rounded-lg bg-[#F0F0F0] w-[40%] h-[150px] items-center justify-center`}>
          <SvgXml xml={videoUpload} />
          <Text style={tw`text-[#777777] pt-2 font-bold`}>Add Videos</Text>
          <Text style={tw`text-red-400`}>
            or <Text style={tw`font-bold`}>BROWSE</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={tw`bg-[#ED1C24] w-[50%] mx-auto p-4 rounded-lg my-4 items-center`}
        onPress={handleSubmit(onSubmit)}
        disabled={isUpdating}>
        {isUpdating ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={tw`text-white font-bold`}>SAVE & SEND</Text>
        )}
      </TouchableOpacity>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </ScrollView>
  );
};

export default JobcardDetails;
