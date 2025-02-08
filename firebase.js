// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrVmCaSlOdtZjbWU7QgkkUBjiKDgzPPpE",
  authDomain: "laundnet.firebaseapp.com",
  databaseURL: "https://laundnet-default-rtdb.firebaseio.com",
  projectId: "laundnet",
  storageBucket: "laundnet.firebasestorage.app",
  messagingSenderId: "709661150073",
  appId: "1:709661150073:web:e711d8319e7ad14a93bda8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
