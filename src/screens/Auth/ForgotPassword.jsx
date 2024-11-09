import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Hp, Wp } from '../../utils/constants/themes';
import axiosInstance from '../../utils/axiosInstance';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { useFocusEffect } from '@react-navigation/native';

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
    const [otpSuccessMessage, setOtpSuccessMessage] = useState('');
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
            setOtpSuccessMessage('OTP sent successfully!');
            console.log(response)
            // Alert.alert('Success', response.data.message);
            setTimeout(() => {
                setOtpSuccessMessage('');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
            console.log('invalid email=======================', error)
            // Alert.alert('Error', error.response.data.message);
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
            if (error.response && error.response.data) {
                // setErrors(error.response.data.errors);
                if (error.response.data.message) {
                    setErrors({ otp: error.response.data.message }); // Store OTP error message here
                }
            }
            // Alert.alert('Error', error.response.data.message);
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
                // Alert.alert('Success', response.data.message);
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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView className="bg-white" contentContainerStyle={{ flexGrow: 1 }}>
                {/* <View className="flex-grow"> */}
                <View className="pt-20 ios:pt-20 flex-1 justify-center items-center">
                    <Image
                        className="w-56 h-56 ios:w-60 ios:h-60"
                        // style={{ width: Wp(60), height: Hp(30)}}
                        source={require('../../../assets/images/Company-logo.png')}
                    />
                </View>
                <View className="flex-1 justify-end">
                    <View className="px-5 py-10 ios:px-5 ios:pt-10 ios:pb-32 bg-bgBlue rounded-t-3xl">

                        {/* Email Input */}
                        {!otpSent && (
                            <>
                                <Text style={{ fontSize: Hp(2.5), fontFamily: 'Calibri-Bold' }} className="ios:pb-3">Reset Password</Text>
                                <TextInput
                                    style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}
                                    className="border-b border-gray-400 pt-5 pb-2 ios:py-5 text-black"
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={(text) => setEmail(text)}
                                    onFocus={() => setErrors((prevErrors) => ({ ...prevErrors, email: null }))}
                                />
                                {errors.email && <Text style={{ color: 'red', marginTop: 5, fontFamily: 'Lato-Regular' }}>{errors.email}</Text>}

                                <TouchableOpacity
                                    className="bg-primary py-3 rounded-full items-center mt-5 ios:mt-8"
                                    onPress={handleSendOtp}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Bold' }} className="text-white py-1">Send OTP</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Verification Code Input */}
                        {otpSent && !emailVerified && (
                            <>
                                <Text style={{ fontSize: Hp(2.5), fontFamily: 'Calibri-Bold' }} className=" ios:pb-3">Verification Code</Text>
                                <Text className="pt-2 text-gray-500" style={{ fontSize: Hp(1.5), fontFamily: 'Lato-Regular' }}>Otp sent to {email} please verify</Text>
                                <TextInput
                                    style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}
                                    className="border-b border-gray-400 pt-5 pb-2 ios:py-5 text-black"
                                    placeholder="Verification Code"
                                    value={otp}
                                    onChangeText={setOtp}
                                    onFocus={() => setErrors((prevErrors) => ({ ...prevErrors, otp: null }))}
                                />
                                {errors.otp && <Text style={{ color: 'red', marginTop: 5, fontFamily: 'Lato-Regular' }}>{errors.otp}</Text>}

                                <TouchableOpacity
                                    className="bg-primary py-3 rounded-full items-center mt-5 ios:mt-8"
                                    onPress={handleVerifyOtp}
                                >
                                    <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Bold' }} className="text-white py-1">Confirm</Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: Hp(1.5), textAlign: 'center', fontFamily: 'Lato-Regular' }} className="text-gray-500 mt-6">
                                    Didn't receive OTP? <Text style={{ fontFamily: 'Lato-Bold' }} className="text-primary" onPress={handleSendOtp}>Resend OTP</Text>
                                </Text>
                                {otpSuccessMessage && (
                                    <Text style={{ textAlign: 'center', color: 'green', fontSize: Hp(1.8), marginTop: 10, fontFamily: 'Lato-Regular' }}>
                                        {otpSuccessMessage}
                                    </Text>
                                )}
                            </>

                        )}

                        {/* Reset Password Inputs */}
                        {emailVerified && (
                            <>
                                <TextInput
                                    style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}
                                    className="border-b border-gray-400 text-black hidden"
                                    placeholder="Email"
                                    value={email}
                                />
                                {errors.email && <Text style={{ color: 'red', marginTop: 5, fontFamily: 'Lato-Regular' }}>{errors.email}</Text>}
                                <TextInput
                                    style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}
                                    className="border-b border-gray-400 text-black hidden"
                                    placeholder="Email Verification Token"
                                    value={emailVerificationToken}
                                />
                                <View className="flex-row items-center border-b border-gray-400 ios:pb-3 ios:pt-6 pt-4">
                                    <TextInput
                                        style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}
                                        className="flex-1 pb-2 text-black"
                                        placeholder="New Password"
                                        value={resetpassword}
                                        onChangeText={(text) => setResetPassword(text)}
                                        secureTextEntry={!showPassword}
                                        onFocus={() => setErrors((prevErrors) => ({ ...prevErrors, resetpassword: null }))}
                                    />
                                    {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <Eye size={Hp(3)} color="gray" />
                                        ) : (
                                            <EyeSlash size={Hp(3)} color="gray" />
                                        )}
                                    </TouchableOpacity>
                                </View>

                                <View className="flex-row items-center border-b border-gray-400 ios:pb-3 ios:pt-6 pt-4">
                                    <TextInput
                                        style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}
                                        className="flex-1 pb-2 text-black"
                                        placeholder="Confirm Password"
                                        value={confirmpassword}
                                        onChangeText={(text) => setConfirmPassword(text)}
                                        secureTextEntry={!showConfirmPassword}
                                        onFocus={() => setErrors((prevErrors) => ({ ...prevErrors, confirmpassword: null }))}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? (
                                            <Eye size={Hp(3)} color="gray" />
                                        ) : (
                                            <EyeSlash size={Hp(3)} color="gray" />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                {errors.confirmpassword && <Text style={{ color: 'red', fontFamily: 'Lato-Regular' }}>{errors.confirmpassword}</Text>}

                                <TouchableOpacity
                                    className="bg-primary py-3 rounded-full items-center mt-5 ios:mt-8"
                                    onPress={handleResetPassword}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Bold' }} className="text-white py-1">Reset Password</Text>
                                    )}
                                </TouchableOpacity>

                            </>
                        )}
                    </View>
                </View>
                {/* </View> */}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
