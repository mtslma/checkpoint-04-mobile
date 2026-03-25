import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore,collection, addDoc } from "firebase/firestore";

const{getReactNativePersistence} = require("firebase/auth") as any

const firebaseConfig = {
  apiKey: "AIzaSyD3R6GfQMu4ZkRFkMJl4zsyECk-Qc6u4WQ",
  authDomain: "checkpoint-04.firebaseapp.com",
  projectId: "checkpoint-04",
  storageBucket: "checkpoint-04.firebasestorage.app",
  messagingSenderId: "161262495406",
  appId: "1:161262495406:web:84fa0e59585332477baf3f"
};

const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication
export const auth = initializeAuth(app,{
  persistence: getReactNativePersistence(AsyncStorage)
});

// Config Firestore
const db = getFirestore(app)

export {db,collection,addDoc}


