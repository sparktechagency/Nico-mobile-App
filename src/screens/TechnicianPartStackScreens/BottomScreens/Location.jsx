import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import LocationNotfound from '../../../lib/components/LocationNotfound';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyARXa6r8AXKRaoeWqyesQNBI8Y3EUEWSnY';

const LocationScreen = ({route}) => {
  if (!route?.params) {
    return <LocationNotfound />;
  }
  const {userinfo} = route.params || {};

  const [userLocation, setUserLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [destination, setDestination] = useState(null);
  const [searchModal, setSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [distance, setDistance] = useState('');
  const [loading, setLoading] = useState(false);
  const [trafficEnabled, setTrafficEnabled] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [isMapReady, setIsMapReady] = useState(false);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [showCoordinates, setShowCoordinates] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'granted') {
          getCurrentLocation();
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        console.log('Current Location:', currentLocation);
        setUserLocation(currentLocation);
        if (mapRef.current) {
          mapRef.current.animateToRegion(currentLocation, 1000);
        }
        setLoading(false);
      },
      error => {
        console.log(error.code, error.message);
        Alert.alert('Error', 'Unable to get location');
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const searchPlaces = async query => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_MAPS_APIKEY}&components=country:us`,
      );
      const data = await response.json();
      if (data.status === 'OK') {
        setSearchResults(data.predictions);
      } else {
        console.error('Places API Error:', data.status);
        Alert.alert('Error', 'Failed to search places');
      }
    } catch (error) {
      console.error('Error searching places:', error);
      Alert.alert('Error', 'Failed to search places');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelect = async placeId => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_APIKEY}`,
      );
      const data = await response.json();

      if (data.status === 'OK') {
        const location = data.result.geometry.location;
        const newDestination = {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        setDestination(newDestination);
        setSearchModal(false);
        setSearchQuery('');

        if (mapRef.current && userLocation) {
          mapRef.current.fitToCoordinates(
            [
              {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              },
              {
                latitude: newDestination.latitude,
                longitude: newDestination.longitude,
              },
            ],
            {
              edgePadding: {top: 100, right: 100, bottom: 100, left: 100},
              animated: true,
            },
          );
        }
      } else {
        console.error('Place Details API Error:', data.status);
        Alert.alert('Error', 'Failed to get place details');
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      Alert.alert('Error', 'Failed to get place details');
    }
  };

  const toggleMapType = () => {
    setMapType(prevType =>
      prevType === 'standard'
        ? 'satellite'
        : prevType === 'satellite'
        ? 'hybrid'
        : 'standard',
    );
  };

  const changeTravelMode = () => {
    setTravelMode(prevMode =>
      prevMode === 'DRIVING'
        ? 'WALKING'
        : prevMode === 'WALKING'
        ? 'BICYCLING'
        : prevMode === 'BICYCLING'
        ? 'TRANSIT'
        : 'DRIVING',
    );
  };

  const getTravelModeIcon = () => {
    switch (travelMode) {
      case 'DRIVING':
        return 'car';
      case 'WALKING':
        return 'walk';
      case 'BICYCLING':
        return 'bicycle';
      case 'TRANSIT':
        return 'bus';
      default:
        return 'car';
    }
  };

  const toggleCoordinates = () => {
    setShowCoordinates(!showCoordinates);
  };

  const copyCoordinates = async () => {
    await Clipboard.setString(
      `${userLocation.latitude}, ${userLocation.longitude}`,
    );
    Alert.alert('Copied!', 'Coordinates copied to clipboard');
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {userinfo ? (
        <SafeAreaView style={tw`flex-1 bg-white`}>
          <StatusBar barStyle="dark-content" backgroundColor="white" />

          {/* Search Bar */}
          <TouchableOpacity
            style={tw`absolute top-12 left-5 right-5 h-12 bg-white rounded-full z-10 flex-row items-center px-5 shadow-lg`}
            onPress={() => setSearchModal(true)}>
            <Icon name="search" size={20} style={tw`text-gray-500`} />
            <Text style={tw`ml-2 text-gray-500 text-base`}>Where to?</Text>
          </TouchableOpacity>

          {/* Map View */}
          {userLocation && (
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={tw`flex-1`}
              initialRegion={userLocation}
              showsUserLocation
              showsMyLocationButton
              showsCompass
              showsTraffic={trafficEnabled}
              mapType={mapType}
              onMapReady={() => setIsMapReady(true)}
              loadingEnabled={true}
              loadingIndicatorColor="#2E7D32"
              loadingBackgroundColor="#f5f5f5">
              {destination && (
                <>
                  <Marker
                    coordinate={{
                      latitude: destination.latitude,
                      longitude: destination.longitude,
                    }}
                    anchor={{x: 0.5, y: 0.5}} // Center point of the marker
                    flat={true} // Makes marker flat against the map
                    rotation={userLocation.heading} // Rotate with user's heading if available
                    title="Destination"
                    description="Your destination"
                    pinColor="red"
                  />
                  <MapViewDirections
                    origin={{
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    }}
                    destination={{
                      latitude: destination.latitude,
                      longitude: destination.longitude,
                    }}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={8}
                    strokeColor="#2E7D32"
                    mode={travelMode}
                    onReady={result => {
                      setEstimatedTime(`${Math.floor(result.duration)} mins`);
                      setDistance(`${result.distance.toFixed(1)} km`);
                    }}
                    onError={errorMessage => {
                      console.log('Directions error:', errorMessage);
                      Alert.alert('Error', 'Could not calculate route');
                    }}
                  />
                </>
              )}
            </MapView>
          )}

          {/* Controls Container */}
          <View
            style={tw`absolute right-4 bottom-28 bg-white rounded-2xl p-2 shadow-lg`}>
            <TouchableOpacity
              style={tw`p-2 my-1 items-center justify-center`}
              onPress={() => setTrafficEnabled(!trafficEnabled)}>
              <Icon
                name="traffic"
                size={24}
                style={tw`${trafficEnabled ? 'text-green-700' : 'text-black'}`}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`p-2 my-1 items-center justify-center`}
              onPress={toggleMapType}>
              <Icon
                name={mapType === 'standard' ? 'map' : 'earth'}
                size={24}
                style={tw`text-black`}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`p-2 my-1 items-center justify-center`}
              onPress={changeTravelMode}>
              <Icon
                name={getTravelModeIcon()}
                size={24}
                style={tw`text-black`}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`p-2 my-1 items-center justify-center`}
              onPress={toggleCoordinates}>
              <Icon name="pin" size={24} style={tw`text-black`} />
            </TouchableOpacity>
          </View>

          {/* Destination Info */}
          {destination && estimatedTime && (
            <View
              style={tw`absolute bottom-5 left-5 right-5 bg-white rounded-xl p-4 shadow-lg`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>
                Destination
              </Text>
              <View style={tw`flex-row items-center my-1`}>
                <Icon name="time" size={18} style={tw`text-gray-500`} />
                <Text style={tw`ml-2 text-gray-500 text-base`}>
                  Time: {estimatedTime}
                </Text>
              </View>
              <View style={tw`flex-row items-center my-1`}>
                <Icon name="distance" size={18} style={tw`text-gray-500`} />
                <Text style={tw`ml-2 text-gray-500 text-base`}>
                  Distance: {distance}
                </Text>
              </View>
              <View style={tw`flex-row items-center my-1`}>
                <Icon
                  name={getTravelModeIcon()}
                  size={18}
                  style={tw`text-gray-500`}
                />
                <Text style={tw`ml-2 text-gray-500 text-base`}>
                  Mode:{' '}
                  {travelMode.charAt(0) + travelMode.slice(1).toLowerCase()}
                </Text>
              </View>
            </View>
          )}

          {/* Coordinates Display */}
          {showCoordinates && userLocation && (
            <View
              style={tw`absolute top-28 left-5 bg-black bg-opacity-70 rounded-lg p-3`}>
              <Text style={tw`text-white text-sm`}>
                Lat: {userLocation.latitude.toFixed(6)}
              </Text>
              <Text style={tw`text-white text-sm`}>
                Long: {userLocation.longitude.toFixed(6)}
              </Text>
              <TouchableOpacity onPress={copyCoordinates}>
                <Text style={tw`text-green-400 text-sm mt-1`}>Tap to copy</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Search Modal */}
          <Modal
            visible={searchModal}
            animationType="slide"
            transparent={false}>
            <SafeAreaView style={tw`flex-1 bg-white`}>
              <View
                style={tw`flex-row items-center p-4 border-b border-gray-200`}>
                <TouchableOpacity
                  onPress={() => {
                    setSearchModal(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}>
                  <Icon name="arrow-back" size={24} style={tw`text-black`} />
                </TouchableOpacity>
                <TextInput
                  style={tw`flex-1 ml-4 h-10 px-4 bg-gray-100 rounded-full`}
                  placeholder="Search destination"
                  value={searchQuery}
                  onChangeText={text => {
                    setSearchQuery(text);
                    searchPlaces(text);
                  }}
                  autoFocus
                  clearButtonMode="while-editing"
                />
              </View>

              {loading ? (
                <ActivityIndicator
                  style={tw`mt-5`}
                  size="large"
                  color="#2E7D32"
                />
              ) : (
                <ScrollView style={tw`flex-1`}>
                  {searchResults.map(result => (
                    <TouchableOpacity
                      key={result.place_id}
                      style={tw`flex-row items-center p-4 border-b border-gray-100`}
                      onPress={() => handlePlaceSelect(result.place_id)}>
                      <Icon
                        name="location"
                        size={24}
                        style={tw`text-gray-500`}
                      />
                      <View style={tw`ml-4 flex-1`}>
                        <Text style={tw`text-base font-medium`}>
                          {result.structured_formatting.main_text}
                        </Text>
                        <Text style={tw`text-sm text-gray-500 mt-1`}>
                          {result.structured_formatting.secondary_text}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </SafeAreaView>
          </Modal>

          {/* Loading Indicator */}
          {loading && (
            <View
              style={tw`absolute inset-0 bg-white bg-opacity-70 justify-center items-center z-50`}>
              <ActivityIndicator size="large" color="#2E7D32" />
            </View>
          )}
        </SafeAreaView>
      ) : (
        <LocationNotfound />
      )}
    </View>
  );
};

export default LocationScreen;
