// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYjCppDEyjLSZKaD25emuNnXJ_EOhoSXU",
  authDomain: "week6otp.firebaseapp.com",
  projectId: "week6otp",
  storageBucket: "week6otp.appspot.com",
  messagingSenderId: "537346007616",
  appId: "1:537346007616:web:e43259df9e1051f45075a5",
  measurementId: "G-2721QPRWSZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let auth = firebase.auth();

export { auth, firebase };