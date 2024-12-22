// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXavBtzojBFKjbRMvcxfJGRZL2qa8Aio4",
    authDomain: "joyful-ageing.firebaseapp.com",
    projectId: "joyful-ageing",
    storageBucket: "joyful-ageing.appspot.com",
    messagingSenderId: "175436116740",
    appId: "1:175436116740:web:40564ff73c99237c27d651"
};

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);
const db = getFirestore(firebase_app)

export { db };