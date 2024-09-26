import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import Navigation from './src/navigation/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load custom fonts (without Ionicons)
    const [loaded, error] = useFonts({
        'Lato-Black': require('./assets/fonts/Lato_Black.ttf'),
        'Lato-Bold': require('./assets/fonts/Lato_Bold.ttf'),
        'Lato-Light': require('./assets/fonts/Lato_Light.ttf'),
        'Lato-Regular': require('./assets/fonts/Lato_Regular.ttf'),
        'Lato-Thin': require('./assets/fonts/Lato_Thin.ttf'),
        'Arial-Black': require('./assets/fonts/Arial_Black.ttf'),
        'Calibri-Bold': require('./assets/fonts/Calibri_Bold.ttf'),
        'Calibri-Light': require('./assets/fonts/Calibri_Light.ttf'),
        'Calibri-Regular': require('./assets/fonts/Calibri_Regular.ttf'),
        'Quiet-Bold': require('./assets/fonts/Quiet_Bold.ttf'),
        'Quiet-ExtraBold': require('./assets/fonts/Quiet_ExtraBold.ttf'),
        'Quiet-ExtraLight': require('./assets/fonts/Quiet_ExtraLight.ttf'),
        'Quiet-Light': require('./assets/fonts/Quiet_Light.ttf'),
        'Quiet-SemiBold': require('./assets/fonts/Quiet_SemiBolds.ttf'),
        'Quiet-Regular': require('./assets/fonts/Quiet_Regular.ttf'),
        'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    });

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                setIsAuthenticated(!!token);
            } catch (error) {
                console.error('Failed to fetch token:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (loaded || error) {
            SplashScreen.hideAsync();
        }

        checkToken();
    }, [loaded, error]);

    if (!loaded && !error) {
        return null; // Don't show anything until fonts are loaded
    }

    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <Navigation isAuthenticated={isAuthenticated} />
    );
}
