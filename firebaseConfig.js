// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { getDatabase, set, ref, child, get, update } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyByD7Dozsal9ez6J05EptJB3zede_pdPFU",
    authDomain: "projectjs-1b467.firebaseapp.com",
    projectId: "projectjs-1b467",
    storageBucket: "projectjs-1b467.appspot.com",
    messagingSenderId: "690005068957",
    appId: "1:690005068957:web:dfc33e04d7e39a07ba5874",
    measurementId: "G-P32FY5STV3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(getDatabase());
const auth = getAuth();

export {db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, set, ref, get, child, dbRef, onAuthStateChanged, update};