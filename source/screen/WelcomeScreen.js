import React, {Component, useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard, 
    Alert } from 'react-native'
import auth from '@react-native-firebase/auth';
import {db} from '../firebase/config';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';
//import gamecodestyles from '../components/styles';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveFontSize,
    responsiveScreenFontSize
} from 'react-native-responsive-dimensions';
import SplashComponent from '../components/SplashComponent';

const CELL_COUNT = 6;

const Welcome = ({navigation}) => {
    const [isLoading, setisLoading] = useState(false);
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [isKeyboard, setKeyboard] = useState(false);
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });
    const user = auth().currentUser;
    var name = '';
    var uuid = '';
    
    if (user){        
        uuid = user.uid;
        name = user.displayName;
        console.log(user);
        console.log('welcomescreen', name);
        if(!name) {navigation.navigate('SignIn')}
    }

    let host = false
    let gamebegin = false
    let num = 0
    let gamedata = {}
    let gameCode = ''
    let wrappedImageurl = ''
    let unwrappedImageurl = ''
    let wrapped = true
    let claimedby = '';
    let currentturn = 1
    let gift = ''
    let cansteal = true

    const generateRandomGameCode = () => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
        for (var i = 0; i < 6; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));      
        return text;        
    }

    const cleangamehistory = (ishost) => {
        if(user){
            db.ref(uuid).once('value', (snapshot) => {
                if(snapshot.val()){
                    gameCode = snapshot.val()['gameCode'];
                    console.log('first clean gamehistory gamecode', gameCode);
                    if(gameCode){
                        db.ref(gameCode + '/' + uuid)
                            .remove()
                            .then(() =>{
                                console.log(name + ' deleted successfully from' + gameCode);
                            }).catch((error) => {
                                console.log('error', error);
                            });
                        db.ref(uuid)
                            .remove()
                            .then(() =>{
                                console.log(name + ' deleted successfully from firebase');
                            }).catch((error) => {
                                console.log('error', error);
                            });
                        // const deletename = name + '/';
                        // console.log('deletename', deletename);
                        // firebase.storage().ref(deletename)
                        //     .delete()
                        //     .then(() => {
                        //         console.log(name +'\'s images deleted successfully');
                        //     })
                        //     .catch((error) => {
                        //         console.log('error', error);
                        //     })
                    }
                }                
            }).then(() => {
                console.log('gamecode', gameCode);
                if(ishost){
                    hostGame();
                } 
            }).catch((error) => {
                console.log('error', error);
            });
        }              
    }

    const hostGame = () => {
        console.log('hostgame');
        host = true
        num = 1
        gameCode = generateRandomGameCode()
        setValue(gameCode)
        db.ref(uuid).set({
            gameCode,
        }).then((data) => {
            console.log('data', data)
        }).catch((error) => {
            console.log('error', error)
        })
        db.ref(gameCode + '/' + uuid).set({
            name,
            host,
            gamebegin,
            num,
            Images: {
                wrapped,
                wrappedImageurl,
                unwrappedImageurl,
                claimedby,
            },
            currentturn,
            gift,
            cansteal,
        }).then((data) => {
            console.log('data', data)
            navigation.navigate('Upload')
        }).catch((error) => {
            console.log('error', error)
        })
    }

    const joinGame = () => {
        host = false
        num = 2
        if(value == ""){
            Alert.alert('Warning', 'Please try again with correct passcode');
        } else {
            setisLoading(true);
            const gameSessionRef = db.ref(value)
            gameSessionRef.once('value', (snapshot) => {
                if(snapshot.val() !== null){
                    gamedata = snapshot.val()
                    if (gamedata === null) {
                        setisLoading(false);
                        Alert.alert('Warning', 'Please try again with correct passcode');
                        setValue("");                        
                    }
                    else {
                        let gamedatauuidkeys = Object.keys(gamedata);
                        if(gamedatauuidkeys.includes(uuid) && gamedata[uuid]['Images']['unwrappedImageurl'] && gamedata[uuid]['Images']['wrappedImageurl']){
                            setValue('');
                            navigation.navigate('Game');                            
                        } else {
                            gameCode = value
                            if (gamedata[gamedatauuidkeys[0]]['gamebegin'] === true){
                                Alert.alert('Can not join this game! This game is started');
                                setisLoading(false);
                            } else if (gamedatauuidkeys.length > 9) {
                                Alert.alert('Can not join this game! Over 10');
                                setisLoading(false);
                            } else {
                                num = gamedatauuidkeys.length + 1;
                                db.ref(uuid).set({
                                    gameCode,
                                }).then((data) => {
                                    console.log('data', data)
                                }).catch((error) => {
                                    console.log('error', error)
                                })                    
                                db.ref(value + '/' + uuid).set({
                                    name,
                                    host,
                                    gamebegin,
                                    num,
                                    Images: {
                                        wrapped,
                                        wrappedImageurl,
                                        unwrappedImageurl,
                                        claimedby,
                                    },
                                    currentturn,
                                    gift,
                                    cansteal,
                                }).then(() => {
                                    setisLoading(false);
                                    navigation.navigate('Upload')
                                }).catch((error) => {
                                    setisLoading(false);
                                    console.log('error', error)
                                })
                                gameCode = '' 
                            }
                            gamedata = {}
                        }                    
                    }
                } else {
                    setisLoading(false);
                    Alert.alert('Warning', 'Please try again with correct passcode');
                    setValue("");  
                }
            }).then(() =>{
                console.log('ok')
            }).catch((error) => {
                setisLoading(false);
                console.log('error', error)
            })
        }
    }
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

    const signOut = () => {
        const user = auth().currentUser;
        if(user !== null) {
            // const name = user.displayName;
            // var gameCode;
            // db.ref(name).once('value', (snapshot) => {
            //   if(snapshot.val()){
            //     gameCode = snapshot.val()['gameCode'];
            //   }                            
            // }).then(() => {
            //     db.ref(gameCode + '/' + name)
            //         .remove()
            //         .then(() =>{
            //             console.log(name + 'deleted successfully from' + gameCode);
            //         }).catch((error) => {
            //             console.log('error', error);
            //         });
            //     db.ref(name)
            //         .remove()
            //         .then(() =>{
            //             console.log(name + 'deleted successfully from firebase');
            //         }).catch((error) => {
            //             console.log('error', error);
            //         });
            //     // firebase.storage().ref(deletename)
            //     //     .delete()
            //     //     .then(() => {
            //     //         console.log(name +'\'s images deleted successfully');
            //     //     })
            //     //     .catch((error) => {
            //     //         console.log('error', error);
            //     //     })
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
        <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {isLoading === true ? (<SplashComponent />) : 
            <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'space-between', width: '100%', }}>
                <View style={styles.topContainer}>
                    {!isKeyboard && <Image source={ require('../Assets/Logowithoutdescription.png')}
                        style={{width:responsiveWidth(80), height: responsiveHeight(10), resizeMode: 'contain'}}></Image>}
                    {!isKeyboard && <Text style={styles.commonTextStyle}>
                        <Text style={styles.boldText}>WELCOME!</Text> Enter your game code below to join your game of yankee swap
                    </Text>}
                    <Image source={ require('../Assets/playstore.png')}
                        style={styles.playstoreimage}></Image>
                </View>

                <View style = {styles.gamecodeContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={gamecodestyles.root}>
                        <CodeField
                            ref={ref}
                            {...props}
                            value={value}
                            onChangeText={setValue}
                            cellCount={CELL_COUNT}
                            rootStyle={gamecodestyles.codeFieldRoot}
                            keyboardType="default"
                            textContentType="oneTimeCode"
                            renderCell={({index, symbol, isFocused}) => (
                            <View
                                // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                                onLayout={getCellOnLayoutHandler(index)}
                                key={index}
                                style={[gamecodestyles.cellRoot, isFocused && gamecodestyles.focusCell]}>
                                <Text style={gamecodestyles.cellText}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                            </View>
                            )}/>
                    </View>
                    <TouchableOpacity onPress = {joinGame} >
                        <Image                        
                            style={styles.joinButton} 
                            source={ require('../Assets/pass.png')} resizeMode = 'contain' />
                    </TouchableOpacity>
                </View>
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.commonButtonStyle}
                        activeOpacity={0.5}
                        onPress={()=> cleangamehistory(true)}>
                        <Text style={styles.buttonTextStyle}>
                            Host a Game
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{width: responsiveWidth(90)}}
                        activeOpacity={0.5}
                        >
                            <Text style={styles.commontextGobackStyle}
                            onPress={()=>{
                            signOut()
                            }}
                            >SIGN OUT
                            </Text>
                    </TouchableOpacity>
                </View>
            </View>
            }
            </TouchableWithoutFeedback>
        </View>         
    );
}

export default Welcome;

const styles = StyleSheet.create({
    topContainer: {
        width: '90%',
        alignItems: 'center', 
        justifyContent: 'flex-start',
        marginVertical: responsiveHeight(2),
    },
    playstoreimage: {
        width: responsiveWidth(30), 
        height: responsiveHeight(20), 
    },
    gamecodeContainer: {
        flex: 1,
        paddingVertical: responsiveHeight(4),
    },
    joinButton: {
        width: responsiveWidth(8), 
        height: responsiveWidth(8),
        borderRadius: responsiveWidth(0.5),
    },
    bottomContainer: {
        marginBottom: responsiveHeight(2),
    },
    commonButtonStyle: {
        borderWidth: 2,
        borderColor: '#60c182',
        width: responsiveWidth(90),
        height: responsiveHeight(7),
        borderRadius: responsiveHeight(3.5),
        paddingHorizontal: responsiveWidth(4),
        marginBottom: responsiveHeight(1.5),
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
        alignItems: 'center',
        justifyContent: 'center',
    },    
    buttonTextStyle: {
        color: '#60c182',
        fontSize: responsiveFontSize(2),
        fontFamily: 'Font_Awesome_5_Free_Regular_400',
        textAlign: 'center', 
    },
    commonTextStyle: {
        textAlign: 'center',
        fontSize: responsiveFontSize(2),
        fontFamily: 'Font_Awesome_5_Brands_Regular_400', 
        marginTop: responsiveHeight(2),
    },
    boldText: {
        fontWeight: 'bold',
    },
    commontextGobackStyle: {
        color: '#60c182',
        width: '100%',
        textAlign: 'right',
        fontSize: responsiveFontSize(2),
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
        fontWeight: 'bold',
      },
});

const gamecodestyles = StyleSheet.create({
    root: {
        marginLeft: responsiveWidth(10),
        marginRight: responsiveWidth(4),
    },
    title: {
        textAlign: 'center', 
    },
    codeFieldRoot: {
        width: responsiveWidth(54),
    },
    cellRoot: {
        width: responsiveWidth(6),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#60c182',
        borderBottomWidth: 2,
    },
    cellText: {
        color: '#199946',
        fontSize: responsiveFontSize(3),
        textAlign: 'center',
    },
    focusCell: {
        borderBottomColor: '#007AFF',
        borderBottomWidth: 2,
    },
});