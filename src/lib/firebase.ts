// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5RC82To6aK1xjhbCfPib1ESS525CUFqQ",
  authDomain: "ecommerce-next-5f188.firebaseapp.com",
  projectId: "ecommerce-next-5f188",
  storageBucket: "ecommerce-next-5f188.appspot.com",
  messagingSenderId: "869889245223",
  appId: "1:869889245223:web:94e862a3530adbc61e4e02"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
