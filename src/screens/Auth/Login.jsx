import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Hp } from '../../utils/constants/themes';
import axiosInstance from '../../utils/axiosInstance';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen({ }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        const userData = {
            email,
            password,
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

    // Update the email and clear error on change
    const handleEmailChange = (text) => {
        setEmail(text);
        if (errors.email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: null }));
        }
    };

    // Update the password and clear error on change
    const handlePasswordChange = (text) => {
        setPassword(text);
        if (errors.password) {
            setErrors((prevErrors) => ({ ...prevErrors, password: null }));
        }
    };

    return (
        <ScrollView className="bg-white" contentContainerStyle={{ flexGrow: 1 }}>
            <View className="pt-20 flex-1 justify-center items-center">
                <Image
                    className="w-56 h-56"
                    source={require('../../../assets/images/Company-logo.png')}
                />
            </View>
            <View className="flex-1 justify-end">
                <View className="px-5 py-10 bg-bgBlue rounded-t-3xl">
                    <Text style={{
                        fontSize: Hp(2.5), fontFamily: 'QuietSemiBold'
                    }} className="font-bold">Log In</Text>
                    < TextInput
                        style={{ fontSize: Hp(1.8) }}
                        className="border-b border-gray-400 pt-5 pb-2 text-black"
                        placeholder="Email"
                        value={email}
                        onChangeText={handleEmailChange}
                    />
                    {errors.email && <Text style={{ color: 'red', marginTop: 5 }}>{errors.email[0]}</Text>}
                    <View className="flex-row items-center pt-4 border-b border-gray-400">
                        <TextInput
                            style={{ fontSize: Hp(1.8) }}
                            className="flex-1 pb-2 text-black"
                            placeholder="Password"
                            value={password}
                            onChangeText={handlePasswordChange}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={24}
                                color="gray"
                                style={{ marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                    </View>
                    {errors.password && <TextInput style={{ color: 'red' }}>{errors.password[0]}</TextInput>}

                    <TouchableOpacity className="bg-primary py-3 rounded-full items-center mt-5" onPress={handleLogin}>
                        {loading ? (
                            <ActivityIndicator color="white" /> // Show loader when loading
                        ) : (
                            <Text style={{ fontSize: Hp(1.8) }} className="text-white py-1 font-bold">Log In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text className="text-center text-primary py-5 font-bold">Forgot Password?</Text>
                    </TouchableOpacity>
                    {/* <Text className="text-center text-gray-400 py-5">Or continue with</Text>

          <TouchableOpacity className="bg-btnGray py-3 mb-4 rounded-full flex-row justify-center gap-2 items-center">
            <Image source={require('../../assets/icons/google.png')} className="w-4 h-4" />
            <Text style={{ fontSize: Hp(1.8) }} className="text-black font-semibold">Google</Text>
          </TouchableOpacity> */}

                    <Text className="text-center text-gray-500">
                        Dont have an account?{' '}
                        <Text style={{ fontSize: Hp(1.8) }} className="text-primary font-bold" onPress={() => navigation.navigate('Register')}>Creat now</Text>
                    </Text>

                </View>
            </View>

        </ScrollView>
    );
}
