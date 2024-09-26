import { useEffect, useState } from 'react';
import Navigation from './src/navigation/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
// import * as Font from 'expo-font';

SplashScreen.preventAutoHideAsync();

// const loadFonts = async () => {
//   await Font.loadAsync({
// 'Lato': require('./src/assets/fonts/Lato.ttf'),
// 'Arial': require('./src/assets/fonts/Arial.ttf'),
// 'Calibri': require('./src/assets/fonts/Calibri.ttf'),
// 'Quiet': require('./src/assets/fonts/Quiet.otf'),
//   });
// };

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [fontsLoaded, setFontsLoaded] = useState(false);

  const [loaded, error] = useFonts({
    'Lato': require('./src/assets/fonts/Lato.ttf'),
    'Arial': require('./src/assets/fonts/Arial.ttf'),
    'Calibri': require('./src/assets/fonts/Calibri.ttf'),
    'Quiet': require('./src/assets/fonts/Quiet.otf'),
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
    return null;
  }

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <Navigation isAuthenticated={isAuthenticated} />
  );
}
