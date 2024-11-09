import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axiosInstance from '../../../utils/axiosInstance';
import * as FileSystem from 'expo-file-system';
import Header from '../../../components/Header';
import { Hp } from '../../../utils/constants/themes';
import { useTranslation } from 'react-i18next';

const DraftScreen = ({ navigation }) => {
  const { t } = useTranslation()
  const [draftData, setDraftData] = useState([]); // Initialize as an empty array
  const [isConnected, setIsConnected] = useState(true);
  console.log("draftdata dfjnnfo", draftData)

  // Function to fetch draft from AsyncStorage
  // useEffect(() => {
  //   const fetchDraft = async () => {
  //     try {
  //       const storedDraft = await AsyncStorage.getItem('draftForm');
  //       console.log('Draft fetched successfully store:', storedDraft);
  //       if (storedDraft) {
  //         const parsedDraft = JSON.parse(storedDraft);
  //         console.log('Draft fetched successfully:', parsedDraft);
  //         // Check if the stored draft is an array before setting state
  //         if (Array.isArray(parsedDraft)) {
  //           setDraftData(parsedDraft);
  //         } else {
  //           console.log('Draft is not an array:', parsedDraft);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error retrieving draft:', error);
  //     }
  //   };

  //   // Fetch draft data when the component mounts
  //   fetchDraft();

  //   // Listen for network status changes
  //   const networkUnsubscribe = NetInfo.addEventListener(state => {
  //     // if (state.isConnected && draftData && draftData.length > 0) {
  //     //   // If online and there's a draft, submit it
  //     //   // handleAutoSubmit(draftData);
  //     // }
  //     if (!state.isConnected) {
  //       setIsConnected(false);
  //     } else {
  //       setIsConnected(true);
  //       console.log("Connected to the internet");
  //     }
  //   });

  //   // Cleanup listener when component unmounts
  //   const focusUnsubscribe = navigation.addListener('focus', fetchDraft);
  //   return () =>{
  //     networkUnsubscribe()
  //     focusUnsubscribe()
  //   }
  // }, []);

  const fetchDraft = async () => {
    console.log("Fetching draft data..."); 
    try {
      const storedDraft = await AsyncStorage.getItem('draftForm');
      if (storedDraft) {
        const parsedDraft = JSON.parse(storedDraft);
        if (Array.isArray(parsedDraft)) {
          setDraftData(parsedDraft);
          console.log("Draft fetched successfully:", parsedDraft);
        }
      }
    } catch (error) {
      console.error('Error retrieving draft:', error);
    }
  };
  useEffect(() => {
    // Fetch draft when the screen is focused
    const focusListener = navigation.addListener('focus', () => {
      console.log("DraftScreen focused, fetching draft data...");
      fetchDraft();
    });

    // Cleanup listener on unmount
    return () => focusListener();
  }, [navigation]); // Only re-run the effect when navigation changes

  useEffect(() => {
    // Listen for network status changes
    const networkUnsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        console.log("Connected to the internet, attempting auto-submit...");
        handleAutoSubmit();
      }
    });

    return () => networkUnsubscribe();
  }, [draftData]);

  // const handleAutoSubmit = async (draftData) => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     const response = await axiosInstance.post('/container-form', draftData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       responseType: 'arraybuffer',
  //     });

  //     if (response) {
  //       console.log('Resubmission successful:', response.data.data);
  //       // Clear draft from AsyncStorage and navigate to History screen
  //       setDraftData('');
  //       await AsyncStorage.removeItem('draftForm');
  //     }
  //   } catch (error) {
  //     console.error('Error resubmitting draft:', error.message);
  //     Alert.alert('Error', 'Failed to resubmit the form.');
  //   }
  // };


  const handleAutoSubmit = async () => {
    if (!isConnected || draftData.length === 0) {
      console.log("No internet connection or no draft data to submit.");
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('token');
      
      // Check if token exists
      if (!token) {
        console.log("No token found in AsyncStorage.");
        return;
      }
  
      // Loop through each draft and submit it
      for (const draft of draftData) {
        console.log('Submitting draft:', draft); // Log draft data for inspection
        try {
          const response = await axiosInstance.post('/container-form', draft, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (response.status === 200) {
            console.log('Draft submitted successfully:', response.data);
          } else {
            console.log('Unexpected response status:', response.status);
          }
        } catch (error) {
          // If the error is related to the response from the serve
          if (error.response) {
            console.error('Error resubmitting draft:', error.response.data); // Server error details
          } else {
            console.error('Error during resubmission:', error.message);
          }
        }
      }
  
      // Clear draft data after successful submission
      await AsyncStorage.removeItem('draftForm');
      setDraftData([]); // Clear local state as well
    } catch (error) {
      console.error('Error during auto-submission:', error);
      Alert.alert('Error', 'Failed to submit the form due to network issues.');
    }
  };

  

  return (
    <View className="bg-white flex-1">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <Header title="Draft" />
      {!isConnected && <View className="flex-row items-center justify-center">
        <Text style={{ fontSize: 14, fontFamily: 'Lato-Regular' }} className="text-red-500 text-center mt-5">You are Offline</Text>
      </View>}
      <ScrollView>
        {draftData.length === 0 ? (
          <View className="flex-row items-center justify-center">
            <Text style={{ fontSize: 14, fontFamily: 'Lato-Regular' }} className="text-center mt-5">No Saved forms</Text>
          </View>
        ) : (
          draftData.slice().reverse().map((items, index) => (
            <View key={index} className="p-4 bg-bgBlue m-5 rounded-2xl mt-5">
              <View className="flex-row flex-wrap">
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }} className="text-gray-500">Container Number</Text>
                  <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="text-black">{items.container_number}</Text>
                </View>
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }} className="text-gray-500">Date</Text>
                  <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="text-black">{items.date}</Text>
                </View>
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }} className="text-gray-500">Responsible Person</Text>
                  <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="text-black">{items.responsible_person}</Text>
                </View>
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }} className="text-gray-500">Packing Address</Text>
                  <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="text-black">{items.packing_address}</Text>
                </View>
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }} className="text-gray-500">Status</Text>
                  <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="text-black">{items.status}</Text>
                </View>

                {/* <TouchableOpacity
                  className="bg-primary py-3 w-[50%] rounded-full items-center mt-5"
                  onPress={() => handleAutoSubmit(items)}
                // disabled={loading}
                >

                  <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Bold' }} className="text-white">{t('submit')}</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default DraftScreen;
