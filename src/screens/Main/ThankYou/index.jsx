import LottieView from 'lottie-react-native'
import React, { useEffect, useState } from 'react'
import { Image, Modal, Text, TouchableOpacity, View, StatusBar } from 'react-native'
import { Hp } from '../../../utils/constants/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';
// import { StatusBar } from 'expo-status-bar';


const ThankYou = ({ navigation }) => {
  const [pdfUri, setPdfUri] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true);
      StatusBar.setBackgroundColor('transparent');

      return () => {
        StatusBar.setBarStyle('light-content', true);
      };
    }, [])
  );

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
      {/* <StatusBar style="dark" translucent backgroundColor="transparent" /> */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <TouchableOpacity
        className="flex-row mt-20 mx-5 p-3 justify-end"
        onPress={handleCloseModal}
      >
        <Image source={require('../../../../assets/icons/cross-icon.png')} className="w-4 h-4" />

      </TouchableOpacity>
      <View className="flex-1 justify-center items-center bg-white px-5">
        <LottieView
          source={require('../../../../assets/images/Thank-You.json')}
          autoPlay
          loop={false}
          style={{ width: 200, height: 200 }}
        />
        <Text className="text-gray-800 mt-5 uppercase" style={{ fontSize: Hp(2.5), fontFamily: 'Lato-Bold' }}>Thank You!</Text>
        <Text className="text-gray-600 text-center mt-2" style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }}>
          Your submission has been received.
        </Text>
        <TouchableOpacity className="bg-primary py-3 flex-row justify-center w-full rounded-full items-center mt-5" onPress={handleSharePdf}>
          <Text style={{ fontSize: Hp(1.8),fontFamily: 'Lato-Bold' }} className="text-white py-1">Share Form</Text>
          <Image source={require('../../../../assets/icons/ShareIcon.png')} className="w-4 h-4 ml-3" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ThankYou
