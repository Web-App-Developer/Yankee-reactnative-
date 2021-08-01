import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyD6cGNVmJMIAuaYH2I2z_EGyzg1NGQA-oI',
    databaseURL: 'https://yankeeswap-37db8.firebaseio.com/',
    projectId: 'yankeeswap-37db8',
    // appId: '1:945462148042:android:0f22c7b20d1a13d1be2d33',
    appId: '1:945462148042:android:a9ee709347459a96be2d33',
    storageBucket: 'gs://yankeeswap-37db8.appspot.com',  
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const db = app.database();