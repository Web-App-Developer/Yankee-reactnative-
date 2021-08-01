import React from 'react';
import { Alert, Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, SnapshotViewIOSBase } from 'react-native';
import {db} from '../firebase/config';
import auth from '@react-native-firebase/auth';
import shuffle from 'shuffle-array';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveFontSize,
    responsiveScreenFontSize
} from 'react-native-responsive-dimensions';


// var user;
var name = '';
var uuid = '';
var firebasegameCodeRef;
var gameCodetemp = '';
var firstplayeruuid = '';

export default class PlayersScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            _uuid: [],
            players: [],
            host: false,
            gameCode: '',
            gamebegin: false,
            gifts: [],
            currentturn: 1,
            num: 0,
            cansteal: true,
            user: '',
        };
        const state = this.state;
        state['user'] = auth().currentUser;
        this.setState(state);
        console.log('user', this.state.user);
        if(this.state.user != null){
            name = this.state.user.displayName;
            uuid = this.state.user.uid;
            console.log('name', name);
            db.ref(uuid).once('value', (snapshot) => {
                if(snapshot.val() !== null){
                    gameCodetemp = snapshot.val()['gameCode'];               
                    state['gameCode'] = snapshot.val()['gameCode'];
                    this.setState(state);
                } 
                if(gameCodetemp === null){
                    Alert.alert('Can\'t find the player')

                } else {
                    firebasegameCodeRef = db.ref(gameCodetemp);
                    firebasegameCodeRef.on('value', (snapshot) => {
                        if(snapshot.val() !== null){
                            const gamedata = snapshot.val()
                            console.log('gamedata', gamedata);
                            const gamedatauuidkeys = Object.keys(gamedata);
                            console.log('gamedatauuidkeys', gamedatauuidkeys);
                            if(gamedatauuidkeys.includes(uuid)){
                                let nametemp = [];
                                gamedatauuidkeys.map((item, key) => {
                                    nametemp[key] = gamedata[item]['name'];
                                    console.log('gamedataname', gamedata[item]['name']);
                                })
                                console.log('playerscreen', nametemp);
                                state['_uuid'] = gamedatauuidkeys;
                                state['players'] = nametemp;
                                state['host'] = gamedata[uuid]['host'];
                                state['gamebegin'] = gamedata[uuid]['gamebegin'];
                                state['currentturn'] = gamedata[uuid]['currentturn'];
                                state['num'] = gamedata[uuid]['num'];
                                state['cansteal'] = gamedata[uuid]['cansteal'];        
                                this.setState(state);
                                let order = [];
                                this.state._uuid.map((item, key) => {
                                    if(item){
                                        order[key] = gamedata[item]['num'];
                                    }
                                })
                                let temp = [];let tempuuid = [];
                                for (var i=0;i<this.state._uuid.length;i++){
                                    for (var j =0;j<this.state._uuid.length;j++){
                                        if(order[j] == i+1){
                                            temp[i] = this.state.players[j];
                                            tempuuid[i] = this.state._uuid[j];
                                            if(i === 0){
                                                firstplayeruuid = this.state._uuid[j];
                                            }
                                        }
                                    }
                                }
                                // let order = [];
                                // this.state.players.map((player, key) => {
                                //     if(player){
                                //         order[key] = gamedata[player]['num'];
                                //     }                                
                                // })
                                // temp = [];
                                // for (var i=0;i<this.state.players.length;i++){
                                //     for (var j =0;j<this.state.players.length;j++){
                                //         if(order[j] == i+1){
                                //             temp[i] = this.state.players[j];
                                //         }
                                //     }
                                // }
                                state['players'] = temp;
                                state['_uuid'] = tempuuid;
                                this.setState(state);
                                this.state._uuid.map((item, key) => {
                                    state['gifts'][key] = gamedata[item]['gift'];
                                })
                                this.setState(state);
                            }
                        } else {
                            // Alert.alert('gamecode not exist')
                        }
                    })
                }
            }).then(() =>{
                console.log('ok')
            }).catch((error) => {
                console.log('error', error)
            });
        } else {
            console.log('playerscreen gameplayer not exist');
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    stealImage = (index) => {
        if(this.state.cansteal === false){
            console.log(this.state.cansteal);
        }else if (this.state.currentturn !== this.state.num){
            Alert.alert('Please wait your turn');
        } else if (this.state.gifts[index] == "") {
            Alert.alert('can not perform action')
        } else {
            if(uuid !== firstplayeruuid && uuid !== this.state._uuid[index]){
                db.ref(gameCodetemp + '/' + uuid).update({
                    gift: this.state.gifts[index],
                    cansteal: false,
                })
                db.ref(gameCodetemp + '/' + this.state._uuid[index]).update({
                    gift: "",
                })
                if(this.state.currentturn == this.state._uuid.length){
                    this.state._uuid.map((item, key) => {
                        db.ref(gameCodetemp + '/' + item).update({
                            currentturn: 1,
                        })
                    })
                    db.ref(gameCodetemp + '/' + firstplayeruuid).update({
                        cansteal: true,
                    })
                } else {
                    this.state._uuid.map((item, key) => {
                        db.ref(gameCodetemp + '/' + item).update({
                            currentturn: index+1,
                        })
                    })
                }
            } else {
                const gifttemp = this.state.gifts[0];
                if(gifttemp) {
                    db.ref(gameCodetemp + '/' + uuid).update({
                        gift: this.state.gifts[index],
                    }).then(() => {
                        db.ref(gameCodetemp + '/' + this.state._uuid[index]).update({
                            gift: gifttemp,
                        })
                    })
                    this.state._uuid.map((item) => {
                        db.ref(gameCodetemp + '/'+ item).update({
                            currentturn: 0,
                        })
                    })
                }
            }
        }
    }

    startgame = () => {
        const state = this.state;    
        state['_uuid'] = shuffle(this.state._uuid);
        state['gamebegin'] = true;
        this.setState(state);
        this.state._uuid.map((item, key) => {
            const gamedataRef = db.ref(this.state.gameCode + '/' + item);
            gamedataRef.update({
                gamebegin: true,
                num: key+1,
            })
        })
    }

    endGameConfirm = () => {
        Alert.alert(
            'Warning',
            'The game will not be saved. \n Are you sure to end game?',
            [
                {text: 'YES', onPress: () => this.endGame()},                
                {text: 'NO', style: 'cancel'},
            ]
        )        
    }

    endGame = () => {
        this.state._uuid.map((item) => {
            db.ref('messages/' + this.state.gameCode)
            .remove()
            .then(()=>{
                console.log('deleted messages from ', this.state.gameCode);
            }).catch((error) => {
                console.log('error', error);
            })
            db.ref(this.state.gameCode)
            .remove()
            .then(() =>{
                console.log(item + 'deleted successfully from' + this.state.gameCode);
                db.ref(item)
                .remove()
                .then(() =>{
                    console.log(item + 'deleted successfully from firebase');
                }).catch((error) => {
                    console.log('error', error);
                });
            }).catch((error) => {
                console.log('error', error);
            });
        })
    }

    displaygifts = (index) => {
        return(
            <View>
                { this.state.gifts[index] !== "" ? 
                    (<Image 
                        source={{uri: this.state.gifts[index]}} 
                        style={styles.giftimage} resizeMode= 'contain'/>
                    ) : 
                    <Text></Text>}
            </View>
        );
    }

    list = () => {
        return this.state.players.map((item, key) => {
            return (
                <View style={{ 
                    flex: 1,
                    flexDirection: 'row', 
                    marginTop: 10, 
                    }}> 
                    {this.state.gamebegin === false ? (<Text style={styles.playerOrderComponent}>-</Text>) : 
                        <Text style={styles.playerOrderComponent}>{'#' + (key+1)}</Text>}
                    <View style={{ justifyContent: 'center',}}>
                        <Text key = {key} style={styles.playerNameComponent}>
                            {item}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.giftimageContainer} onPress={() => this.stealImage(key)} >
                            {this.displaygifts(key)}
                    </TouchableOpacity>                      
                </View>
            );
        });
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                {this.state.gamebegin === false ? 
                    (<View>
                        {this.state.host === true ? 
                            (<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: responsiveHeight(2),}}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.commontextStyle}>Are all the players signed in? If so, hit</Text>
                                    <Text style={styles.commontextStyle}>the button below to begin the game</Text>
                                    <Text style={styles.commontextStyle}>Good luck!</Text>
                                </View>
                                <View style={styles.gamecodeText}>
                                    <Text style={{fontSize: responsiveFontSize(2.8)}}>game code:</Text>
                                    <Text style={{fontSize: responsiveFontSize(2.9), color: '#ffa525', }} selectable>{this.state.gameCode}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.commonButtonStyle}
                                    activeOpacity={0.5}
                                    onPress={this.startgame}
                                    >
                                    <Text style={styles.buttonTextStyle}>
                                        Begin the game
                                    </Text>
                                </TouchableOpacity>
                            </View>) : <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: responsiveHeight(2) }}>
                            <Text style={styles.commontextStyle}>As soon as the game's host starts the</Text>
                                <Text style={styles.commontextStyle}>game. the player list will be randomly</Text>
                                <Text style={styles.commontextStyle}>ordered and the game will begin.</Text>
                                <Text style={styles.commontextStyle}>Good luck!</Text>
                        </View> }                        
                    </View>):  <View>{this.state.host === true ? (<TouchableOpacity
                                    style={styles.commonButtonStyle}
                                    activeOpacity={0.5}
                                    onPress={this.endGameConfirm}
                                    >
                                    <Text style={styles.buttonTextStyle}>
                                        End game
                                    </Text>
                                </TouchableOpacity>) : <Text></Text>}</View>
                    }  
                    <ScrollView style={{marginTop: 10,}}>{this.list()}</ScrollView>              
            </View>
        );
    }
}

const styles = StyleSheet.create({
    playerNameComponent: {
        width: responsiveWidth(95),
        height: responsiveWidth(12),
        // marginTop: responsiveHeight(0.5),
        borderColor: '#60c182',
        backgroundColor: '#60c182',
        fontSize: responsiveFontSize(2.3),
        color: '#fff',
        textAlign: 'left',
        alignSelf: 'stretch',
        textAlignVertical: 'center',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400', 
        marginLeft: -responsiveWidth(3),
        paddingLeft: responsiveWidth(7),
    },
    playerOrderComponent: {
        width: responsiveWidth(14),
        height: responsiveWidth(14),
        backgroundColor: '#ffa525',
        zIndex: 100,
        borderRadius: responsiveFontSize(2),
        marginLeft: responsiveWidth(2),
        fontSize: responsiveFontSize(2.7),
        color: '#fff',
        // paddingLeft: 25,
        // paddingTop: 10,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    },
    giftimageContainer: {
        width: responsiveWidth(14),
        height: responsiveWidth(14),
        marginLeft: -responsiveWidth(30),
        marginRight: responsiveWidth(3),
        resizeMode: 'cover',
    },
    textContainer: {
        justifyContent: 'center', 
        alignItems: 'center',
        paddingTop: responsiveHeight(1),
    },
    commontextStyle: {
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
        fontSize: responsiveFontSize(2.2),
        width: responsiveWidth(95),
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
    },
    gamecodeText: {
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(2),
        justifyContent: 'center', 
        alignItems: 'center',
    },
    commonButtonStyle: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#60c182',
        height: responsiveHeight(7),
        borderRadius: 20,
        width: responsiveWidth(90),
        marginTop: responsiveHeight(3),
    },    
    buttonTextStyle: {
        color: '#60c182',
        fontSize: responsiveFontSize(2.5),
        width: responsiveWidth(90),
        height: responsiveHeight(7),
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',   
    },
    giftimage: {
        width: responsiveWidth(14),
        height: responsiveWidth(14),
        resizeMode: 'cover',
    },  
});