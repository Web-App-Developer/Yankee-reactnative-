import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screen/WelcomeScreen';
import SignOutScreen from '../screen/SignOutScreen';
import UploadScreen from '../screen/UploadScreen';
import GameScreen from '../screen/GameScreen';
import HomeScreen from '../screen/HomeScreen';
import SignInScreen from '../screen/SignInScreen';

const Stack = createStackNavigator();

export default function SignInStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none" initialRouteName="Welcome">
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Upload" component={UploadScreen} />
                <Stack.Screen name="Game" component={GameScreen} />
                <Stack.Screen name="SignOut" component={SignOutScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="SignIn" component={SignInScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

