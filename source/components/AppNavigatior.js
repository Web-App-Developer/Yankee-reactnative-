import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screen/HomeScreen';
import SignInScreen from '../screen/SignInScreen';
import SignUpScreen from '../screen/SignUpScreen';
import WelcomeScreen from '../screen/WelcomeScreen';
import SignOut from '../screen/SignOutScreen';
import UploadScreen from '../screen/UploadScreen';
import GameScreen from '../screen/GameScreen';

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false}}>
            <Stack.Screen name = "Home" component = { HomeScreen } />
            <Stack.Screen name = "SignIn" component = { SignInScreen } />
            <Stack.Screen name = "SignUp" component = { SignUpScreen } />
            <Stack.Screen name = "Welcome" component = { WelcomeScreen } />
            <Stack.Screen name = "SignOut" component = { SignOut} />
            <Stack.Screen name = "Upload" component = { UploadScreen } />
            <Stack.Screen name = "Game" component = { GameScreen } />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}