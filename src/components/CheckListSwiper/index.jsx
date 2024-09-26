import React, { useRef, useState } from 'react'
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native'

import Swiper from 'react-native-swiper'
import Header from '../Header'
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react-native';
import { Hp } from '../../utils/constants/themes';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const ChecklistSwiper = ({ navigation }) => {

    
    const { t } = useTranslation();
    const questions = t('questions', { returnObjects: true });
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState(Array(questions.length).fill(''));
    const swiperRef = useRef(null);
    const handleInputChange = (text, index) => {
        const newAnswers = [...answers];
        newAnswers[index] = text;
        setAnswers(newAnswers);
    };
    const handleSubmit = () => {
        navigation.navigate('ThankYou');
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
    return (
        <View className="flex-1 bg-white">
            <Header title={currentTitle()} />
            <Text className="text-sm text-center font-semibold text-primary my-5">
                {`${currentIndex + 1} out of ${questions.length}`}
            </Text>
            <Swiper
                className="bg-[#E9F3FF] rounded-xl"
                showsPagination={false}
                loop={false}
                showsButtons={false}
                ref={swiperRef}
                onIndexChanged={index => setCurrentIndex(index)}
            >
                {questions.map((question, index) => (
                    <View key={index} style={{ width }}>
                        <Text className="text-base font-semibold p-4">{`${index + 1}. ${question.question}`}</Text>
                        <View className="flex-row justify-around p-4">
                            {question.options.map((option, i) => (
                                <View key={i} className="flex-row items-center mr-4">
                                    <TouchableOpacity onPress={() => handleInputChange(option, index)} className="mr-2">
                                        <Image source={answers[index] === option ? require('../../assets/icons/Checkbox.png') : require('../../assets/icons/UnCheckbox.png')} className="w-4 h-4" />
                                    </TouchableOpacity>
                                    <Text>{option}</Text>
                                </View>
                            ))}
                        </View>
                        {question.image && (
                            <Image source={question.image} style={{ width: "100%", height: Hp(40), resizeMode: 'contain' }} />
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
                        className="bg-primary p-3 rounded-lg flex-row justify-end items-center"
                        onPress={handleSubmit}
                    >
                        <Text className="text-white">{t('submit')}</Text>
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
        </View>
    )
}

export default ChecklistSwiper;