import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/Login';
import Checklist from '../screens/Main/CheckList';
import RegisterScreen from '../screens/Auth/Register';
import Tabs from './Tabs';
import ThankYou from '../screens/Main/ThankYou';
import Splash from '../screens/Auth/Splash';
import ForgotPassword from '../screens/Auth/ForgotPassword';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="ThankYou" component={ThankYou}/>
                <Stack.Screen name="Checklist" component={Checklist} />
                <Stack.Screen name="Tabs" component={Tabs} options={{ gestureEnabled: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;