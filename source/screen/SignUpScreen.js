import React, { useEffect, useState, createRef } from 'react';
import { 
    View, 
    Text,
    StyleSheet,
    TextInput,
    Alert,
    Image,
    ActivityIndicator,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Keyboard } from 'react-native';
import auth from '@react-native-firebase/auth';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveFontSize,
    responsiveScreenFontSize
} from 'react-native-responsive-dimensions';

export default class SignUp extends React.Component {

    constructor() {
        super();

        this.state = {
            displayName: '',
            email: '',
            password: '',
            passwordagain: '',
            isLoading: false,
            isSignUp: true,
            isKeyboard: false,
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        console.log('Show');
        this.setState({isKeyboard: true});
    }

    _keyboardDidHide() {
        console.log("Hide");
        this.setState({isKeyboard: false});
    }

    updateInputValue = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    registerUser() {
        if(this.state.displayName === ''){
            Alert.alert('please Input Name');
        }else if(this.state.email === ''){
            Alert.alert('Please Input Email address!')
        }else if(this.state.password === ''){
            Alert.alert('Please Input Password');
        }else if(this.state.password.length < 6) {
            Alert.alert('Warning', 'Password should be more than 6 characters');
            this.setState({
                password: '',
                passwordagain: '',
            })
        }else if(this.state.password !== this.state.passwordagain){
            Alert.alert('Warning', 'Please try again with correct password');
            this.setState({
                passwordagain: '',
            })
        }else {
            this.setState({
                isLoading: true,
            })
            auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((res) => {
                console.log(this.state.displayName);
                if(res){
                    res.user.updateProfile({
                        displayName: this.state.displayName
                    }).then(() => {
                        console.log('success update but afraid')
                    }).catch((error) => {
                        console.log('error', error);
                    });
                    console.log('User registered successfully!');
                    this.setState({
                        isLoading: false,
                        displayName: '',
                        email: '',
                        password: '',
                        passwordagain: '',
                    })  
                }              
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    Alert.alert('Warning', 'That email address is already in use!')
                    console.log('That email address is already in use!');
                }
            
                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }            
                console.error(error);
                this.setState({
                    isLoading: false,
                    displayName: '',
                    email: '',
                    password: '',
                    passwordagain: '',
                })
            });     
        }   
    }

    render() {
        if(this.state.isLoading){
            return(
                <View style = {styles.preloader}>
                    <ActivityIndicator size = 'large' color = '#9E9E9E' />
                </View>
            )
        }
        return (
            <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', width: '100%'}}> 
                <View style={styles.topContainer}>
                    {!this.state.isKeyboard && <Image source={ require('../Assets/playstore.png')}
                        style={{width:100, height: 150, marginBottom: 0, paddingBottom: 0}}></Image>}
                    {!this.state.isKeyboard && <Image source={ require('../Assets/Logo.png')}
                        style={{ width:'60%', height: 150, resizeMode: 'contain', marginTop: -30, paddingTop: 0}}></Image>}
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        label={"Name"}
                        keyboardType="default"
                        style={styles.textInputStyle}
                        placeholder="Your Name"
                        placeholderTextColor='#60c182'
                        value = {this.state.displayName}
                        onChangeText={(val) => this.updateInputValue(val, 'displayName')}
                    />
                    <TextInput
                        label={"Email"}
                        //autoCapitalize={false}
                        keyboardType="email-address"
                        style={styles.textInputStyle}
                        placeholder="Email"
                        placeholderTextColor='#60c182'
                        value={this.state.email}
                        onChangeText={(val) => this.updateInputValue(val, 'email')}
                    />

                    <TextInput
                        label={"Password"}
                        secureTextEntry
                        //autoCapitalize={false}
                        style={styles.textInputStyle}
                        // selectionColor={blue}
                        placeholder="Password"
                        placeholderTextColor='#60c182'
                        value={this.state.password}
                        onChangeText={(val) => this.updateInputValue(val, 'password')}
                    />
                    <TextInput
                        label={"Password"}
                        secureTextEntry
                        //autoCapitalize={false}
                        style={styles.textInputStyle}
                        // selectionColor={blue}
                        placeholder="Password (again)"
                        placeholderTextColor='#60c182'
                        value={this.state.passwordagain}
                        onChangeText={(val) => this.updateInputValue(val, 'passwordagain')}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.commonButtonStyle}
                        activeOpacity={0.5}
                        onPress={ () => this.registerUser() }
                    >
                        <Text style={styles.commonbuttonTextStyle}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={{width: responsiveWidth(90)}}
                        onPress={() => this.props.navigation.navigate('SignIn')}>
                        <View>
                            <Text style={styles.commontextStyle}>Already have an account?<Text> </Text>
                                <Text 
                                    style={styles.boldText}
                                    activeOpacity={0.5}>
                                SIGN IN</Text>     
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    topContainer: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%',
    },
    inputContainer: {
        alignItems: 'center', 
        justifyContent: 'flex-start',
        width: '100%',
        marginBottom: responsiveHeight(3),
    },
    bottomContainer: {
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%',
        marginBottom: responsiveHeight(2),
    },
    textInputStyle: {
        color: '#60c182',
        width: responsiveWidth(90),
        borderBottomColor: '#199946',
        borderBottomWidth: 2,
        fontSize: responsiveHeight(2.5),
        fontFamily: 'Font_Awesome_5_Free_Regular_400',
        marginBottom: responsiveHeight(1.5),
    },
    commonButtonStyle: {
        alignItems: 'center',
        backgroundColor: '#60c182',
        height: responsiveHeight(7),
        borderRadius: responsiveHeight(3.5),
        width: responsiveWidth(90),
        marginBottom: responsiveHeight(1.5),
    },
    commonbuttonTextStyle: {
        color: '#fff',
        fontSize: responsiveFontSize(2),
        width: responsiveWidth(90),
        height: responsiveHeight(7),
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',       
    },
    commontextStyle: {
        color: '#60c182',
        width: '100%',
        textAlign: 'right',
        fontSize: responsiveFontSize(2),
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    },
    boldText: {
        fontWeight: 'bold',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
      },
});

