import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Hp } from '../../utils/constants/themes';
import axiosInstance from '../../utils/axiosInstance';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ForgotPassword({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [resetpassword, setResetPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailVerificationToken, setEmailVerificationToken] = useState('');
    const [otp, setOtp] = useState('');
    console.log(otp)

    const handleSendOtp = async () => {
        if (!email) {
            setErrors({ email: 'Email is required' });
            return;
        }
        setLoading(true);

        try {
            console.log("helxxxxxxxxxxxxxxxxxxxxxxxxxxlidoihfuh")
            const response = await axiosInstance.post('/resendotp', { email });
            setOtpSent(true);
            console.log(response)
            Alert.alert('Success', response.data.message);
        } catch (error) {
            console.log(error)
            Alert.alert('Error', error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        console.log(email)
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/verify-otp?otp=${otp}&email=${email}`);
            console.log(email)
            if (response) {
                console.log(response.data);
                setEmailVerified(true);
                setEmailVerificationToken(response.data.user.email_verification_token);
            } else {
                Alert.alert('Invalid OTP');
            }
        } catch (error) {
            Alert.alert('Error', error.response.data.message);
            console.log(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };


    const handleResetPassword = async () => {
        if (!resetpassword || !confirmpassword) {
            setErrors({
                resetpassword: !resetpassword ? 'Password is required' : null,
                confirmpassword: !confirmpassword ? 'Please confirm your password' : null,
            });
            return;
        }

        if (resetpassword !== confirmpassword) {
            setErrors({ confirmpassword: 'Passwords do not match' });
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post(`/reset-password`, {
                email: email,
                password: resetpassword,
                password_confirmation: confirmpassword,
                email_verification_token: emailVerificationToken,
            });
            console.log("response reset", response)
            console.log(emailVerificationToken)

            if (response.data) {
                Alert.alert('Success', response.data.message);
                navigation.navigate('Login');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to reset password. Please try again.');
            console.log(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="bg-white">
            <View className="flex-grow bg-bgBlue">
                <View className="bg-bgBlue py-20 flex-row justify-center items-center">
                    <Image className="w-56 h-56" source={require('../../../assets/images/Company-logo.png')} />
                </View>
                <View className="flex-grow p-5 bg-white rounded-t-3xl">
                    <Text style={{ fontSize: Hp(2.5) }} className="font-bold">Reset Password</Text>

                    {/* Email Input */}
                    {!otpSent && (
                        <>
                            <TextInput
                                style={{ fontSize: Hp(1.8) }}
                                className="border-b border-gray-400 pt-5 pb-2 text-black"
                                placeholder="Email"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />
                            {errors.email && <Text style={{ color: 'red', marginTop: 5 }}>{errors.email}</Text>}

                            <TouchableOpacity
                                className="bg-primary py-3 rounded-full items-center mt-5"
                                onPress={handleSendOtp}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={{ fontSize: Hp(1.8) }} className="text-white py-1 font-bold">Send OTP</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Verification Code Input */}
                    {otpSent && !emailVerified && (
                        <>
                            <TextInput
                                style={{ fontSize: Hp(1.8) }}
                                className="border-b border-gray-400 pt-5 pb-2 text-black"
                                placeholder="Verification Code"
                                value={otp}
                                onChangeText={setOtp}
                            />
                            {errors.otp && <Text style={{ color: 'red', marginTop: 5 }}>{errors.otp}</Text>}

                            <TouchableOpacity
                                className="bg-primary py-3 rounded-full items-center mt-5"
                                onPress={handleVerifyOtp}
                            >
                                <Text style={{ fontSize: Hp(1.8) }} className="text-white py-1 font-bold">Confirm</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: Hp(1.5), marginTop: 10, textAlign: 'center' }}>
                                Didn't receive OTP? <Text className="text-primary" onPress={handleSendOtp}>Resend OTP</Text>
                            </Text>
                        </>

                    )}

                    {/* Reset Password Inputs */}
                    {emailVerified && (
                        <>
                            <TextInput
                                style={{ fontSize: Hp(1.8) }}
                                className="border-b border-gray-400 pt-5 pb-2 text-black hidden"
                                placeholder="Email"
                                value={email}
                            />
                            <TextInput
                                style={{ fontSize: Hp(1.8) }}
                                className="border-b border-gray-400 pt-5 pb-2 text-black hidden"
                                placeholder="Email Verification Token"
                                value={emailVerificationToken}
                            />
                            <View className="flex-row items-center border-b border-gray-400 pt-4">
                                <TextInput
                                    style={{ fontSize: Hp(1.8) }}
                                    className="flex-1 pb-2 text-black"
                                    placeholder="Reset Password"
                                    value={resetpassword}
                                    onChangeText={(text) => setResetPassword(text)}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row items-center border-b border-gray-400 pt-4">
                                <TextInput
                                    style={{ fontSize: Hp(1.8) }}
                                    className="flex-1 pb-2 text-black"
                                    placeholder="Confirm Password"
                                    value={confirmpassword}
                                    onChangeText={(text) => setConfirmPassword(text)}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="gray" style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            </View>
                            {errors.confirmpassword && <Text style={{ color: 'red' }}>{errors.confirmpassword}</Text>}

                            <TouchableOpacity
                                className="bg-primary py-3 rounded-full items-center mt-5"
                                onPress={handleResetPassword}
                            >
                                <Text style={{ fontSize: Hp(1.8) }} className="text-white py-1 font-bold">Reset Password</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
