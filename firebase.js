/* eslint-disable */
const {initializeApp, cert} = require('firebase/app');
const {getFirestore} = require('firebase/firestore');

const serviceAccount = require('./cred.json');

initializeApp({
    credential: cert(serviceAccount),
});

export const db = getFirestore();

module.exports = {db};


/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6yjl-uC9_WDddtgV1SRFpq1sfXVA5SMw",
  authDomain: "csm-database-90579.firebaseapp.com",
  projectId: "csm-database-90579",
  storageBucket: "csm-database-90579.appspot.com",
  messagingSenderId: "800831998712",
  appId: "1:800831998712:web:19be04b3acb9e4d2b3c90d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
*/