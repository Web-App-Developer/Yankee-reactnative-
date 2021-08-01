import React, { Component } from 'react';
import { Image, StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import {db} from '../firebase/config';
import firebase from 'firebase';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveFontSize,
    responsiveScreenFontSize
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

export default function SignOut() {

    const navigation = useNavigation();

    function getnavigation () {
        navigation.navigate('Game');
    }

    const signOut = () => {
        const user = auth().currentUser;
        if(user !== null) {
            // const name = user.displayName;
            // db.ref(name).once('value', (snapshot) => {
            //     if(snapshot.val()){
            //         gameCode = snapshot.val()['gameCode'];  
            //     }                              
            // }).then(() => {
            //     if(gameCode){}
                    // db.ref(gameCode + '/' + name)
                    //     .remove()
                    //     .then(() =>{
                    //         console.log(name + 'deleted successfully from' + gameCode);
                    //     }).catch((error) => {
                    //         console.log('error', error);
                    //     });
                    // db.ref(name)
                    //     .remove()
                    //     .then(() =>{
                    //         console.log(name + 'deleted successfully from firebase');
                    //     }).catch((error) => {
                    //         console.log('error', error);
                    //     });
            //         // firebase.storage().ref(deletename)
            //         //     .delete()
            //         //     .then(() => {
            //         //         console.log(name +'\'s images deleted successfully');
            //         //     })
            //         //     .catch((error) => {
            //         //         console.log('error', error);
            //         //     })
            // }).catch((error) => {
            //     console.log('error', error);
            // });            
            auth()
            .signOut().then(() => {
                // this.props.navigation.navigate('Home')    
            })
            .catch(error => this.setState({ errorMessage: error.message}))
        }       
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => getnavigation()} 
                    style={styles.backarrowimageContainer}>
                    <Image source={ require('../Assets/backarrow.png')} style ={styles.backarrowimage} />
                </TouchableOpacity>
                <View style={styles.logoheaderimageContainer}>
                    <Image source={ require('../Assets/Logowithoutdescription.png')} style = {styles.logoheaderimage}/>
                </View>
            </View>
            <LinearGradient 
                colors={['#d8d8d8', '#fff']}
                style={styles.linearGradient}>
            </LinearGradient>
            <View style={styles.topContainer}>
                <Image source={ require('../Assets/playstore.png')}
                    style={styles.playstoreimage}></Image>
                <Image source={ require('../Assets/Logowithoutdescription.png')}
                    style={styles.logoimage}></Image>
            </View>
            <View style={styles.bottomContainer}>                
                <TouchableOpacity
                    style={styles.commonButtonStyle}
                    activeOpacity={0.5}
                    onPress={()=> signOut()}>
                    <Text style={styles.buttonTextStyle}>
                        Sign Out
                    </Text>
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text style={styles.commontextStyle}>Copyright 2020 MoyerSoftware LLC</Text>
                    <Text style={styles.commontextStyle}>www.MoyerSoftware.com</Text>
                    <Text style={styles.commontextStyle}>version 1.0.00</Text>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    headerContainer: {
        // flex: 1, 
        flexDirection: 'row',
        width: responsiveWidth(100),
        height: responsiveHeight(8),
        justifyContent: 'flex-start',
    },
    backarrowimageContainer: {
        width: responsiveWidth(25), 
        height: responsiveHeight(8),
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: responsiveWidth(5),
        borderRadius: 5,       
    },
    backarrowimage: {
        height: responsiveHeight(3),
        width: responsiveHeight(3),
        resizeMode: 'contain',
    },
    logoheaderimageContainer: {
        width: responsiveWidth(70), 
        height: responsiveHeight(8),
        resizeMode: 'contain',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // borderColor: '#000',
        // borderWidth: 1,  
    },
    logoheaderimage: {
        width: responsiveWidth(40),
        height: responsiveHeight(8),
        resizeMode: 'contain',
    },
    topContainer: {
        alignItems: 'center', 
        justifyContent: 'center', 
        height: responsiveHeight(55),
    },
    playstoreimage: {
        width: responsiveWidth(30), 
        height: responsiveHeight(20), 
    },
    logoimage: {
        width: responsiveWidth(80),
        height: 150,
        marginTop: -responsiveHeight(4),
        resizeMode: 'contain',
    },
    bottomContainer: {
        width: responsiveWidth(100),
        height: responsiveHeight(33),
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: responsiveHeight(1.7),
    },
    commonButtonStyle: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#60c182',
        height: responsiveHeight(7),
        borderRadius: responsiveHeight(3.5),
        width: responsiveWidth(90),
    }, 
    buttonTextStyle: {
        color: '#60c182',
        fontSize: responsiveFontSize(2),
        width: responsiveWidth(90),
        height: responsiveHeight(7),
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',   
    },
    textContainer: {
        alignItems: 'center',
        alignContent: 'center',
        marginTop: responsiveHeight(2),
    },
    commontextStyle: {
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
        fontSize: responsiveFontSize(1.6),
        width: responsiveWidth(100),
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
    },
    linearGradient: {
        // flex: 1,
        width: responsiveWidth(100),
        height: responsiveHeight(1),
      },
});