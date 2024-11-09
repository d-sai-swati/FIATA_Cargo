import React, { useLayoutEffect, useRef, useState } from 'react'
import { ScrollView, TextInput, Alert, Dimensions, Image, Text, TouchableOpacity, View, Platform, ActivityIndicator, KeyboardAvoidingView, StatusBar, Modal } from 'react-native'

import Swiper from 'react-native-swiper'
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react-native';
import { useTranslation } from 'react-i18next';
import Header from '../../../components/Header';
import { Hp, Wp } from '../../../utils/constants/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../../utils/axiosInstance';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as FileSystem from 'expo-file-system';
import NetInfo from '@react-native-community/netinfo';

const { width } = Dimensions.get('window');

const Checklist = ({ navigation }) => {
    const { t } = useTranslation();
    const questions = t('questions', { returnObjects: true });
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState(Array(questions.length).fill(''));
    const swiperRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('');
    const [containerNumber, setContainerNumber] = useState('');
    const [date, setDate] = useState('');
    const [packingAddress, setPackingAddress] = useState('');
    const [responsiblePerson, setResponsiblePerson] = useState('');
    const [isChecklist, setIsChecklist] = useState(false)
    const [errors, setErrors] = useState({});
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [showOfflineModal, setShowOfflineModal] = useState(false);

    const localImages = {
        question1: require('../../../../assets/images/que1.jpg'),
        question2: require('../../../../assets/images/que2.png'),
        question3: require('../../../../assets/images/que3.png'),
        question4: require('../../../../assets/images/que4-1.png'),
        question5: require('../../../../assets/images/que5.png'),
        question6: require('../../../../assets/images/que6.png'),
        question7: require('../../../../assets/images/que7.png'),
        question8: require('../../../../assets/images/que8.jpeg'),
        question9: require('../../../../assets/images/que9.png'),
        question10: require('../../../../assets/images/que10.png'),
        question11: require('../../../../assets/images/que11.png'),
        question12: require('../../../../assets/images/que12.jpg'),
        question13: require('../../../../assets/images/que13.jpg'),
        question14: require('../../../../assets/images/que14.webp'),
        question15: require('../../../../assets/images/que15.jpg'),
        question16: require('../../../../assets/images/que16.jpg'),
        question17: require('../../../../assets/images/que17.webp'),
        question18: require('../../../../assets/images/que18.webp'),
        question19: require('../../../../assets/images/que19.png'),
        question20: require('../../../../assets/images/que20.webp'),
        question21: require('../../../../assets/images/que21.jpg'),
        question22: require('../../../../assets/images/que22.jpg'),
        question23: require('../../../../assets/images/que23.jpg'),
        question24: require('../../../../assets/images/que24.jpg'),
        question25: require('../../../../assets/images/que25.jpeg'),
        question26: require('../../../../assets/images/que26.png'),
        question27: require('../../../../assets/images/que13.jpg'),
        question28: require('../../../../assets/images/que28.jpg'),
        question29: require('../../../../assets/images/que29.jpeg'),
        question30: require('../../../../assets/images/que30.png'),
        question31: require('../../../../assets/images/que31.webp'),
        question32: require('../../../../assets/images/que32.jpg'),
        question33: require('../../../../assets/images/que33.jpeg'),
        question34: require('../../../../assets/images/que34.webp')
    }
    const goBackToContainerDetails = () => {
        setIsChecklist(false);
    };
    const resetForm = () => {
        setLanguage('en');
        setContainerNumber('');
        setDate('');
        setPackingAddress('');
        setResponsiblePerson('');
        setAnswers(Array(questions.length).fill(''));
        setIsChecklist(false);
        setCurrentIndex(0);
    };
    useFocusEffect(
        React.useCallback(() => {
            resetForm();
            setErrors({});
            StatusBar.setBarStyle('light-content', true);
            StatusBar.setBackgroundColor('transparent');

            // Optional: return a cleanup function to reset StatusBar when leaving the screen
            return () => {
                StatusBar.setBarStyle('dark-content', true);
            };
        }, [])
    );

    const handleProceed = async () => {

        let newErrors = {};

        // Validate each field and add error messages if necessary
        if (!containerNumber) newErrors.containerNumber = 'Container number is required';
        if (!date) newErrors.date = 'Date is required';
        if (!packingAddress) newErrors.packingAddress = 'Packing address is required';
        if (!responsiblePerson) newErrors.responsiblePerson = 'Responsible person is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);
        const shipmentData = {
            language: language,
            container_number: containerNumber,
            date: date,
            packing_address: packingAddress,
            responsible_person: responsiblePerson,
        };
        const jsonValue = JSON.stringify(shipmentData);
        await AsyncStorage.setItem('shipmentData', jsonValue);

        // setIsChecklist(!isChecklist);
        setTimeout(() => {
            setIsChecklist(!isChecklist);
            setLoading(false); // Stop loading after navigation
        }, 1000);
    };

    useFocusEffect(() => {
        const fetchSelectedLanguage = async () => {
            const storedLanguage = await AsyncStorage.getItem('language');
            if (storedLanguage) {
                setLanguage(storedLanguage);
            }
        };
        fetchSelectedLanguage();
    });

    const handleInputChange = (text, index) => {
        const newAnswers = [...answers];
        newAnswers[index] = text;
        setAnswers(newAnswers);
        console.log("=========================", newAnswers);
        if (index < questions.length - 1) {
            swiperRef.current.scrollBy(1);
        }
    };
    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Check network connectivity
            const state = await NetInfo.fetch();
            const token = await AsyncStorage.getItem('token');
            const shipmentData = await AsyncStorage.getItem('shipmentData');
            const parsedShipmentData = JSON.parse(shipmentData);

            const payload = {
                ...parsedShipmentData,
                options: answers,
            };

            if (state.isConnected) {
                // If online, submit form to the server
                const response = await axiosInstance.post('/container-form', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'arraybuffer',
                });

                if (response) {
                    console.log('Form submission successful:', response.data);
                    // Convert ArrayBuffer to Base64
                    const base64Pdf = arrayBufferToBase64(response.data);

                    // Save the received PDF file locally
                    const pdfUri = `${FileSystem.documentDirectory}container_form.pdf`;
                    await FileSystem.writeAsStringAsync(pdfUri, base64Pdf, { encoding: FileSystem.EncodingType.Base64 });

                    // Store PDF URI in AsyncStorage to be accessed later in ThankYou screen
                    await AsyncStorage.setItem('pdfUri', pdfUri);

                    // Clear shipment data and language data after submission
                    await AsyncStorage.removeItem('shipmentData');
                    await AsyncStorage.removeItem('language');

                    navigation.navigate('ThankYou');
                } else {
                    console.error('Unexpected response:', response);
                }
            } else {
                // If offline, store data in AsyncStorage with "pending" status
                const draftData = {
                    ...payload,
                    status: 'pending',
                };

                // await AsyncStorage.setItem('draftForm', JSON.stringify(draftData));
                const existingData = JSON.parse(await AsyncStorage.getItem('draftForm')) || [];
                await AsyncStorage.setItem('draftForm', JSON.stringify([...existingData, draftData]));

                // Alert.alert('Submission Pending', 'Your form has been saved and will be submitted once you are online.');
                // navigation.navigate('DraftScreen', { reload: true });
                setShowOfflineModal(true);
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false); // Stop loading after process is completed
        }
    };

    const currentTitle = () => {
        if (currentIndex + 1 <= 7) return t('sectionTitles.packingArea');
        if (currentIndex + 1 <= 12) return t('sectionTitles.containerCondition');
        if (currentIndex + 1 <= 19) return t('sectionTitles.packingContainer');
        if (currentIndex + 1 <= 23) return t('sectionTitles.dangerousGoods');
        if (currentIndex + 1 <= 27) return t('sectionTitles.afterPacking');
        if (currentIndex + 1 <= 29) return t('sectionTitles.closingContainer');
        return t('sectionTitles.dispatchingContainer')
    };
    const handleDateConfirm = (selectedDate) => {
        const formattedDate = selectedDate.toLocaleDateString('en-GB');
        setDate(formattedDate);
        setDatePickerVisible(false);
    };

    const handleDatePickerCancel = () => {
        setDatePickerVisible(false);
    };
    return (
        <>
            {/* <StatusBar style="light" translucent backgroundColor="transparent" /> */}
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent={true}
            />
            {!isChecklist ?
                <View className="flex-1 bg-white">
                    <Header title={t('containerHeading')} />
                    {/* <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    > */}
                    <ScrollView className="ios:pt-10">
                        <View className="p-4">
                            <Text style={[{ fontSize: Hp(2.2), fontFamily: 'Lato-Bold', textAlign: 'justify' }, Platform.select({ ios: { fontSize: Hp(2) } })]} className="text-center pb-5">{t('containerTitle')}</Text>
                            <Text style={[{ fontSize: Hp(2), fontFamily: 'Lato-Regular', textAlign: 'justify' }, Platform.select({ ios: { fontSize: Hp(1.8) } })]} className="text-center">{t('containerDescription')}</Text>
                        </View>
                        <View className="p-4">
                            <TextInput
                                style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular', }}
                                className="border-b border-gray-300 p-3 rounded-lg mb-1 hidden"
                                placeholder="Language"
                                value={language}
                                editable={false}
                            />
                            <TextInput
                                style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular', }}
                                className="border-b border-gray-300 p-3 ios:py-5 rounded-lg mb-1"
                                placeholder={t('container_number')}
                                value={containerNumber}
                                onChangeText={setContainerNumber}
                                onFocus={() => {
                                    setErrors(prevErrors => ({ ...prevErrors, containerNumber: null }));
                                }}
                            />
                            {errors.containerNumber && <Text className="text-red-500 ml-3" style={{ fontSize: Hp(1.5), fontFamily: 'Lato-Regular' }}>{errors.containerNumber}</Text>}
                            <TouchableOpacity
                                onPress={() => {
                                    setDatePickerVisible(true),
                                        setErrors(prevErrors => ({ ...prevErrors, date: null }))
                                }
                                }
                                className="border-b border-gray-300 p-3 py-4 ios:py-5 rounded-lg mb-1"
                            >
                                <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }} className={`${date ? 'text-black' : 'text-gray-400'}`}>
                                    {date ? date : t('select_date')}
                                </Text>
                            </TouchableOpacity>
                            {errors.date && <Text className="text-red-500 ml-3" style={{ fontSize: Hp(1.5), fontFamily: 'Lato-Regular' }}>{errors.date}</Text>}

                            <TextInput
                                style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}
                                className="border-b border-gray-300 p-3 ios:py-5 rounded-lg mb-1"
                                placeholder={t('packing_address')}
                                value={packingAddress}
                                onChangeText={setPackingAddress}
                                onFocus={() => {
                                    setErrors(prevErrors => ({ ...prevErrors, packingAddress: null }));
                                }}
                            />
                            {errors.packingAddress && <Text className="text-red-500 ml-3" style={{ fontSize: Hp(1.5), fontFamily: 'Lato-Regular' }}>{errors.packingAddress}</Text>}

                            <TextInput
                                style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Regular' }}
                                className="border-b border-gray-300 p-3 ios:py-5 rounded-lg mb-1"
                                placeholder={t('responsible_person')}
                                value={responsiblePerson}
                                onChangeText={setResponsiblePerson}
                                onFocus={() => {
                                    setErrors(prevErrors => ({ ...prevErrors, responsiblePerson: null }));
                                }}
                            />
                            {errors.responsiblePerson && <Text className="text-red-500 ml-3" style={{ color: 'red', fontSize: Hp(1.5), fontFamily: 'Lato-Regular' }}>{errors.responsiblePerson}</Text>}

                            {/* <TouchableOpacity className="bg-primary py-3 rounded-full items-center mt-6" onPress={handleProceed}>
                                <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Bold' }} className="text-white py-1">Proceed</Text>
                            </TouchableOpacity> */}

                            <TouchableOpacity
                                className="bg-primary py-3 rounded-full items-center mt-6"
                                onPress={handleProceed}
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text style={{ fontSize: 16, fontFamily: 'Lato-Bold' }} className="text-white py-1">
                                        Proceed
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    {/* </KeyboardAvoidingView> */}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date" // Set mode to date only
                        onConfirm={handleDateConfirm}
                        onCancel={handleDatePickerCancel}
                        minimumDate={new Date()}
                    />
                </View> :
                <View className="flex-1 bg-white">
                    <Header title={currentTitle()} onBackPress={goBackToContainerDetails} />
                    <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular', textAlign: 'center' }} className="text-primary my-5">
                        {`${currentIndex + 1} out of ${questions.length}`}
                    </Text>
                    <Swiper
                        className="rounded-xl"
                        showsPagination={false}
                        loop={false}
                        showsButtons={false}
                        ref={swiperRef}
                        onIndexChanged={index => setCurrentIndex(index)}
                    >
                        {questions.map((question, index) => (
                            <View key={index} style={{ width }}>
                                <Text style={{ fontSize: Hp(2.2), fontFamily: 'Lato-Bold', textAlign: 'justify' }} className="p-4">{`${index + 1}. ${question.question}`}</Text>
                                <View className="flex-row justify-around p-4">
                                    {question.options.map((option, i) => (
                                        <TouchableOpacity key={i} className="flex-row items-center mr-4" onPress={() => handleInputChange(option, index)}>
                                            <Image source={answers[index] === option ? require('../../../../assets/icons/Checkbox.png') : require('../../../../assets/icons/UnCheckbox.png')} className="w-5 h-5" />
                                            <Text style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular', textAlign: 'justify' }} className="ml-2">{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                {question.image && (
                                    <Image source={localImages[question.image]} style={{ width: Wp(90), height: Hp(40), resizeMode: 'contain', alignSelf: 'center' }} />
                                )}
                            </View>
                        ))}
                    </Swiper>
                    <View className="flex-row justify-between p-4">
                        <TouchableOpacity
                            className={`bg-primary p-3 rounded-lg ${currentIndex === 0 ? 'opacity-50' : ''}`}
                            onPress={() => swiperRef.current.scrollBy(-1)}
                            disabled={currentIndex === 0}
                        >
                            <ArrowLeft2 size="24" color="white" />
                        </TouchableOpacity>

                        {currentIndex === questions.length - 1 ? (
                            <TouchableOpacity
                                className={`bg-primary p-3 rounded-lg flex-row justify-end items-center ${loading ? 'opacity-50' : ''}`}
                                onPress={!loading ? handleSubmit : null}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={{ fontSize: Hp(1.8), fontFamily: 'Lato-Bold' }} className="text-white">{t('submit')}</Text>
                                )}
                            </TouchableOpacity>

                        ) : (

                            <TouchableOpacity
                                className={`bg-primary p-3 rounded-lg ${currentIndex === questions.length - 1 ? 'opacity-50' : ''}`}
                                onPress={() => swiperRef.current.scrollBy(1)}
                                disabled={currentIndex === questions.length - 1}
                            >
                                <ArrowRight2 size="24" color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Modal
                        visible={showOfflineModal}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowOfflineModal(false)}
                    >
                        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View className="bg-white p-5 rounded-xl shadow-lg w-11/12">
                                <Text className="mb-4 text-center border-b pb-2 border-gray-300" style={{ fontSize: Hp(2.2), fontFamily: 'Calibri-Bold' }}>Submission Pending</Text>
                                <Text className="text-center mb-4" style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }}>Your form has been saved and will be submitted once you are online.</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowOfflineModal(false); // Hide the modal
                                        navigation.navigate('Draft'); // Navigate to Draft screen
                                    }}
                                    className="flex-row justify-center"
                                >
                                    <View className="py-2 px-5 rounded-full bg-[#0092C8]">
                                        <Text className="text-white text-center" style={{ fontSize: Hp(2), fontFamily: 'Lato-Regular' }}>OK</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            }
        </>

    )
}

export default Checklist;
