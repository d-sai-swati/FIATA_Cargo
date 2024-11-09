import { useCallback, useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, Text, LogBox, Alert, ScrollView, RefreshControl } from 'react-native';
import Navigation from './src/navigation/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import * as Updates from 'expo-updates';
import NetInfo from '@react-native-community/netinfo';

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isConnected, setIsConnected] = useState(true);
    const prevIsConnected = useRef(isConnected);
    const [refreshing, setRefreshing] = useState(false);

    console.warn = () => {};
    
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            // Attempt to reload the app
            await Updates.reloadAsync();
        } catch (error) {
            console.error("Failed to reload app:", error);
            Alert.alert("Error", "Failed to reload the app.");
        } finally {
            setRefreshing(false);
        }
    }, []);
    // const onRefresh = useCallback(() => {
    //     setRefreshing(true);

    //     // Here, you could reload any data or refresh the state
    //     setTimeout(() => {
    //         setRefreshing(false);
    //         console.log("Screen content refreshed!");
    //     }, 2000); // Adjust timeout as needed
    // }, []);

    // =========== Internet Connection ===========
    // useEffect(() => {
    //     const unsubscribe = NetInfo.addEventListener((state) => {
    //         if (!state.isConnected) {
    //             setIsConnected(false);
    //         } else {
    //             setIsConnected(true);
    //             console.log("Connected to the xxxxxxxxxxxrinternet");
    //         }
    //     });

    //     return () => unsubscribe(); 
    // }, []);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected !== prevIsConnected.current) { // Check if connection status has changed
                setIsConnected(state.isConnected);
                prevIsConnected.current = state.isConnected; // Update previous connection status

                if (state.isConnected) {
                    console.log("Connected to the internet");
                } else {
                    console.log("Disconnected from the internet");
                }
            }
        });

        return () => unsubscribe(); // Cleanup listener
    }, []);
    // Load custom fonts (without Ionicons)
    const [loaded, error] = useFonts({
        'Arial-Black': require('./assets/fonts/Arial_Black.ttf'),
        'Lato-Black': require('./assets/fonts/Lato_Black.ttf'),
        'Lato-Bold': require('./assets/fonts/Lato_Bold.ttf'),
        'Lato-Light': require('./assets/fonts/Lato_Light.ttf'),
        'Lato-Regular': require('./assets/fonts/Lato_Regular.ttf'),
        'Lato-Thin': require('./assets/fonts/Lato_Thin.ttf'),
        'Arial-Black': require('./assets/fonts/Arial_Black.ttf'),
        'Calibri-Italic': require('./assets/fonts/Calibri_Italic.ttf'),
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
        // LogBox.ignoreLogs(['Warning: ...']);
        checkToken();
    }, [loaded, error]);

    LogBox.ignoreAllLogs()
    if (!loaded && !error) {
        return null; // Don't show anything until fonts are loaded
    }

    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        // <Navigation isAuthenticated={isAuthenticated} />
        <ScrollView
            contentContainerStyle={{ flex: 1 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Navigation isAuthenticated={isAuthenticated} />
        </ScrollView>
    );
}