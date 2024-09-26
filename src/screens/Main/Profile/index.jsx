import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput, Button, Alert } from 'react-native';
import Header from '../../../components/Header';
import { Edit2, LogoutCurve, ProfileDelete, Verify } from 'iconsax-react-native';
import { Hp } from '../../../utils/constants/themes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from 'react-native-vector-icons';
import axiosInstance from '../../../utils/axiosInstance';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [user, setUser] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    mobile: '',
    email: '',
    gender: ''
  });

  const openSettings = () => {
    setSidebarVisible(true);
  };

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

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      // console.log("updated user",updatedUser);
      const payload = {
        name: updatedUser.name,
        mobile: updatedUser.mobile,
        email: updatedUser.email,
        gender: updatedUser.gender
      }
      const response = await axiosInstance.post(`profile/${user.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("update response", response.data)

      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);

      setModalVisible(false);

    } catch (error) {
      console.error('Update failed:', error);
    }
  };


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      // await AsyncStorage.removeItem('language')

      navigation.navigate('Login');
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Home' }],
      // })
    } catch (error) {
      console.error('Failed to log out:', error);
      Alert.alert('Logout Error', 'There was an error logging out. Please try again.');
    }
  };
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
        setDeleteModalVisible(false);
        Alert.alert(response.data.message);
      } else {
        Alert.alert('Error', 'There was an issue deleting your account.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account.');
    }
  };

  return (
    <View className="bg-white flex-1">
      <Header title="Profile" isRightIcon={true} onPress={openSettings} />
      <ScrollView>
        <View className="bg-bgBlue mx-5 mt-5 p-5 rounded-2xl shadow-lg items-center relative mt-[35%]">


          <View className="w-full">
            <View className="flex-row justify-between items-center">
              <Text style={{ fontSize: Hp(2.5) }} className="text-xl font-bold text-center text-black mr-4">
                {user.name}
              </Text>
              <TouchableOpacity className="flex-row items-center" onPress={() => setModalVisible(true)}>
                <Edit2 size={Hp(2.5)} color="#0291C9" variant="Bold" />
                <Text className="text-primary font-semibold ml-2">Edit</Text>
              </TouchableOpacity>
            </View>

            <View className="border-t border-primary my-3 w-full" />

            <Text style={{ fontSize: Hp(2.2) }} className="text-primary font-semibold">Personal Info</Text>
            <View className="mt-2">
              <Text style={{ fontSize: Hp(1.8) }} className="text-gray-500 mt-4">Mobile Phone</Text>
              <Text style={{ fontSize: Hp(2) }} className="text-black mt-2">{user.mobile}</Text>

              <Text style={{ fontSize: Hp(1.8) }} className="text-gray-500 mt-4">Email</Text>
              <Text style={{ fontSize: Hp(2) }} className="text-black mt-2">{user.email}</Text>

              <Text style={{ fontSize: Hp(1.8) }} className="text-gray-500 mt-4">Gender</Text>
              <Text style={{ fontSize: Hp(2) }} className="text-black mt-2">{user.gender}</Text>

            </View>
          </View>
        </View>
      </ScrollView>

      {/* ============== sidebar modal ===================== */}
      <Modal
        visible={sidebarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View className="flex-1 justify-end items-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="w-64 h-full bg-white p-5 shadow-lg">
            <View className="flex-row items-center justify-between">
              <Text className="font-bold mb-2" style={{ fontSize: Hp(2.2) }}>Settings</Text>
              <Ionicons name="close" size={24} color="black" onPress={() => setSidebarVisible(false)} />
            </View>

            <TouchableOpacity className="mt-5">
              <Text className="text-black font-semibold border-b border-gray-300 pb-5">{t('About Us')}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="mt-5">
              <Text className="text-black font-semibold border-b border-gray-300 pb-5">{t('Contact Us')}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="mt-5">
              <Text className="text-black font-semibold border-b border-gray-300 pb-5">{t('Terms and Conditions')}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="mt-5">
              <Text className="text-black font-semibold border-b border-gray-300 pb-5">{t('Privacy Policy')}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center mt-5 border-b border-gray-300 pb-5" onPress={() => setLogoutModal(true)}>
              <Text className="text-red-500 font-semibold mr-2">{t('Log Out')}</Text>
              <LogoutCurve
                size={Hp(2.2)}
                color="red"
              />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center my-5" onPress={() => setDeleteModalVisible(true)}>
              <Text className="text-red-500 font-semibold mr-2">{t('Delete Account')}</Text>
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
            <Text className="font-bold text-center mb-4" style={{ fontSize: Hp(2.2) }}>Log Out</Text>
            <Text className="text-center mb-4">Are you sure you want to log out?</Text>

            <View className="flex-row justify-around">
              <TouchableOpacity className="bg-gray-300 py-2 px-5 rounded-full" onPress={() => setLogoutModal(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-red-500 py-2 px-5 rounded-full" onPress={handleLogout}>
                <Text className="text-white">Log Out</Text>
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
            <Text className="font-bold text-center mb-4" style={{ fontSize: Hp(2.2) }}>Delete Account</Text>
            <Text className="text-center mb-4">Are you sure you want to delete your account? This action cannot be undone.</Text>

            <View className="flex-row justify-around">
              <TouchableOpacity className="bg-gray-300 py-2 px-5 rounded-full" onPress={() => setDeleteModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-red-500 py-2 px-5 rounded-full" onPress={handleDeleteAccount}>
                <Text className="text-white">Delete</Text>
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
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="bg-white p-5 rounded-xl shadow-lg w-11/12">
            <View className="flex-row items-center justify-between">
              <Text className="font-bold text-center" style={{ fontSize: Hp(2.2) }}>Edit Profile</Text>
              <Ionicons name="close" size={24} color="black" onPress={() => setModalVisible(false)} />
            </View>

            {/* Editable fields */}
            <TextInput
              value={updatedUser.name}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, name: text })}
              placeholder="Name"
              className="border-b border-gray-300 pt-5 pb-2 text-black"
            />

            <TextInput
              value={updatedUser.mobile}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, mobile: text })}
              placeholder="Mobile Phone"
              className="border-b border-gray-300 pt-5 pb-2 text-black"
              keyboardType="phone-pad"
            />
            <TextInput
              value={updatedUser.email}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, email: text })}
              placeholder="Email"
              className="border-b border-gray-300 pt-5 pb-2 text-black"
              keyboardType="email-address"
            />
            <TextInput
              value={updatedUser.gender}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, gender: text })}
              placeholder="Gender"
              className="border-b border-gray-300 pt-5 pb-2 text-black"
            />
            <View className="flex-row items-center justify-end">
              <TouchableOpacity className="bg-primary py-3 rounded-full w-1/2 items-center mt-5" onPress={handleUpdate} >
                <Text style={{ fontSize: Hp(1.8) }} className="text-white py-1 font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;