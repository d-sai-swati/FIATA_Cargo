import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';

const [otp, setOtp] = useState('');
const [otpModalVisible, setOtpModalVisible] = useState(false);

const handleVerifyOtp = async () => {
    try {
        setLoading(true);
        const response = await axiosInstance.get(`/verify-otp?otp=${otp}&email=${email}`);
        if (response.data.success) {
            Alert.alert('OTP Verified', 'You will be redirected to the login page');
            setOtpModalVisible(false);
            navigation.navigate('Login');
        } else {
            Alert.alert('Invalid OTP');
        }
    } catch (error) {
        console.error(error);
        Alert.alert('OTP verification failed');
    } finally {
        setLoading(false);
    }
};

return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={otpModalVisible}
        onRequestClose={() => {
            setOtpModalVisible(!otpModalVisible);
        }}>
        <View className="p-5 flex-1 justify-center items-center">
            <View className="bg-white p-5 w-full rounded-lg">
                <Text className="text-center font-bold mb-4">Enter OTP</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded-md"
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
            </View>
        </View>
    </Modal>
);
