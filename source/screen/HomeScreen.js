import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    Image,
    Platform,
    StyleSheet,
} from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveFontSize,
    responsiveScreenFontSize
} from 'react-native-responsive-dimensions';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
}

function Home({ navigation }) {
    return (
        <View style={{ 
            backgroundColor: '#fff', 
            flex: 1, 
            alignItems: 'center', 
            justifyContent: 'flex-end',}}>
            <View style={styles.topContainer}>
                <Image source={ require('../Assets/playstore.png')}
                    style={{width:100, height: 150, marginBottom: 0, paddingBottom: 0}}></Image>
                <Image source={ require('../Assets/Logo.png')}
                    style={{ width:'60%', height: 150, resizeMode: 'contain', marginTop: -30, paddingTop: 0}}></Image>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.commonButtonStyle}
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate('SignIn')}>
                    <View></View>
                    <Text style={styles.commonbuttonTextStyle}>
                        Sign In
                    </Text>
                </TouchableOpacity>

                <Text style={{
                    ...styles.commontextStyle, 
                    textAlign: 'center', 
                    marginVertical: responsiveHeight(2)}}>OR</Text>

                <TouchableOpacity
                    style={styles.buttonFacebookStyle}
                    activeOpacity={0.5}
                    onPress={() => onFacebookButtonPress()}>
                    <Text style={styles.facebookIconStyle}>Facebook</Text>
                    <Text style={styles.buttonTextStyle}>
                        Sign in with Facebook
                    </Text>
                </TouchableOpacity>
                
                {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                        style={styles.buttonFacebookStyle}
                        activeOpacity={0.5}
                        onpress={() => console.log('pressed facebook')}>
                        <Text style={styles.facebookIconStyle}>Apple</Text>
                        <Text style={styles.buttonTextStyle}>
                            Sign in with Apple
                        </Text>
                    </TouchableOpacity>                    
                ) : <Text style={{height: 0,}}></Text>}

           
                <TouchableOpacity style={{width: responsiveWidth(90)}}
                    onPress={() => navigation.navigate('SignUp')}>
                    <View>
                        <Text style={styles.commontextStyle}>Don't have an account?<Text> </Text>
                            <Text 
                                style={styles.boldText}
                                activeOpacity={0.5}
                                >
                                    SIGN UP</Text>
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>            
        </View>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%', 
    },
    bottomContainer: {
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%',
        marginBottom: responsiveHeight(2),
    },
    buttonFacebookStyle: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#60c182',
        width: responsiveWidth(90),
        height: responsiveHeight(7),
        borderRadius: responsiveHeight(3.5),
        paddingHorizontal: responsiveWidth(4),
        marginBottom: responsiveHeight(1.5),
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
        alignItems: 'center',
    },
    buttonTextStyle: {
        color: '#60c182',
        flex: 1,
        fontSize: responsiveFontSize(2),
        fontFamily: 'Font_Awesome_5_Free_Regular_400',
        textAlign: 'center',
    },
    facebookIconStyle: {
        color: '#60c182',
        fontSize: responsiveHeight(3.5),
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    },
    commonButtonStyle: {
        alignItems: 'center',
        backgroundColor: '#60c182',
        height: responsiveHeight(7),
        borderRadius: responsiveHeight(3.5),
        width: responsiveWidth(90),
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
    boldText: {
        fontWeight: 'bold',
        // paddingLeft: 20,
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    },
    commontextStyle: {
        color: '#60c182',
        width: '100%',
        textAlign: 'right',
        fontSize: responsiveFontSize(2),
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    },
});
export default Home;