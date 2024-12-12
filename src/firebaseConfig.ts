// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiEmjLu0uKQRonP06WzKOQuv4CNmWZ2Ro",
  authDomain: "mathtestreact.firebaseapp.com",
  projectId: "mathtestreact",
  storageBucket: "mathtestreact.appspot.com",
  messagingSenderId: "819677490375",
  appId: "1:819677490375:web:a2638acb8fc177d0ed22e2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
