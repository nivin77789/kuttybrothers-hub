import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAv0-UifUhUdpc8ElnhYzDt7qnQ6-vg4kw",
    authDomain: "kuttybrothers-42cd0.firebaseapp.com",
    databaseURL: "https://kuttybrothers-42cd0-default-rtdb.firebaseio.com",
    projectId: "kuttybrothers-42cd0",
    storageBucket: "kuttybrothers-42cd0.firebasestorage.app",
    messagingSenderId: "182972126726",
    appId: "1:182972126726:web:8e1947a654a171dd5a9587",
    measurementId: "G-2XLSV81E6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, db, analytics };
