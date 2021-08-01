import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Alert } from "react-native";
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveFontSize,
  responsiveScreenFontSize
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';

export default function DropdownMenu() {
  const navigation = useNavigation();

  function navigateToSignOut() {
    navigation.navigate('SignOut');
  }

  return (
    <MenuProvider style={styles.menuContainer}>
    <Menu onSelect={() => navigateToSignOut()}>
      <MenuTrigger>
        <Text style={styles.headerText}>...</Text>
      </MenuTrigger>
      <MenuOptions>
        <MenuOption value={"Logout"}>
          <View style={styles.menucontentContainer}>
            <Text style={styles.menuContent}>SignOut?</Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  </MenuProvider>  
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: '#60c182',
    width: responsiveWidth(9),
    fontFamily: 'Font_Awesome_5_Brands_Regular_400', 
  },
  menuContent: {
    color: "#60c182",
    fontWeight: "bold",
    fontSize: 20,
    width: responsiveWidth(20),
    height: responsiveHeight(3.5),
  },
  menucontentContainer: {
    width: responsiveWidth(28),
    height: responsiveHeight(7.5),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  menuContainer: {
    flex: 1, 
    flexDirection: "column", 
    width: responsiveWidth(30),
    height: responsiveHeight(8),
    alignItems: 'flex-end',
  },
});