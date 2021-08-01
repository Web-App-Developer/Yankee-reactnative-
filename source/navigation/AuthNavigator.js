import React, { useState, useEffect, createContext } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import SignInStack from './SignInStack';
import SignOutStack from './SignOutStack';

// import AppNavigator from './AppNavigatior';
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
// import HomeScreen from '../screen/HomeScreen';
// import SignInScreen from '../screen/SignInScreen';
// import SignUpScreen from '../screen/SignUpScreen';
// import WelcomeScreen from '../screen/WelcomeScreen';
// import SignOut from '../screen/SignOutScreen';
// import UploadScreen from '../screen/UploadScreen';
// import GameScreen from '../screen/GameScreen';

// const Stack = createStackNavigator();

export const AuthContext = createContext(null);

export default function UserLoginApp() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return user ? (
    <AuthContext.Provider value={user}>
      <SignInStack />
    </AuthContext.Provider>
  ) : (
    <SignOutStack />
  )
}

// export default function UserLoginApp () {
//   return (
//     <Text>UserloginApp</Text>
//   );  
// }