 import React, {useState} from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    Image, 
    TouchableOpacity, 
    Alert} from 'react-native';
import firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-picker';
import {db} from '../firebase/config';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveFontSize,
  responsiveScreenFontSize
} from 'react-native-responsive-dimensions';

export default function UploadScreen({ navigation }) {
  const [wrappedimage, setWrappedImage] = useState(null);
  const [unwrappedimage, setUnwrappedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const user = auth().currentUser;
  var name = '';
  var uuid = '';

  if (user != null) {
    name = user.displayName;
    uuid = user.uid;
  }

  const selectImage = (wrapped) => {
      const options = {
        maxWidth: 2000,
        maxHeight: 2000,
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      };
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };
          console.log(source);
          wrapped === true ? (setWrappedImage(source)) : setUnwrappedImage(source);
          uploadImage(source, wrapped);
        }
      });
  };

  const uploadImage = async (image, wrapped) => {
    if(user != null){
      const { uri } = image;
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      setUploading(true);
      setTransferred(0);
      try {      
        const response = await fetch(uploadUri);
        const blob = await response.blob();
        const ref = firebase.storage().ref(uuid + '/' + filename);
        const task = ref.put(blob).then((data) => {
          data.ref.getDownloadURL().then(((url) => {
            wrapped === true ? (setImageUrl(url, 'wrappedImageurl')) : setImageUrl(url, 'unwrappedImageurl') 
          }))
        });
      } catch (err) {
        console.log('uploadImage error: ' + err.message); 
      }
      setUploading(false);
    }
  };

  const setImageUrl = (imageurl, imageurlref) => {
    if(user!= null){
    var gameCode = ''
    db.ref(uuid).once('value', (snapshot) => {
      if(snapshot.val() !== null){
        gameCode = snapshot.val()['gameCode']
      }
      if(gameCode != null){
        db.ref(gameCode + '/' + uuid + '/Images' + '/' + imageurlref).set(
          imageurl
        )
      }
    })
  }
  }

  const entergame = () => {
    if (wrappedimage == null || unwrappedimage == null){
      Alert.alert('Please Upload Image');
    } else {
      navigation.navigate('Game');
    }
  }  

  return (
    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      <View style={styles.topContainer}>
          <Image source={ require('../Assets/Logowithoutdescription.png')}
              style={{width:responsiveWidth(80), height: responsiveHeight(10), resizeMode: 'contain'}}></Image>
          <Text style={styles.commonTextStyle}>
              Now please upload two photos of your present. The first should be wrapped and the second should be displayed for all to see!
          </Text>
      </View>
      <View style={styles.uploadContainer}>
        <View style={styles.upload} >
            <TouchableOpacity
                style={styles.uploadButton} 
                >                    
                    {wrappedimage !== null ? (
                    <Image source={{ uri: wrappedimage.uri }} style={styles.imageBox} resizeMode='cover' />
                    ) : <View style={styles.imageBox}><Text onPress={() => selectImage(true)} style={styles.uploadText}>Upload Image</Text></View>}
            </TouchableOpacity>
            {wrappedimage !== null ? (
                    <Image source={require('../Assets/pass.png')} style={styles.uploadStateButton}/>
                    ) : <Image source={require('../Assets/fail.png')} style={styles.uploadStateButton}/>}
        </View>
        <View style={{...styles.upload, marginTop:responsiveHeight(2)}}>
            <TouchableOpacity
                style={styles.uploadButton} 
                >                    
                    {unwrappedimage !== null ? (
                    <Image source={{ uri: unwrappedimage.uri }} style={styles.imageBox} resizeMode='cover' />
                    ) : <View style={styles.imageBox}><Text onPress={()=>selectImage(false)} style={styles.uploadText}>Upload Image</Text></View>}
            </TouchableOpacity>
            {unwrappedimage !== null ? (
                    <Image style={styles.uploadStateButton} source={require('../Assets/pass.png')}/>
                    ) : <Image style={styles.uploadStateButton} source={require('../Assets/fail.png')}/>}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={entergame}
            style={styles.commonButtonStyle}
            activeOpacity={0.5}
            >
            <Text style={styles.buttonTextStyle}>
                Enter game
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={{width: responsiveWidth(90)}}
            activeOpacity={0.5}
            >
                <Text style={styles.commontextGobackStyle}
                onPress={()=>{
                  navigation.navigate('Welcome')
                  }}
                >GO BACK
                </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    width: '90%',
    alignItems: 'center', 
    justifyContent: 'flex-start',
    marginVertical: responsiveHeight(2),
  },
  commonTextStyle: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Font_Awesome_5_Brands_Regular_400', 
    marginTop: responsiveHeight(2),  
  },
  uploadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    alignItems: 'center', 
    width: '100%',
    marginBottom: responsiveHeight(2),
  },
  upload: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButton: {
    width: responsiveWidth(36),
    height: responsiveWidth(36),
    borderRadius: responsiveWidth(3),
    borderColor: '#60c182',
    borderWidth: 2,
    overflow: 'hidden',
    marginLeft: responsiveWidth(10),
    marginRight: responsiveWidth(4),
  },
  imageBox: {
    width: '100%',
    height: '100%',
  },
  uploadText: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    color: '#60c182',
    fontSize: responsiveFontSize(2), 
  },
  uploadStateButton: {
    width: responsiveWidth(8), 
    height: responsiveWidth(8),
    borderRadius: responsiveWidth(0.5),
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
  commontextGobackStyle: {
    color: '#60c182',
    width: '100%',
    textAlign: 'right',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Font_Awesome_5_Brands_Regular_400',
    fontWeight: 'bold',
  },
  imageContainer: {
      width: 180,
      height: 180,
      marginBottom: 10,
      marginTop: 10,
      borderColor: '#60c182',
      borderWidth: 1,
      borderRadius: 20,
  },
});