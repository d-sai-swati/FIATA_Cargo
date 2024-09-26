import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const Splash = () => {

    const navigation = useNavigation();

    // useEffect(() => {
    //   const checkAuthentication = async () => {
    //     try {
    //       // await new Promise(resolve => setTimeout(resolve, 2000));

    //       const accessToken = await AsyncStorage.getItem('token');

    //       if (accessToken) {
    //         navigation.navigate('Tabs')
    //       } else {
    //         navigation.navigate('Login')
    //       }
    //     } catch (error) {
    //       console.error('Failed to check authentication:', error);
    //       Alert.alert('Error', 'There was an error checking authentication. Please try again.');
    //     }
    //   };

    //   checkAuthentication();
    // }, []);

    const loginInCheck = async () => {
        const data = await AsyncStorage.getItem('token');
        if (data) {
            navigation.replace('Tabs');
        } else {
            navigation.replace('Login');
        }
    }
    useEffect(() => {
        setTimeout(() => {
            loginInCheck()
        }, 1000);
    }, [])
    return (
        <View className='flex-1 justify-center items-center bg-white px-10'>
            <Image
                source={require('../../../assets/images/Company-logo.png')}
                className='w-48 h-48 mb-10'
            />
        </View>
    )
}

export default Splash
