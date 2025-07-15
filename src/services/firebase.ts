// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzKW1AT9IhpzlWSMFn83T4tKNk4udIToM",
  authDomain: "anamneseai-e8f51.firebaseapp.com",
  projectId: "anamneseai-e8f51",
  storageBucket: "anamneseai-e8f51.appspot.com",
  messagingSenderId: "832679115393",
  appId: "1:832679115393:web:98d40cc1437757ed91eb80",
  measurementId: "G-71HDQV7GJY",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
