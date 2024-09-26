import LottieView from 'lottie-react-native'
import React, { useEffect, useState } from 'react'
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import { Hp } from '../../../utils/constants/themes';
import { Ionicons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';


const ThankYou = ({ navigation }) => {
  const [pdfUri, setPdfUri] = useState('');

  useEffect(() => {
    const fetchPdfUri = async () => {
      const uri = await AsyncStorage.getItem('pdfUri');
      setPdfUri(uri);
    };
    fetchPdfUri();
  }, []);

  const handleCloseModal = () => {
    navigation.navigate('Home')
  };

  const handleSharePdf = async () => {
    if (pdfUri) {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Checklist PDF',
        });
      } else {
        alert('Sharing is not available on this platform');
      }
    } else {
      alert('PDF is not available');
    }
  };
  return (
    <View className="flex-1 bg-white">
      <TouchableOpacity
        className="flex-row mt-20 mx-5 justify-end"
        onPress={handleCloseModal}
      >
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <View className="flex-1 justify-center items-center bg-white px-5">
        <LottieView
          source={require('../../../assets/images/Thank-You.json')}
          autoPlay
          loop={false}
          style={{ width: 200, height: 200 }}
        />
        <Text className="font-bold text-gray-800 mt-5 uppercase" style={{ fontSize: Hp(2.5) }}>Thank You!</Text>
        <Text className="text-gray-600 text-center mt-2" style={{ fontSize: Hp(2) }}>
          Your submission has been received.
        </Text>
        <TouchableOpacity className="bg-primary py-3 flex-row justify-center w-full rounded-full items-center mt-5" onPress={handleSharePdf}>
          <Text style={{ fontSize: Hp(1.8) }} className="text-white py-1 font-bold">Share Form</Text>
          <Image source={require('../../../assets/icons/ShareIcon.png')} className="w-4 h-4 ml-3" />
        </TouchableOpacity>

        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-lg p-5 w-4/5">
              <Text className="text-lg font-bold text-gray-800 mb-4">
                Share Via
              </Text>
              <View className="flex-row justify-around mt-4">
                <TouchableOpacity className="items-center">
                  <View className="bg-gray-200 p-3 rounded-full">
                    <Image
                      source={require('../../../assets/icons/Email.png')}
                      style={{ width: 30, height: 30 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-black font-semibold mt-2">Email</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                  <View className="bg-gray-200 p-3 rounded-full">
                    <Image
                      source={require('../../../assets/icons/Whatsapp.png')}
                      style={{ width: 30, height: 30 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-black font-semibold mt-2">WhatsApp</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className="bg-primary mt-6 py-3 rounded-full items-center"
                onPress={handleCloseModal}
              >
                <Text className="text-white font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}
      </View>
    </View>
  )
}

export default ThankYou
