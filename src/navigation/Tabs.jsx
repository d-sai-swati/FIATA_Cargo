import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import HomeScreen from '../screens/Main/Home';
import ProfileScreen from '../screens/Main/Profile';
import HistoryScreen from '../screens/Main/History';
import { Clock, DocumentText, Home, User } from 'iconsax-react-native';
import Checklist from '../screens/Main/CheckList';

const Tab = createBottomTabNavigator();
const Tabs = () => {
    return (
        <>
            <Tab.Navigator initialRouteName="Home" screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let IconComponent;

                    if (route.name === 'Home') {
                        IconComponent = Home;
                    } else if (route.name === 'Form') {
                        IconComponent = DocumentText;
                    } else if (route.name === 'History') {
                        IconComponent = Clock;
                    } else if (route.name === 'Profile') {
                        IconComponent = User;
                    }
                    return <IconComponent size={size} color={color} variant={focused ? 'Bold' : 'Outline'} />;
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'white',
                tabBarStyle: { backgroundColor: '#0092C8',  paddingBottom: 10, paddingTop: 10, height: 65 },
                tabBarActiveBackgroundColor: '#0092C8',
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            })}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Form" component={Checklist} />
                <Tab.Screen name="History" component={HistoryScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </>
    )
}

export default Tabs;