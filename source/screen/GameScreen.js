import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  View 
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PlayersScreen from './PlayersScreen';
import GiftsScreen from './GiftsScreen';
import ChatScreen from './Chat';
import HeaderComponent from '../components/Header';
import FooterComponent from '../components/Footer';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import {db} from '../firebase/config';
import auth from '@react-native-firebase/auth';

function Tabscreen() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#60c182',
        labelStyle: {
          fontFamily: 'Font_Awesome_5_Brands_Regular_400',
          fontSize: responsiveFontSize(2.2),
          textTransform: 'lowercase',
        }
      }}>
      <Tab.Screen name="players" component={PlayersScreen} />
      <Tab.Screen name="home" component={GiftsScreen} />
      <Tab.Screen name="chat" component = {ChatScreen} />
    </Tab.Navigator>
  );
}

const Tab = createMaterialTopTabNavigator();
var user;
var name = '';
var uuid = '';

export default class GameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameCode: '',
    }
    user = auth().currentUser;
    if(user) {
      name = user.displayName;
      uuid = user.uid;
      db.ref(uuid).once('value', (snapshot) => {
        console.log('gamescreen', snapshot.val());
        if(!snapshot.val()) {
          console.log('game over');
        } else {
          this.setState({
            gameCode: snapshot.val()['gameCode'],
          })
          console.log('gamecode in gamescreen', this.state.gameCode);
        }
      }).then(()=>{
        const gamecodetemp = this.state.gameCode;
        if(gamecodetemp){
          db.ref(gamecodetemp).on('value', (snapshot) => {
            if(!snapshot.val()) {
              this.setState({
                gameCode: '',
              })
              console.log('game over inside');
              Alert.alert('Game Over');
              this.props.navigation.navigate('Welcome');
            }
          })
        }
      })
    }
  }

  render() {
    return (
      <View style = {{ flex: 1 }}>
        <HeaderComponent />
        <Tabscreen />
        <FooterComponent />
      </View>
    );
  }
}
