import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Hp } from '../../utils/constants/themes';
import Ionicons from '@expo/vector-icons/Ionicons';
import axiosInstance from '../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowDown2 } from 'iconsax-react-native';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    // OTP states
    const [otp, setOtp] = useState('');
    const [otpModalVisible, setOtpModalVisible] = useState(false);

    const countries = ['India', 'USA', 'UK'];
    const genders = ['Male', 'Female', 'Other'];

    const handleRegister = async () => {
        const userData = {
            name: name,
            email: email,
            mobile: mobile,
            country: country,
            address: address,
            gender: gender,
            password: password,
            password_confirmation: confirmPassword,
        };
        try {
            setLoading(true);
            const response = await axiosInstance.post('/register', userData);
            console.log('Registration Response:', response.data);

            Alert.alert(response.data.message);
            // navigation.navigate('Login');
            if (response) {
                Alert.alert('OTP sent to your email');
                setOtpModalVisible(true);
            } else {
                Alert.alert('Registration failed');
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }

    };
    const handleInputChange = (field, value) => {
        setErrors(prevErrors => ({
            ...prevErrors,
            [field]: undefined,
        }));

        switch (field) {
            case 'name':
                setName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'mobile':
                setMobile(value);
                break;
            case 'address':
                setAddress(value);
                break;
            case 'country':
                setCountry(value);
                break;
            case 'gender':
                setGender(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    };

    const handleCountryDropdown = () => {
        setIsCountryDropdownOpen(!isCountryDropdownOpen);
        setIsGenderDropdownOpen(false);
    };

    const handleGenderDropdown = () => {
        setIsGenderDropdownOpen(!isGenderDropdownOpen);
        setIsCountryDropdownOpen(false);
    };

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/verify-otp?otp=${otp}&email=${email}`);
            if (response) {
                console.log(response.data);
                setOtpModalVisible(false);
                navigation.navigate('Login');
            } else {
                Alert.alert('Invalid OTP');
            }
        } catch (error) {
            Alert.alert('OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="bg-white" contentContainerStyle={{ flexGrow: 1 }}>
            <View className="py-16 mb-7 rounded-b-3xl items-center">
            </View>
            <View className="flex-grow px-5 py-10 bg-bgBlue rounded-t-3xl">
                <Text style={{ fontSize: Hp(2.5) }} className="font-bold">Create Account</Text>
                <TextInput
                    style={{ fontSize: Hp(1.8) }}
                    className="border-b border-gray-400 py-3 text-black"
                    placeholder="Full Name"
                    value={name}
                    onChangeText={(value) => handleInputChange('name', value)} />
                {errors.name && <TextInput style={{ color: 'red' }}>{errors.name[0]}</TextInput>}
                <TextInput
                    style={{ fontSize: Hp(1.8) }}
                    className="border-b border-gray-400 py-3 text-black"
                    placeholder="Email"
                    value={email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    autoCapitalize="none"
                    onFocus={() => setErrors({})}
                />
                {errors.email && <TextInput style={{ color: 'red' }}>{errors.email[0]}</TextInput>}
                <TextInput
                    style={{ fontSize: Hp(1.8) }}
                    className="border-b border-gray-400 py-3 text-black"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChangeText={(value) => handleInputChange('mobile', value)}
                    keyboardType="phone-pad"
                />
                {errors.mobile && <TextInput style={{ color: 'red' }}>{errors.mobile[0]}</TextInput>}
                <TextInput
                    style={{ fontSize: Hp(1.8) }}
                    className="border-b border-gray-400 py-3 text-black"
                    placeholder="Address"
                    value={address}
                    onChangeText={(value) => handleInputChange('address', value)}
                />
                {errors.address && <TextInput style={{ color: 'red' }}>{errors.address[0]}</TextInput>}
                <TouchableOpacity
                    onPress={handleCountryDropdown}
                    className="border-b border-gray-400 py-3 flex-row justify-between items-center"
                >
                    <TextInput
                        style={{ fontSize: Hp(1.8) }}
                        className="text-black"
                        placeholder="Country"
                        onChangeText={(value) => handleInputChange('country', value)}
                        value={country}
                        editable={false}
                    />
                    <ArrowDown2 size="16" color="black" />
                </TouchableOpacity>
                {isCountryDropdownOpen && (
                    <View className="border border-gray-400 w-1/2 rounded-md mt-2">
                        {countries.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setCountry(item);
                                    setIsCountryDropdownOpen(false);
                                }}>
                                <Text style={{ fontSize: Hp(1.8) }} className="p-2">
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {errors.country && <TextInput style={{ color: 'red' }}>{errors.country[0]}</TextInput>}
                <TouchableOpacity
                    onPress={handleGenderDropdown}
                    className="border-b border-gray-400 py-3 flex-row justify-between items-center"
                >
                    <TextInput
                        style={{ fontSize: Hp(1.8) }}
                        className="text-black"
                        placeholder="Gender"
                        onChangeText={(value) => handleInputChange('gender', value)}
                        value={gender}
                        editable={false}
                    />
                    <ArrowDown2 size="16" color="black" />

                </TouchableOpacity>
                {isGenderDropdownOpen && (
                    <View className="border border-gray-400 w-1/2 rounded-md mt-2">
                        {genders.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setGender(item);
                                    setIsGenderDropdownOpen(false);
                                }}>
                                <Text style={{ fontSize: Hp(1.8) }} className="p-2 text-base">
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {errors.gender && <TextInput style={{ color: 'red' }}>{errors.gender[0]}</TextInput>}
                <View className="flex-row items-center border-b border-gray-400 pt-4">
                    <TextInput
                        style={{ fontSize: Hp(1.8) }}
                        className="flex-1 pb-2 text-black"
                        placeholder="Password"
                        value={password}
                        onChangeText={(value) => handleInputChange('password', value)}
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
                <View className="flex-row items-center border-b border-gray-400 pt-4">
                    <TextInput
                        style={{ fontSize: Hp(1.8) }}
                        className="flex-1 x pb-2 text-black"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={(value) => handleInputChange('confirmPassword', value)}
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons
                            name={showConfirmPassword ? "eye-off" : "eye"}
                            size={24}
                            color="gray"
                            style={{ marginLeft: 10 }}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity className="bg-primary py-3 mt-5 rounded-full items-center" onPress={handleRegister}>
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{ fontSize: Hp(1.8) }} className="text-white text-base font-bold">Register</Text>
                    )}
                </TouchableOpacity>

                {/* <Text style={{ fontSize: Hp(1.8) }} className="text-center text-gray-500 py-4">Or continue with</Text>

                <TouchableOpacity className="bg-btnGray py-3 mb-4 rounded-full flex-row justify-center gap-2 items-center">
                    <Image source={require('../../assets/icons/google.png')} className="w-4 h-4" />
                    <Text style={{ fontSize: Hp(1.8) }} className="text-black font-semibold">Google</Text>
                </TouchableOpacity> */}

                <Text style={{ fontSize: Hp(1.8) }} className="text-center text-black py-5">
                    Already have an account?{' '}
                    <Text style={{ fontSize: Hp(1.8) }} className="text-primary font-bold" onPress={() => navigation.navigate('Login')}>Login now</Text>
                </Text>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={otpModalVisible}
                onRequestClose={() => {
                    setOtpModalVisible(!otpModalVisible);
                }}>
                <View className="p-5 flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View className="bg-white p-5 w-full rounded-lg">
                        <Text className="text-center font-bold mb-4">Enter OTP</Text>
                        <Text className="text-center mb-4">Enter Verification Code we sent to your Email</Text>
                        <TextInput
                            className="border-b border-gray-400 p-2 rounded-md"
                            placeholder="Enter OTP"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                        />

                        <TouchableOpacity onPress={handleVerifyOtp} className="bg-primary py-3 mt-5 rounded-full items-center">
                            <Text className="text-white font-bold">Verify OTP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOtpModalVisible(false)} className="mt-2">
                            <Text className="text-center text-red-500">Cancel</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: Hp(1.5), marginTop: 10, textAlign: 'center' }}>
                            Didn't receive OTP? <Text className="text-primary">Resend OTP</Text>
                        </Text>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
