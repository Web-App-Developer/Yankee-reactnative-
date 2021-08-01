import * as React from 'react';
import { Alert, Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {db} from '../firebase/config';
import auth from '@react-native-firebase/auth';
import { ScrollView } from 'react-native-gesture-handler';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveFontSize,
    responsiveScreenFontSize
} from 'react-native-responsive-dimensions';

var user;
var name = '';
var uuid = '';
var gameCode = '';
var firebaseNameRef;
var firebaseImagesRef;
var firstplayeruuid = '';


export default class GiftsScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            players: [],
            _uuid: [],
            orderedplayers: [],
            gifts: [],
            imageurl: '',
            currentturn: 1,
            num: 0,
            wrappedarray: [],
            wrappedimageurlarray: [],
            unwrappedimageurlarray: [],
            claimedby: [],
            gamebegin: false,
        };
        user = auth().currentUser;
        if(user != null){
            name = user.displayName;
            uuid = user.uid;
            db.ref(uuid).once('value', (snapshot) => {
                if(snapshot.val() !== null){
                    gameCode = snapshot.val()['gameCode'];
                    db.ref(gameCode).on('value', (snapshot) => {
                        if(snapshot.val() !== null) {
                            const gamedata = snapshot.val()
                            const gamedatauuidkeys = Object.keys(gamedata)
                            let temp = [];
                            gamedatauuidkeys.map((item, key) => {
                                temp[key] = item['name'];
                            })
                            console.log('playerscreen', temp);
                            const state = this.state;
                            state['_uuid'] = gamedatauuidkeys;
                            state['players'] = temp;                           
                            this.setState(state);
                            firebaseNameRef = db.ref(gameCode + '/' + uuid);
                            firebaseNameRef.on('value', (snapshot) => {
                                if(snapshot.val() !== null){
                                    state['currentturn'] = snapshot.val()['currentturn'];
                                    state['num'] = snapshot.val()['num'];
                                    state['gamebegin'] = snapshot.val()['gamebegin'];
                                    this.setState(state);
                                }
                            })
                            this.state._uuid.map((item, key) => {
                                firebaseImagesRef = db.ref(gameCode + '/' + item +'/Images');
                                firebaseImagesRef.on('value', (snapshot) => {
                                    if(snapshot.val() !== null){
                                        const wrapped = snapshot.val()['wrapped'];
                                        state['wrappedarray'][key] = wrapped;
                                        const wrappedimageurl = snapshot.val()['wrappedImageurl'];
                                        const unwrappedimageurl = snapshot.val()['unwrappedImageurl'];
                                        state['wrappedimageurlarray'][key] = wrappedimageurl;
                                        state['unwrappedimageurlarray'][key] = unwrappedimageurl;
                                        state['claimedby'][key] = snapshot.val()['claimedby'];
                                        this.setState(state);
                                        
                                    }
                                })
                            })
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
                                        if(i === 0){
                                            firstplayeruuid = this.state._uuid[j];
                                        }
                                    }
                                }
                            }
                            state['orderedplayers'] = temp;
                            this.setState(state);
                        }
                    })
                    if(gameCode === null){
                        Alert.alert('Can\'t find the game')}
                }
            })
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    claim = (index) => {
        if(this.state.gamebegin === false) { Alert.alert('Please wait till the game is started')}
        else{
            let wrapped = true;
            db.ref(gameCode + '/' + this.state._uuid[index] + '/Images').once('value', (snapshot) => {
                wrapped = snapshot.val()['wrapped'];
            })
            if(this.state.currentturn !== this.state.num){
                Alert.alert('Can not perform action. Please wait your turn');
            } else if (wrapped == false) {
                Alert.alert('Please select wrapped gift');
            } else {          
                db.ref(gameCode + '/' + this.state._uuid[index] + '/Images').update({
                    wrapped: false,
                    claimedby: name,
                })
                if(this.state.currentturn == this.state._uuid.length){
                    this.state._uuid.map((item, key) => {
                        db.ref(gameCode + '/' + item).update({
                            currentturn: 1,
                        })
                    })
                    db.ref(gameCode + '/' + firstplayeruuid).update({
                        cansteal: true,
                    })
                } else {
                    var flag = false;
                    for (var i=this.state.num; i<this.state._uuid.length; i++){
                        db.ref(gameCode + '/' + this.state._uuid[i]).once('value', (snapshot) => {
                            if(flag == false && snapshot.val() && snapshot.val()['gift'] == "") {
                                flag = true;
                                this.state._uuid.map((item, key) => {
                                    db.ref(gameCode + '/' + item).update({
                                        currentturn: i+1,
                                    })
                                })
                            }
                        })
                    }
                }                
                db.ref(gameCode + '/' + uuid).update({
                    gift: this.state.unwrappedimageurlarray[index],
                    cansteal: false,
                })
            }
        }        
    }

    giftslist = () => {
        return this.state.wrappedarray.map((item, key) => {
            return (
                <View style={{margin: 10}}>
                    {item === true  ? 
                        (<View style={styles.imageContainer}>
                            <TouchableOpacity onPress={() => this.claim(key)}>
                                <Image source = {{ uri: this.state.wrappedimageurlarray[key] }} style = {styles.image} />
                                <Text style={styles.imageContainerText}>unclaimed</Text>
                            </TouchableOpacity>
                        </View>) :
                        <View style={styles.imageContainer}>
                            <TouchableOpacity>
                                <Image source = {{ uri: this.state.unwrappedimageurlarray[key] }} style = {styles.image}/>
                                <Text style={styles.imageContainerText}>{'claimed by ' + this.state.claimedby[key]}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            )
        });
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ScrollView style= {{marginTop: 10}}>{this.giftslist()}</ScrollView>
            </View> 
        );
    }
}

const styles=StyleSheet.create({
    imageContainer: {     
        borderRadius: 10,
        width: responsiveWidth(90),
        height: responsiveWidth(90),
        borderRadius: responsiveHeight(3.5),
        overflow: 'hidden',
    },
    image: {
        width: responsiveWidth(90),
        height: responsiveWidth(73),
        resizeMode: 'cover',
    },
    imageContainerText: {
        // height: responsiveWidth(17),
        backgroundColor: '#60c182',
        color: '#fff',
        fontSize: responsiveFontSize(3.3),
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
        borderColor: '#000',
        borderWidth: 1,
    }
});