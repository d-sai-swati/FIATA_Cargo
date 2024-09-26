import React from 'react';
import { View, Text, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { Hp } from '../../utils/constants/themes';

const banners = [
    {
        image: require('../../assets/images/Banner-1.png'),
        title: "DELIVERING VALUES TO YOUR BUSINESS",
        subtitle: "SOLUTIONS TO MANAGE YOUR BUSINESS"
    },
    {
        image: require('../../assets/images/Banner-2.png'),
        title: "DELIVERING VALUES TO YOUR BUSINESS",
        subtitle: "SOLUTIONS TO MANAGE YOUR BUSINESS"
    },
    {
        image: require('../../assets/images/Banner-1.png'),
        title: "DELIVERING VALUES TO YOUR BUSINESS",
        subtitle: "SOLUTIONS TO MANAGE YOUR BUSINESS"
    },
    {
        image: require('../../assets/images/Banner-2.png'),
        title: "DELIVERING VALUES TO YOUR BUSINESS",
        subtitle: "SOLUTIONS TO MANAGE YOUR BUSINESS"
    }
];

const BannerSwiper = () => {
    return (
        <View className="h-52 rounded-xl overflow-hidden mx-5">
            <Swiper
                autoplay
                autoplayTimeout={3}
                showsPagination={false}
                loop
            >
                {banners.map((banner, index) => (
                    <View key={index} className="relative h-full w-full justify-center items-center">
                        <Image
                            source={banner.image}
                            className="h-full w-full"
                            resizeMode="cover"
                        />
                        <View className="absolute bottom-4 left-5">
                            <Text style={{ fontSize: Hp(1.8) }} className="font-quiet text-white font-bold">
                                {banner.title}
                            </Text>
                            <Text style={{ fontSize: Hp(1.5) }} className="font-quiet text-white pt-2">
                                {banner.subtitle}
                            </Text>
                        </View>
                    </View>
                ))}
            </Swiper>
        </View>
    );
};

export default BannerSwiper;

