import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import BannerSwiper from '../../../components/BannerSwiper';
import { useNavigation } from '@react-navigation/native';
import SelectLanguage from '../../../components/SelectLanguage';
import { Hp } from '../../../utils/constants/themes';
import { useTranslation } from 'react-i18next';
import i18next from '../../../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const { t } = useTranslation();
    const handleLanguageSelect = async (language) => {
        i18next.changeLanguage(language.value);
        await AsyncStorage.setItem('language', language.value);
        console.log(language.value);
    };
    const navigation = useNavigation();
    return (
        <View className="bg-white flex-1">
            <View className="flex-row items-center gap-2 pt-[20%] px-2 pb-5  border-b border-gray-300">
                <Image source={require('../../../../assets/images/Company-logo.png')} className="w-10 h-10" />
                <View className="flex-col flex-1">
                    <Text style={{ fontSize: Hp(2), fontFamily: 'Calibri' }} className="font-bold text-primary border-b border-primary pb-1 mb-1">{t('companyName')}</Text>
                    <Text style={{ fontSize: Hp(2), fontStyle: 'italic', fontFamily: 'Calibri' }} className="text-primary">{t('companyDescription')}</Text>
                </View>
                <View className="flex-row items-center">
                    <SelectLanguage
                        onSelect={handleLanguageSelect}
                    />
                </View>
            </View>
            <ScrollView className="pt-5">
                <BannerSwiper />
                <View className="p-5">
                    <View className="mt-6 items-center">
                        <Image
                            source={require('../../../../assets/images/FIATA.png')}
                            className="w-48"
                            resizeMode='contain'
                        />
                        <Text style={{ fontSize: Hp(2.2), fontFamily: 'Lato' }} className="font-bold text-center mt-4">{t('2024_FIATA')}</Text>
                        <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato' }} className="mt-2 text-black text-center">{t('2024_FIATA_Description')}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>

    );
};

export default HomeScreen;
