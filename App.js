import React, { useState, useEffect } from 'react';
import {Text} from 'react-native';
import AuthNavigator from './source/navigation/AuthNavigator';
export default class App extends React.Component {
    render() {
        return (
            <AuthNavigator />
        );
    }
}