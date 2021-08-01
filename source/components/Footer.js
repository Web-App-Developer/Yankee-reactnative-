import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Alert } from "react-native";
import auth from '@react-native-firebase/auth';
import { db } from "../firebase/config";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveFontSize,
    responsiveScreenFontSize
} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

var user;
var name;
var uuid = '';

export default class HeaderComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            _uuid: [],
            players: [],
            gameCode: '',
            gamebegin: false,
            currentturn: 0,
            num: 0,
            currentturnname: '',
        }
        user = auth().currentUser;
        const state = this.state;
        if(user != null){
            name = user.displayName;
            uuid = user.uid;
            db.ref(uuid + '/gameCode').once('value', (snapshot) => {
                if(snapshot.val() !== null){
                    state['gameCode'] = snapshot.val();
                    this.setState(state);
                    db.ref(this.state.gameCode).on('value', (snapshot) => {
                        if (snapshot.val() !== null) {      
                            const gamedata = snapshot.val()
                            const gamedatauuidkeys = Object.keys(snapshot.val());
                            if(gamedatauuidkeys.includes(uuid)){
                                let temp = [];
                                gamedatauuidkeys.map((item, key) => {
                                    temp[key] = gamedata[item]['name'];
                                })
                                state['_uuid'] = gamedatauuidkeys;
                                state['players'] = temp;
                                state['gamebegin'] = snapshot.val()[uuid]['gamebegin'];
                                state['num'] = snapshot.val()[uuid]['num'];
                                this.setState(state);
                                let order = [];
                                this.state._uuid.map((item, key) => {
                                    if(item){
                                        order[key] = gamedata[item]['num'];
                                    }
                                })
                                temp = [];
                                for (var i=0;i<this.state._uuid.length;i++){
                                    for (var j =0;j<this.state._uuid.length;j++){
                                        if(order[j] == i+1){
                                            temp[i] = this.state.players[j];
                                        }
                                    }
                                }
                                // let order = [];
                                // this.state.players.map((player, key) => {
                                //     if(player){
                                //         order[key] = gamedata[player]['num'];
                                //     }                                
                                // })
                                // let temp = [];
                                // for (var i=0;i<this.state.players.length;i++){
                                //     for (var j =0;j<this.state.players.length;j++){
                                //         if(order[j] == i+1){
                                //             temp[i] = this.state.players[j];
                                //         }
                                //     }
                                // }
                                state['players'] = temp;
                                this.setState(state);
                            }
                            db.ref(this.state.gameCode + '/' + uuid).on('value', (snapshot) => {
                                if(snapshot.val()){
                                    state['currentturn'] = snapshot.val()['currentturn'];
                                    state['currentturnname'] = this.state.players[snapshot.val()['currentturn'] - 1];
                                    this.setState(state);
                                }
                            })
                        }
                    })
                } else {console.log('game over');}
            })
        }
    }

    componentWillUnmount() {
        // db.ref(this.state.gameCode).off();
        // db.ref(this.state.gameCode + '/' + name).off();
    }

    render() {
        return (
            <View style={{backgroundColor: '#fff'}}>
                <LinearGradient 
                    colors={['#d8d8d8', '#fff']}
                    style={styles.linearGradient}>
                </LinearGradient>
                <View style = {{ flexDirection: 'row', width: responsiveWidth(100), height: responsiveHeight(5)}}>
                    <Text style={styles.commonText}>current turn</Text>
                    <Text style={styles.commonText}>your turn</Text>
                </View>
                { (this.state.gamebegin === false || this.state.currentturn === 0) ? 
                    (<View style = {{ flexDirection: 'row' }}>
                        <Text style={styles.currentturndash}>-</Text>
                        <Text style={styles.yourTurn}>-</Text>
                    </View>) : 
                    <View style = {{ flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column'}}>
                            <Text style={styles.currentTurn}>{'#' + this.state.currentturn}</Text>
                            <Text style={styles.currentTurnName}>{this.state.currentturnname}</Text>
                        </View>
                        <Text style={styles.yourTurn}>{'#' + this.state.num}</Text>
                    </View> }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    commonText: {
        color: '#60c182',
        fontSize: responsiveFontSize(2.4),
        width: responsiveWidth(50),
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    },
    currentTurn: {
        fontSize: responsiveFontSize(3),
        color: '#000',
        width: responsiveWidth(50),
        height: responsiveHeight(5),
        textAlign: 'center',
        justifyContent: 'flex-end',
        alignItems: 'center',
        textAlignVertical: 'bottom',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    },
    currentTurnName: {
        fontSize: responsiveFontSize(2),
        width: responsiveWidth(50),
        height: responsiveHeight(4),
        color: '#000',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'top',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    },
    yourTurn: {
        fontSize: responsiveFontSize(3.5),
        width: responsiveWidth(50),
        height: responsiveHeight(9),
        color: '#ffa525',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    },
    currentturndash: {
        width: responsiveWidth(50),
        height: responsiveHeight(9),
        fontSize: responsiveFontSize(2.5),
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',  
    },
    linearGradient: {
        // flex: 1,
        width: responsiveWidth(100),
        height: responsiveHeight(1),
      },
});

