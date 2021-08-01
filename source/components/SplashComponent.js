import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

export default class Splash extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator color='blue' size='large' />
            </View>
        );
    }
}

const styles=StyleSheet.create({
    container: {
        flex: 1,      
        justifyContent: 'center',
        alignItems: 'center',
    },
})