import React from 'react';
import {
    Text, 
    StyleSheet, 
    View } from 'react-native';
import { 
    GiftedChat, 
    Send, 
    Bubble,
    Composer, 
    InputToolbar} from 'react-native-gifted-chat';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveFontSize,
    responsiveScreenFontSize
} from 'react-native-responsive-dimensions';
import auth from '@react-native-firebase/auth';
import {db} from '../firebase/config';

var user;
var name = '';
var uuid = '';
var gameCode = '';
var key;

export default class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            _uuid: '',
            username: '',
        }
        user = auth().currentUser;
        if(user !== null) {
            name = user.displayName;
            uuid = user.uid;
            const state = this.state;
            state['username'] = name;
            state['_uuid'] = uuid;
            this.setState(state);
            db.ref(uuid).once('value', (snapshot) => {
                if(snapshot.val() !== null){
                    gameCode = snapshot.val()['gameCode'];
                }
            }).then(() => {
                if(gameCode !== null){
                    db.ref('messages/' + gameCode).on('value', (snapshot) => {
                        if(snapshot.val() === null){
                            this.setState({
                                messages: [],
                            })
                        } else {
                            const gamecodekey = Object.keys(snapshot.val());                     
                            var tempmessages = [];
                            for(var i=0;i<gamecodekey.length;i++){
                                tempmessages[gamecodekey.length-i-1] = snapshot.val()[gamecodekey[i]];
                            }
                            this.setState({messages: tempmessages});
                            console.log('chat messages', this.state.messages);
                        }
                    })
                }
            })
        }
    }

    // componentDidMount() {
    // }

  onSend(message = {}) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, message),
    }))
    db.ref('messages/' + gameCode).once('value', (item) => {
        if(item.val() === null) {            
            key = 0;
        } else {
            key = Object.keys(item.val()).length;
        }
    }).then(() => {
        db.ref('messages/' + gameCode + '/' + key).set(message[0])
    })
  }

  renderSend(props) {
      return(
        <Send {...props}
            containerStyle={{
                width: responsiveWidth(20),
                height: responsiveHeight(7),
                justifyContent: 'center',
            }}
        >
            <Text style={styles.sendButtonContainer}>send</Text>
        </Send>
      );
  }

  renderInputToolbar(props) {
      return(
          <InputToolbar 
            {...props}
            containerStyle ={{
                backgroundColor: '#fff',
                height: responsiveHeight(8),
                alignItems: 'center',
                justifyContent: 'center',
            }}
            primaryStyle={{ alignItems: 'center' }}
          />
      );
  }

  renderBubble(props) {
      return (
        <View style={{
            width: responsiveWidth(100),
            marginBottom: responsiveHeight(1),
            }}>
            <Bubble
            {...props}
            containerStyle={{
                left: { 
                },
                right: { 
                },
            }}
            wrapperStyle={{
                left: { 
                    paddingLeft: responsiveWidth(3) ,
                    borderColor: '#199946', 
                    borderWidth: 2, 
                    width: responsiveWidth(100),
                },
                right: { 
                    borderColor: '#ffa525', 
                    borderWidth: 2, 
                    paddingLeft: responsiveWidth(2),
                    width: responsiveWidth(100), 
                    backgroundColor: '#fff',
                    marginLeft: responsiveWidth(5),
                },
            }}
            textStyle={{
                left: {
                    color: '#000', 
                    fontSize: responsiveFontSize(2.2),
                },                
                right: { 
                    color: '#000', 
                    fontSize: responsiveFontSize(2.2),
                    // fontFamily: 'Font_Awesome_5_Brands_Regular_400', 
                }
            }}
            />
      </View>
      );
  }

  renderComposer(props) {
      return (
          <View style={{
              width: responsiveWidth(80), 
              height: responsiveHeight(6.5),
              alignItems: 'center',
              justifyContent: 'center',
              }}>
        <Composer
            {...props}
            textInputStyle={{
                width: responsiveWidth(75), 
                color: '#000',
                backgroundColor: '#fff',
                borderWidth: 2,
                borderRadius: 20,
                borderColor: '#60c182',
                paddingLeft: responsiveWidth(3),
                fontSize: responsiveFontSize(1.8),
                // paddingTop: responsiveHeight(2),
            }}
        />      
        </View>  
      );
  }

  renderCustomView(props) {
      return (
        <View 
            style={{ 
                minHeight: 20,
                marginTop: responsiveHeight(0.5),
            }}>
            {props.currentMessage.user.name == name ? 
                ( <Text
                    style={{ 
                        color: '#ffa525', 
                        paddingLeft: 5, 
                        alignSelf: 'stretch',
                        textAlign: 'right',
                        fontSize: responsiveFontSize(2.3),
                        paddingRight: responsiveWidth(5),
                        fontWeight: 'bold',
                        fontFamily: 'Font_Awesome_5_Brands_Regular_400', 
                    }}>
                    You
                </Text>) :             
                <Text
                style={{ 
                    color: '#60c182', 
                    paddingLeft: 5, 
                    fontWeight: 'bold',
                    fontFamily: 'Font_Awesome_5_Brands_Regular_400', 
                    fontSize: responsiveFontSize(2.3),
                }}>
                {props.currentMessage.user.name}
            </Text>
            }
        </View>          
      );
  }

  renderUsernameOnMessage() {
      return(
        <Text>renderusername</Text>
      );
  }
 
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        alwaysShowSend
        renderSend={this.renderSend}
        // renderUsernameOnMessage
        renderInputToolbar={this.renderInputToolbar}
        renderBubble={this.renderBubble}
        renderComposer={this.renderComposer}
        renderCustomView={this.renderCustomView}
        renderAvatar = {() => null}
        showAvatarForEveryMessage={true}
        placeholder={''}
        user={{
          _id: this.state._uuid,
          name: this.state.username,
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
    sendButtonContainer: {
        width: responsiveWidth(20),
        height: responsiveHeight(5.5),
        color: '#fff',
        borderRadius: responsiveFontSize(2),
        backgroundColor: '#60c182',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Font_Awesome_5_Brands_Regular_400',
        fontSize: responsiveFontSize(2.5),
    },
});