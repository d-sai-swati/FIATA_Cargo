import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { Hp } from '../../utils/constants/themes';
import axiosInstance from '../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Eye, EyeSlash } from 'iconsax-react-native';

export default function LoginScreen({ }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    useFocusEffect(
        React.useCallback(() => {
            setErrors({});
            return () => {
                setErrors({});
            };
        }, [])
    );


    const handleLogin = async () => {
        const userData = {
            email: email,
            password: password
        };
        try {
            setLoading(true);
            const response = await axiosInstance.post('/login', userData);
            console.log('login Response:', response.data);
            await AsyncStorage.setItem('token', response.data.access_token);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            setEmail('');
            setPassword('');

            navigation.navigate('Tabs');

        } catch (error) {
            console.log('login Error:', error.response.data.message);

            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response && error.response.data && error.response.data.message) {
                Alert.alert("Error", error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };
   

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView className="bg-white" contentContainerStyle={{ flexGrow: 1 }}>
                <View className="pt-20 ios:pt-20 flex-1 justify-center items-center">
                    <Image
                        className="w-56 h-56 ios:w-60 ios:h-60"
                        // style={{ width: Wp(60), height: Hp(30)}}
                        source={require('../../../assets/images/Company-logo.png')}
                    />
                </View>
                <View className="flex-1 justify-end">
                    <View className="px-5 py-10 ios:px-5 ios:py-10 bg-bgBlue rounded-t-3xl">
                        <Text style={{ fontSize: Hp(2.5), fontFamily: 'Calibri-Regular' }} className="font-bold">Log In</Text>
                        <TextInput
                            style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}
                            className="border-b border-gray-400 py-3 ios:pb-3 ios:pt-8 text-black"
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            onFocus={() => setErrors((prevErrors) => ({ ...prevErrors, email: null }))}
                        />

                        {errors.email && <Text style={{ color: 'red', marginTop: 5 }}>{errors.email[0]}</Text>}

                        <View className="flex-row items-center pt-4 ios:pb-2 ios:pt-6 border-b border-gray-400">
                            <TextInput
                                style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}
                                className="flex-1 ios:pb-2 pb-2 text-black"
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={!showPassword}
                                onFocus={() => setErrors((prevErrors) => ({ ...prevErrors, password: null }))}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <Eye size={Hp(3)} color="gray" />
                                ) : (
                                    <EyeSlash size={Hp(3)} color="gray" />
                                )}
                            </TouchableOpacity>

                        </View>
                        
                        {errors.password && <TextInput style={{ color: 'red' }}>{errors.password[0]}</TextInput>}

                        <TouchableOpacity className="bg-primary ios:py-3 mt-5 ios:mt-8 py-3 rounded-full items-center " onPress={handleLogin}>
                            {loading ? (
                                <ActivityIndicator color="white" /> // Show loader when loading
                            ) : (
                                <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Bold' }} className="text-white ios:py-1 py-1">Log In</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Bold' }} className="text-center text-primary py-5">Forgot Password?</Text>
                        </TouchableOpacity>
                        {/* <Text className="text-center text-gray-400 py-5">Or continue with</Text>

          <TouchableOpacity className="bg-btnGray py-3 mb-4 rounded-full flex-row justify-center gap-2 items-center">
            <Image source={require('../../assets/icons/google.png')} className="w-4 h-4" />
            <Text style={{ fontSize: Hp(1.8) }} className="text-black font-semibold">Google</Text>
          </TouchableOpacity> */}

                        <Text className="text-center text-gray-500">
                            Dont have an account?{' '}
                            <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Bold' }} className="text-primary" onPress={() => navigation.navigate('Register')}>Creat now</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}