import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, Platform, Alert, ActivityIndicator, StatusBar } from 'react-native'
import Header from '../../../components/Header'
import { Hp } from '../../../utils/constants/themes'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axiosInstance from '../../../utils/axiosInstance'
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native'
import * as Sharing from 'expo-sharing';
import NetInfo from '@react-native-community/netinfo';
import { encode } from 'base64-arraybuffer';
const HistoryScreen = () => {
  const { t } = useTranslation()
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  // Status Bar
  useFocusEffect(
    React.useCallback(() => {
      fetchHistoryData();
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor('transparent');

      // Optional: return a cleanup function to reset StatusBar when leaving the screen
      return () => {
        StatusBar.setBarStyle('dark-content', true);
      };
    }, [])
  );

  useEffect(() => {
    fetchHistoryData();
  }, []);

  // ============ network status ===========
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        fetchHistoryData();
      }else {
        
      }
    });

    // Check for stored data when the app starts
    loadHistoryData();

    return () => unsubscribe();
  }, []);

  const loadHistoryData = async () => {
    const storedData = await AsyncStorage.getItem('historyData');
    if (storedData) {
      setHistoryData(JSON.parse(storedData));
    }
  };

  const fetchHistoryData = async () => {
    if (loading) return;
    const token = await AsyncStorage.getItem('token');
    try {
      console.log("fierhfiuejfdknlffrejdbhfrjdkfhuijdowksjdfksdjh");
      const response = await axiosInstance.get('/container-form', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistoryData(response.data.data);

      // store history data in AsyncStorage
      await AsyncStorage.setItem('historyData', JSON.stringify(response.data.data));
      // await AsyncStorage.setItem('historyData', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching history data:', error);
    }finally {
      setLoading(false);  // Stop loading indicator
    }r
  };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchHistoryData();
  //   }, [])
  // );
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const downloadPdf = async (id) => {
    setLoading(id);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axiosInstance.get(`/downloadPdf/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer',
      });

      const base64Data = arrayBufferToBase64(response.data);
      const fileUri = FileSystem.documentDirectory + `checklist_${id}.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      if (Platform.OS !== 'web' && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
      // Alert.alert('Success', 'PDF downloaded successfully.', [
      //   { text: 'OK', onPress: () => console.log('PDF saved at:', fileUri) }
      // ]);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert('Error', 'Failed to download PDF.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <View className="bg-white flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <Header title="History" />
      {!isConnected && <View className="flex-row items-center justify-center">
        <Text style={{ fontSize: 14, fontFamily: 'Lato-Regular' }} className="text-red-500 text-center mt-5">You are Offline</Text>
      </View>}
      <ScrollView>
        {historyData.length === 0 ? (
          <View className="flex-row items-center justify-center">
            <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="text-center mt-5">{t('No History')}</Text>
          </View>
        ) : (
          historyData.map((items, index) => (
            <View key={index} className="p-4 bg-bgBlue m-5 rounded-2xl mt-10">
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
                  <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }} className="text-gray-500">Create On</Text>
                  <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="text-black">{items.created_at}</Text>
                </View>
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }} className="text-gray-500">Responsible Person</Text>
                  <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="text-black">{items.responsible_person}</Text>
                </View>
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }} className="text-gray-500">Packing Address</Text>
                  <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="text-black">{items.packing_address}</Text>
                </View>
              </View>
              <TouchableOpacity className="bg-primary py-3 w-[50%] rounded-full items-center mt-5" onPress={() => downloadPdf(items.id)}>
                {
                  loading === items.id ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Bold' }} className="text-white">Share PDF</Text>
                  )
                }
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default HistoryScreen;

