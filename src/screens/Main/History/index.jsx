import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native'
import Header from '../../../components/Header'
import { Hp } from '../../../utils/constants/themes'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axiosInstance from '../../../utils/axiosInstance'
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native'
import * as Sharing from 'expo-sharing';
import * as Permissions from 'expo-permissions'; 

const HistoryScreen = () => {
  const { t } = useTranslation()

  const [loading, setLoading] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status !== 'granted') {
      Alert.alert('Permission required', 'You need to enable storage permissions to download files.');
    }
  };

  useEffect(() => {
    getPermissionAsync();
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      console.log("fierhfiuejfdknlffrejdbhfrjdkfhuijdowksjdfksdjh");
      const response = await axiosInstance.get('/container-form', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistoryData(response.data.data);
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchHistoryData();
    }, [])
  );
  // const arrayBufferToBase64 = (buffer) => {
  //   let binary = '';
  //   const bytes = new Uint8Array(buffer);
  //   const len = bytes.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return btoa(binary);
  // };

  // const downloadPdf = async (id) => {
  //   setLoading(id);
  //   try {
  //     const token = await AsyncStorage.getItem('token');
      // const response = await axiosInstance.get(`/downloadPdf/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      //   responseType: 'arraybuffer',
      // });

  //     const base64Data = arrayBufferToBase64(response.data);
      
  //     const fileUri = FileSystem.documentDirectory + `checklist_${id}.pdf`;

  //     await FileSystem.writeAsStringAsync(fileUri, base64Data, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     Alert.alert('Success', 'PDF downloaded successfully.', [
  //       { text: 'OK', onPress: () => console.log('PDF saved at:', fileUri) }
  //     ]);
  //   } catch (error) {
  //     console.error('Error downloading PDF:', error);
  //     Alert.alert('Error', 'Failed to download PDF.');
  //   } finally {
  //     setLoading(null);
  //   }
  // };

  const downloadPdf = async (id) => {
    setLoading(id);

    try {
      const token = await AsyncStorage.getItem('token');
      const url = `http://192.168.0.101/api/downloadPdf/${id}`;

      // Log the URL to check if it's correct
      console.log('Downloading PDF from:', url);

      const fileUri = FileSystem.documentDirectory + `checklist_${id}.pdf`;

      const downloadResponse = await FileSystem.downloadAsync(url, fileUri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (downloadResponse.status === 200) {
        Alert.alert('Success', 'PDF downloaded successfully.');

        if (Platform.OS !== 'web' && await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
      } else {
        Alert.alert('Error', 'Failed to download PDF.');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert('Error', 'Failed to download PDF.');
    } finally {
      setLoading(null);
    }
  };
  return (
    <View className="bg-white flex-1">
      <Header title="History" />
      <ScrollView>
        {historyData.length === 0 ? (
          <View className="flex-row items-center justify-center">
            <Text className="text-center mt-5">{t('No History')}</Text>
          </View>
        ) : (
          historyData.map((items, index) => (
            <View key={index} className="p-4 bg-bgBlue m-5 rounded-2xl">
              <View className="flex-row flex-wrap">
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8),fontFamily:'Lato-Regular' }} className="text-gray-500">{t('container_number')}</Text>
                  <Text style={{ fontSize: Hp(2),fontFamily:'Lato-Regular' }} className="text-black">{items.container_number}</Text>
                </View>
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8),fontFamily:'Lato-Regular' }} className="text-gray-500">{t('date')}</Text>
                  <Text style={{ fontSize: Hp(2),fontFamily:'Lato-Regular' }} className="text-black">{items.date}</Text>
                </View>
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8),fontFamily:'Lato-Regular' }} className="text-gray-500">{t('created')}</Text>
                  <Text style={{ fontSize: Hp(2),fontFamily:'Lato-Regular' }} className="text-black">{items.created_at}</Text>
                </View>
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8),fontFamily:'Lato-Regular' }} className="text-gray-500">{t('responsible_person')}</Text>
                  <Text style={{ fontSize: Hp(2),fontFamily:'Lato-Regular' }} className="text-black">{items.responsible_person}</Text>
                </View>
                <View style={{ width: '50%', padding: 8 }}>
                  <Text style={{ fontSize: Hp(1.8), }} className="text-gray-500">{t('packing_address')}</Text>
                  <Text style={{ fontSize: Hp(2), fontFamily:'Lato-Regular'}} className="text-black">{items.packing_address}</Text>
                </View>
              </View>
              <TouchableOpacity className="bg-primary py-3 w-[50%] rounded-full items-center mt-5" onPress={() => downloadPdf(items.id)}>
                {
                  loading === items.id ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={{ fontSize: Hp(1.8), fontFamily:'Lato-Bold' }} className="text-white">Download PDF</Text>
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
