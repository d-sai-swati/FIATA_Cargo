import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import BannerSwiper from '../../../components/BannerSwiper';
import { useNavigation } from '@react-navigation/native';
import SelectLanguage from '../../../components/SelectLanguage';
import { Hp } from '../../../utils/constants/themes';
import { useTranslation } from 'react-i18next';
import i18next from '../../../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const HomeScreen = () => {
    const { t } = useTranslation();
    const handleLanguageSelect = async (language) => {
        i18next.changeLanguage(language.value);
        await AsyncStorage.setItem('language', language.value);
    };

    const navigation = useNavigation();
    return (
        <View className="bg-white flex-1">
            {/* <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            /> */}
            <StatusBar style="dark" translucent backgroundColor="transparent" />
            <View className="flex-row items-center gap-2 pt-[20%] px-2 pb-5" style={{
                backgroundColor: '#fff',
                ...Platform.select({
                    ios: {
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                    },
                    android: {
                        elevation: 10,
                    },
                })
            }}>
                <Image source={require('../../../../assets/images/Company-logo.png')} className="w-10 h-10 ios:w-12 ios:h-12" />
                <View className="flex-col flex-1">
                    <View className=" border-b border-primary pb-2 mb-2">
                        <Text style={[{ fontSize: Hp(2.2), fontFamily: 'Calibri-Bold' }]} className="text-primary">{t('companyName')}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: Hp(2), fontStyle: 'italic', fontFamily: 'Calibri-Regular' }} className="text-primary">{t('companyDescription')}</Text>
                    </View>
                </View>
                <View className="flex-row items-center">
                    <SelectLanguage onSelect={handleLanguageSelect}/>
                </View>
            </View>
            <ScrollView className="pt-10">
                <BannerSwiper />
                <View className="p-5">
                    <View className="mt-6 mb-10 items-center">
                        <Image
                            source={require('../../../../assets/images/FIATA.png')}
                            className="w-48"
                            resizeMode='contain'
                        />
                        <Text style={{ fontSize: Hp(2.2), fontFamily: 'Lato-Bold', textAlign: 'justify' }} className="text-center mt-4">{t('2024_FIATA')}</Text>
                        <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular',textAlign: 'justify' }} className="mt-2 text-black text-center">{t('2024_FIATA_Description')}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>

    );
};

export default HomeScreen;