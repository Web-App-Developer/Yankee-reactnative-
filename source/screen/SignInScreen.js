import React, {useEffect, useState} from 'react';
import {
    View, 
    Text,
    StyleSheet,
    TextInput,
    Alert,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    TouchableWithoutFeedback,
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
import SplashComponent from '../components/SplashComponent';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isValid, setValid] = useState(true);
    const [isLoading, setisLoading] = useState(false);
    const [isKeyboard, setKeyboard] = useState(false);
    const user = auth().currentUser;

    const __isValidEmail = email => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };

    const __doLogin = () => {
        if (!email) {
            Alert.alert('Warning', 'Please input email')
        } else if (password.length < 6) {
            Alert.alert('Warning', 'Password should be more than 6 characters')
            setPassword('')
        } else if (!__isValidEmail(email)) {
            Alert.alert('Warning', 'Please input valid email')
            setEmail('')
        } else{
            __doSingIn(email, password);
        }            
    };

    const __doSingIn = async (email, password) => {
        try {
            setisLoading(true);
            if (user){ 
                navigation.navigate('Welcome');
            } else {
                let response = await 
                auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    setisLoading(false);
                }).catch((error) => {
                    setisLoading(false);
                    Alert.alert('Warning', 'Please try again with correct email and password')
                });
            }
        } catch (e) {
            setisLoading(false);
            console.error(e.message);
            Alert.alert('Warning', 'Sorry, something went wrong')
        }
    };

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = () => {
        setKeyboard(true);
    };

    const _keyboardDidHide = () => {
        setKeyboard(false);
    };
    return (
        <View style = {{ backgroundColor: '#fff', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {isLoading === true ? (<SplashComponent/>) : 
                <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', width: '100%'}}> 
                <View style={styles.topContainer}>
                    <Image source={ require('../Assets/playstore.png')}
                        style={{width:100, height: 150, marginBottom: 0, paddingBottom: 0}}></Image>
                    {!isKeyboard && <Image source={ require('../Assets/Logo.png')}
                        style={{ width:'60%', height: 150, resizeMode: 'contain', marginTop: -30, paddingTop: 0}}></Image>}
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        label={"Email"}
                        //autoCapitalize={false}
                        keyboardType="email-address"
                        style={styles.textInputStyle}
                        placeholder="email"
                        placeholderTextColor='#60c182'
                        onChangeText={text => setEmail(text)}
                    />

                    <TextInput
                        label={"Password"}
                        secureTextEntry
                        //autoCapitalize={false}
                        style={styles.textInputStyle}
                        // selectionColor={blue}
                        placeholder="password"
                        placeholderTextColor='#60c182'
                        onChangeText={text => setPassword(text)}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.commonButtonStyle}
                        activeOpacity={0.5}
                    onPress={ __doLogin }>
                        <Text style={styles.commonbuttonTextStyle}>
                            Sign In
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={{width: responsiveWidth(90)}}
                        onPress={()=> navigation.navigate('Home')}
                        activeOpacity={0.5}>
                            <Text style={styles.commontextStyle}>GO BACK</Text>
                    </TouchableOpacity>
                </View>
                </View>
                }
            </TouchableWithoutFeedback>
        </View>
    );
}

export default SignIn;

const styles = StyleSheet.create({
    topContainer: {
        flex: 2,
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%',
    },
    inputContainer: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'flex-start',
        width: '100%',
        minHeight: responsiveHeight(10),
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
        fontWeight: 'bold',
    },
    boldText: {
        fontWeight: 'bold',
    },
});

