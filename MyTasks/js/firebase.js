// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAKxiNueFVz8kngTSWkEbTy5FmwXbjqODk",
  authDomain: "mytaks-e6fc3.firebaseapp.com",
  databaseURL: "https://mytaks-e6fc3-default-rtdb.firebaseio.com",
  projectId: "mytaks-e6fc3",
  storageBucket: "mytaks-e6fc3.firebasestorage.app",
  messagingSenderId: "820691613608",
  appId: "1:820691613608:web:c9be90f738c2f7602fcf9d",
  measurementId: "G-4JL9RX1THV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
