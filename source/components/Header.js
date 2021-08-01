import React from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    Image } from "react-native";
import Dropdown from './DropdownComponent';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveFontSize,
    responsiveScreenFontSize
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';

export default function HeaderComponent() {
    const navigation = useNavigation();

    function navigateToSignOut() {
      navigation.navigate('SignOut');
    }

    return (
        <View style={ styles.headerContainer }>
            <View style={styles.logoimageContainer}>
                <Image source={ require('../Assets/Logowithoutdescription.png')}
                    style={styles.imageContainer}></Image>
            </View>
            <TouchableOpacity 
                style={styles.dropdownContainer}
                onPress={()=> navigateToSignOut()}>
                <Text style={styles.commontext}>...</Text>
                {/* <Dropdown /> */}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: responsiveHeight(8.5),
        width: '100%',
        paddingTop: responsiveHeight(0.5),
    },
    logoimageContainer: {
        width: responsiveWidth(70),
        height: responsiveHeight(8),
        alignItems: 'flex-end',  
    },
    imageContainer: {
        width:responsiveWidth(40), 
        height: responsiveHeight(8), 
        resizeMode: 'contain',
    },
    dropdownContainer: {
        width: responsiveWidth(30),
        height: responsiveHeight(8),
        borderColor: '#000',     
    },
    commontext: {
        // width: responsiveWidth(10),
        // height: responsiveFontSize(3),
        color: '#60c182',
        fontSize: responsiveFontSize(4),
        width: responsiveWidth(30),
        height: responsiveHeight(8),
        paddingBottom: responsiveFontSize(1.5),
        paddingRight: responsiveWidth(5),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        textAlignVertical: 'center',
        textAlign: 'right',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400', 
    },
});

