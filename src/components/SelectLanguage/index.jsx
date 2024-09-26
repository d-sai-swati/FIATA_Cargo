import { ArrowDown2 } from 'iconsax-react-native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Pressable, Image } from 'react-native';
import { Hp } from '../../utils/constants/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languages = [
    { label: 'English', value: 'en', flag: require('../../assets/icons/English.png') },
    { label: 'Russian', value: 'ru', flag: require('../../assets/icons/Russia.png') },
    { label: 'French', value: 'fr', flag: require('../../assets/icons/France.png') },
    { label: 'Chinese', value: 'zh', flag: require('../../assets/icons/China.png') },
    { label: 'Italian', value: 'it', flag: require('../../assets/icons/Italy.png') },
    { label: 'Spanish', value: 'es', flag: require('../../assets/icons/Spanish.png') },
    { label: 'Arabic', value: 'ar', flag: require('../../assets/icons/Arabic.png') },
];

const SelectLanguage = ({ defaultLanguageValue = "en", onSelect }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(
        languages.find(language => language.value === defaultLanguageValue)
    );
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (language) => {
        setSelectedLanguage(language);
        onSelect(language);
    };

 return (
        <View className="relative bg-[#E9F3FF] py-2 px-1 rounded-lg">
            <TouchableOpacity
                className="flex-row items-center justify-between"
                onPress={() => setIsOpen(!isOpen)}
            >
                <Image source={selectedLanguage.flag} className="h-5 w-7 mr-1" />
                <ArrowDown2 size={Hp(2)} color="black" variant="Bold" />
            </TouchableOpacity>

            {isOpen && (
                <Modal
                    transparent
                    visible={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                >
                    <Pressable
                        className="flex-1 justify-center items-center bg-black/30"
                        onPress={() => setIsOpen(false)}
                    >
                        <View className="bg-white border border-gray-300 rounded-lg w-64">
                            <FlatList
                                data={languages}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        className="p-3 gap-3 flex-row items-center border-b border-gray-200"
                                        onPress={() => {
                                            handleSelect(item);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <Image source={item.flag} className="h-5 w-7 mr-2" />
                                        <Text style={{ fontSize: Hp(1.8) }}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
};

export default SelectLanguage;