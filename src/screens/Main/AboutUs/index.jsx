import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { Text, View } from 'react-native'

const AboutUs = () => {
    return (
        <View>
            <StatusBar style="light" translucent backgroundColor="transparent" />
            <Text>About Us</Text>
        </View>
    )
}

export default AboutUs;