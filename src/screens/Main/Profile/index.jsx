import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput, Button, Alert, Platform, KeyboardAvoidingView, FlatList, StatusBar, DeviceEventEmitter } from 'react-native';
import Header from '../../../components/Header';
import { ArrowDown2, ArrowUp2, Edit2, LogoutCurve, ProfileDelete, Verify } from 'iconsax-react-native';
import { Hp } from '../../../utils/constants/themes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { logoutEvent } from '../../../utils/axiosInstance';
import i18next from 'i18next';
import { getNameList, getNames } from 'country-list';
// import { StatusBar } from 'expo-status-bar';

const ProfileScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [user, setUser] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatedUser, setUpdatedUser] = useState({
        name: '',
        mobile: '',
        email: '',
        country: '',
        gender: '',

    });
    const countries = getNames();
    const filteredCountries = countries.filter(country =>
        country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const genders = ['Male', 'Female', 'Other'];
    const openSettings = () => {
        setSidebarVisible(true);
    };
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBarStyle('light-content', true);
            StatusBar.setBackgroundColor('transparent');

            // Optional: return a cleanup function to reset StatusBar when leaving the screen
            return () => {
                StatusBar.setBarStyle('dark-content', true);
            };
        }, [])
    );

    // useEffect(() => {
    const fetchUserData = async () => {
        const storedUser = await AsyncStorage.getItem('user');
        console.log(storedUser);
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setUpdatedUser(parsedUser);
        }
    };
    // fetchUserData();
    // }, []);

    useFocusEffect(
        useCallback(() => {
            // Close all modals when returning to the screen
            setModalVisible(false);
            setSidebarVisible(false);
            setLogoutModal(false);
            setDeleteModalVisible(false);
            fetchUserData();
        }, [])
    );
    const handleCountryDropdown = () => {
        setIsCountryDropdownOpen(!isCountryDropdownOpen);
        setIsGenderDropdownOpen(false);
    };
    const handleGenderDropdown = () => {
        setIsGenderDropdownOpen(!isGenderDropdownOpen);
        setIsCountryDropdownOpen(false);
    };

    const handleUpdate = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            // console.log("updated user",updatedUser);
            console.log('edit profile token', token);
            const payload = {
                name: updatedUser.name,
                mobile: updatedUser.mobile,
                email: updatedUser.email,
                country: updatedUser.country,
                gender: updatedUser.gender
            }
            const response = await axiosInstance.post(`profile/${user.id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("update response", response);

            await AsyncStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);

            setModalVisible(false);

        } catch (error) {
            console.error('Update failed:', error);
        }
    };
    const handleLogout = async () => {
        console.log('logging outkmfomofkd');
        try {
            // AsyncStorage.clear();
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('shipments');
            await AsyncStorage.removeItem('draftForm');
            i18next.changeLanguage("en");

            navigation.navigate('Login');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            })
        } catch (error) {
            console.error('Failed to log out:', error);
            Alert.alert('Logout Error', 'There was an error logging out. Please try again.');
        }
    };
    useEffect(() => {
        const logoutListener = DeviceEventEmitter.addListener('logout', handleLogout);
        return () => logoutListener.remove(); // Clean up on unmount
    }, []);

    const handleDeleteAccount = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');
            const user = JSON.parse(storedUser);

            const response = await axiosInstance.delete(`profile/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });


            if (response) {
                console.log("eufgieugfhisdjojihf", response)
                await AsyncStorage.removeItem('user');
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('shipments');
                await AsyncStorage.removeItem('historyData');
                await AsyncStorage.removeItem('draftForm')
                setDeleteModalVisible(false);
                // Alert.alert(response.data.message);

                navigation.navigate('Login');
            } else {
                Alert.alert('Error', 'There was an issue deleting your account.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            Alert.alert('Error', 'Failed to delete account.');
        }
    };
    const handleLogoutModal = () => {
        setSidebarVisible(false);
        setLogoutModal(true);
    }
    const handleDeleteModal = () => {
        setSidebarVisible(false);
        setDeleteModalVisible(true);
    }
    return (
        <View className="bg-white flex-1">
            {/* <StatusBar style="light" translucent backgroundColor="transparent" /> */}
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent={true}
            />
            <Header title="Profile" isRightIcon={true} onPress={openSettings} />
            <View>
                <View className="bg-bgBlue mx-5 p-5 h-[400px] ios:h-[450px] rounded-2xl shadow-lg items-center relative mt-[20%]">
                    <View className="w-full">
                        <View className="flex-row justify-between items-center">
                            <Text style={{ fontSize: Hp(2.5), fontFamily: 'Lato-Bold' }} className="text-center text-black mr-4">
                                {user.name}
                            </Text>
                            <TouchableOpacity className="flex-row items-center" onPress={() => setModalVisible(true)}>
                                <Edit2 size={Hp(2.5)} color="#0291C9" variant="Bold" />
                                <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="text-primary font-semibold ml-2">Edit</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="border-t border-primary my-5 w-full" />

                        <Text style={[{ fontSize: Hp(2.5), fontFamily: 'Lato-Regular' }, Platform.select({ ios: { fontSize: Hp(2.3) } })]} className="text-primary font-semibold underline">Personal Info</Text>
                        <View >
                            <Text style={[{ fontSize: Hp(2.2), fontFamily: 'Lato-Regular' }, Platform.select({ ios: { fontSize: Hp(2) } })]} className="text-gray-500 mt-4">Email</Text>
                            <Text style={[{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }, Platform.select({ ios: { fontSize: Hp(1.8) } })]} className="text-black mt-2">{user.email}</Text>

                            <Text style={[{ fontSize: Hp(2.2), fontFamily: 'Lato-Regular' }, Platform.select({ ios: { fontSize: Hp(2) } })]} className="text-gray-500 mt-4">Mobile Phone</Text>
                            <Text style={[{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }, Platform.select({ ios: { fontSize: Hp(1.8) } })]} className="text-black mt-2">{user.mobile}</Text>


                            <Text style={[{ fontSize: Hp(2.2), fontFamily: 'Lato-Regular' }, Platform.select({ ios: { fontSize: Hp(2) } })]} className="text-gray-500 mt-4">Country</Text>
                            <Text style={[{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }, Platform.select({ ios: { fontSize: Hp(1.8) } })]} className="text-black mt-2">{user.country}</Text>

                            <Text style={[{ fontSize: Hp(2.2), fontFamily: 'Lato-Regular' }, Platform.select({ ios: { fontSize: Hp(2) } })]} className="text-gray-500 mt-4">Gender</Text>
                            <Text style={[{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }, Platform.select({ ios: { fontSize: Hp(1.8) } })]} className="text-black mt-2">{user.gender}</Text>

                        </View>

                    </View>
                </View>
            </View>

            {/* ============== sidebar modal ===================== */}
            <Modal
                visible={sidebarVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSidebarVisible(false)}
            >
                <View className="flex-1 justify-end items-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View className="w-64 ios:w-72 h-full bg-white p-5 shadow-lg ios:pt-14">
                        <View className="flex-row items-center justify-between">
                            <Text style={{ fontSize: Hp(2.2), fontFamily: 'Calibri-Bold' }}>Settings</Text>
                            <TouchableOpacity className="p-3" onPress={() => setSidebarVisible(false)}>
                                <Image source={require('../../../../assets/icons/cross-icon.png')} className="w-4 h-4" onPress={() => setSidebarVisible(false)} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity className="flex-row items-center mt-5 pb-5 border-b border-gray-300 " onPress={handleLogoutModal}>
                            <Text style={[{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }, Platform.select({ ios: { fontSize: Hp(1.8) } })]} className="text-red-500 mr-2">{t('Log Out')}</Text>
                            <LogoutCurve
                                size={Hp(2.2)}
                                color="red"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center my-5" onPress={handleDeleteModal}>
                            <Text style={[{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }, Platform.select({ ios: { fontSize: Hp(1.8) } })]} className="text-red-500 mr-2">{t('Delete Account')}</Text>
                            <ProfileDelete size={Hp(2.2)}
                                color="red" />
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>


            {/* ============== Logout Modal ===================== */}
            <Modal
                visible={logoutModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setLogoutModal(false)}
            >
                <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View className="bg-white p-5 rounded-xl shadow-lg w-11/12">
                        <Text className="text-center mb-4" style={{ fontSize: Hp(2.2), fontFamily: 'Calibri-Bold' }}>Log Out</Text>
                        <Text className="text-center mb-4" style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }}>Are you sure you want to log out?</Text>

                        <View className="flex-row justify-around pt-3">
                            <TouchableOpacity className="bg-gray-300 py-2 px-5 rounded-full" onPress={() => setLogoutModal(false)}>
                                <Text className="text-black" style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-red-500 py-2 px-5 rounded-full" onPress={handleLogout}>
                                <Text className="text-white" style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ============== Delete Account Confirmation Modal ===================== */}
            <Modal
                visible={deleteModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View className="bg-white p-5 rounded-xl shadow-lg w-11/12">
                        <Text className="text-center mb-4" style={{ fontSize: Hp(2.2), fontFamily: 'Calibri-Bold' }}>Delete Account</Text>
                        <Text className="text-center mb-4" style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }}>Are you sure you want to delete your account? This action cannot be undone.</Text>
                        <View className="flex-row justify-around pt-3">
                            <TouchableOpacity className="bg-gray-300 py-2 px-5 rounded-full" onPress={() => setDeleteModalVisible(false)}>
                                <Text className="text-black" style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} >Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-red-500 py-2 px-5 rounded-full" onPress={handleDeleteAccount}>
                                <Text className="text-white" style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* ============== Edit profile ==================== */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View className="bg-white p-5 rounded-xl shadow-lg w-11/12">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-center" style={{ fontSize: Hp(2.2), fontFamily: 'Calibri-Bold' }}>Edit Profile</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)} className="p-3" >
                                    <Image source={require('../../../../assets/icons/cross-icon.png')} className="w-3 h-3" />
                                </TouchableOpacity>
                            </View>

                            {/* Editable fields */}
                            <TextInput
                                value={updatedUser.name}
                                onChangeText={(text) => setUpdatedUser({ ...updatedUser, name: text })}
                                placeholder="Name"
                                className="border-b border-gray-300 pt-5 pb-2 text-black"
                                style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }}
                            />

                            <TextInput
                                value={updatedUser.mobile}
                                onChangeText={(text) => setUpdatedUser({ ...updatedUser, mobile: text })}
                                placeholder="Mobile Phone"
                                className="border-b border-gray-300 pt-5 pb-2 text-black"
                                keyboardType="phone-pad"
                                style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }}
                            />
                            <TextInput
                                value={updatedUser.email}
                                onChangeText={(text) => setUpdatedUser({ ...updatedUser, email: text })}
                                placeholder="Email"
                                className="border-b border-gray-300 pt-5 pb-2 ios:text-gray-300"
                                keyboardType="email-address"
                                editable={false}
                                style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }}
                            />

                            {/* ============ country ================ */}
                            <TouchableOpacity onPress={handleCountryDropdown} className="border-b border-gray-300 ios:py-5 flex-row justify-between items-center">
                                <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="pt-5 pb-2 text-black">{updatedUser.country || 'Select Country'}</Text>
                                {isCountryDropdownOpen ? <ArrowUp2 size="16" color="black" /> :<ArrowDown2 size="16" color="black" />}
                            </TouchableOpacity>

                            {isCountryDropdownOpen && (
                                <View className="border border-gray-400 w-full rounded-md mt-2">
                                    <TextInput
                                        style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}
                                        placeholder="Search country"
                                        value={searchTerm}
                                        onChangeText={setSearchTerm}
                                        className="border-b border-gray-300 px-2 py-1"
                                    />
                                    <ScrollView
                                        style={{ maxHeight: Hp(13) }}
                                        nestedScrollEnabled={true}
                                    >
                                        {filteredCountries.map((item, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    setCountry(item);
                                                    setIsCountryDropdownOpen(false);
                                                    setSearchTerm(''); // Clear search term after selection
                                                }}
                                                className="p-2"
                                            >
                                                <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}>{item}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            <TouchableOpacity onPress={handleGenderDropdown} className="border-b border-gray-300 ios:py-5 flex-row justify-between items-center">
                                <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }} className="pt-5 pb-2 text-black">{updatedUser.gender || 'Select Gender'}</Text>
                                {isGenderDropdownOpen ? <ArrowUp2 size="16" color="black" /> :<ArrowDown2 size="16" color="black" />}
                            </TouchableOpacity>
                            {isGenderDropdownOpen && (
                                <View className='border border-gray-400 w-1/2 rounded-md mt-2'>
                                    {genders.map(gender => (
                                        <TouchableOpacity key={gender} onPress={() => { setUpdatedUser({ ...updatedUser, gender }); setIsGenderDropdownOpen(false); }}>
                                            <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }} className="p-2">{gender}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            <View className="flex-row items-center justify-end">
                                <TouchableOpacity className="bg-primary py-3 rounded-full w-1/2 items-center mt-5" onPress={handleUpdate} >
                                    <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Bold' }} className="text-white py-1 font-bold">Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

export default ProfileScreen;
