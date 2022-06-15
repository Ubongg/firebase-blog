// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA12u3053h7gOHQ1h8pgdl_nNRKx9sP1A0",
  authDomain: "fir-blog-71d14.firebaseapp.com",
  projectId: "fir-blog-71d14",
  storageBucket: "fir-blog-71d14.appspot.com",
  messagingSenderId: "1033211122198",
  appId: "1:1033211122198:web:3470d713d9236bebc11b37",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
