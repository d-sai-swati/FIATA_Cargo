import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ArrowLeft2 } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View, Text, Platform } from 'react-native';
import Header from '../../../components/Header';
import { Hp } from '../../../utils/constants/themes';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ContainerDetails = () => {
    const navigation = useNavigation();
    const [language, setLanguage] = useState('');
    const [containerNumber, setContainerNumber] = useState('');
    const [date, setDate] = useState('');
    const [packingAddress, setPackingAddress] = useState('');
    const [responsiblePerson, setResponsiblePerson] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { t } = useTranslation();

    const handleProceed = async () => {
        const shipmentData = {
            language:language,
            container_number: containerNumber,
            date: date,
            packing_address: packingAddress,
            responsible_person: responsiblePerson,
        };
        const jsonValue = JSON.stringify(shipmentData);
        await AsyncStorage.setItem('shipmentData', jsonValue);

        navigation.navigate('Checklist', { shipmentData });
    };
    
    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString();
            setDate(formattedDate);
        }
    };
    // const handleLanguageSelect = async () => {
    //    const language = await AsyncStorage.getItem('language');
    //    console.log('language', language);
    //    return language
    // }
    useFocusEffect(() => {
        const fetchSelectedLanguage = async () => {
          const storedLanguage = await AsyncStorage.getItem('language');
          if (storedLanguage) {
            setLanguage(storedLanguage);
          }
        };
        fetchSelectedLanguage();
      });
      
    return (
        <View className="flex-1 bg-white">
            <Header title={t('containerHeading')} />
            <ScrollView>
                <View className="p-4">
                    <Text style={{ fontSize: Hp(2.2) }} className="font-bold text-center pb-5">{t('containerTitle')}</Text>
                    <Text style={{ fontSize: Hp(1.8) }} className="font-semibold text-center">{t('containerDescription')}</Text>
                </View>
                <View className="p-4">
                    <TextInput
                    style={{ fontSize: Hp(1.8) }}
                    className="border-b border-gray-300 p-3 rounded-lg mb-4"
                    placeholder="Language"
                    value={language}
                    />
                    <TextInput
                        style={{ fontSize: Hp(1.8) }}
                        className="border-b border-gray-300 p-3 rounded-lg mb-4"
                        placeholder="Container number"
                        value={containerNumber}
                        onChangeText={setContainerNumber}
                    />
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{ fontSize: Hp(1.8) }}
                        className="border-b border-gray-300 p-3 rounded-lg mb-4"
                    >
                        <Text className={`${date ? 'text-black' : 'text-gray-400'}`}>{date || 'Select Date'}</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={{ fontSize: Hp(1.8) }}
                        className="border-b border-gray-300 p-3 rounded-lg mb-4"
                        placeholder="Packing address (City/Country)"
                        value={packingAddress}
                        onChangeText={setPackingAddress}
                    />
                    <TextInput
                        style={{ fontSize: Hp(1.8) }}
                        className="border-b border-gray-300 p-3 rounded-lg mb-4"
                        placeholder="Responsible person"
                        value={responsiblePerson}
                        onChangeText={setResponsiblePerson}
                    />
                    <TouchableOpacity className="bg-primary py-3 rounded-full items-center mt-5" onPress={handleProceed}>
                        <Text style={{ fontSize: Hp(1.8) }} className="text-white py-1 font-bold">Proceed</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {showDatePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="calendar"
                    onChange={onDateChange}
                />
            )}
        </View>
    );
};

export default ContainerDetails;