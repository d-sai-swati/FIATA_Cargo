import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { ArrowLeft2, Setting2 } from 'iconsax-react-native';
import { useState } from 'react';
import SelectLanguage from '../SelectLanguage';
import { Hp } from '../../utils/constants/themes';


const Header = ({ title, isRightIcon, onPress, onBackPress }) => {
    const navigation = useNavigation();
    const [selectedLanguage, setSelectedLanguage] = useState({ label: 'Lang', value: '' });
    return (
        <View className="flex-row gap-2 items-center rounded-3xl bg-[#0092C8] px-4 pb-8  pt-20" style={{
            ...Platform.select({
                ios: {
                    shadowColor: '#bbb',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                },
                android: {
                    elevation: 10,
                },
            }),
        }}>
            {/* <TouchableOpacity onPress={onBackPress || () => navigation.goBack()}> */}
            <TouchableOpacity onPress={onBackPress || navigation.goBack}>
                <ArrowLeft2 size={Hp(2.5)} color="white" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-white" style={[{ fontSize: Hp(2.5), fontFamily: 'Calibri-Bold'}, Platform.select({ ios: { fontSize: Hp(2.3) } })]}>{title}</Text>
            {isRightIcon &&
                <TouchableOpacity onPress={onPress}>
                    <Setting2 size="24" color='white' />
                </TouchableOpacity>
            }
        </View>
    )
}

export default Header;