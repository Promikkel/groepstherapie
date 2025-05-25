// Firebase configuratie
const firebaseConfig = {
  apiKey: "AIzaSyDQzdf_uKOJMghXvYrQJgv-GjmUJd1Ihs8",
  authDomain: "groepstherapie-festival.firebaseapp.com",
  projectId: "groepstherapie-festival",
  storageBucket: "groepstherapie-festival.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
  databaseURL: "https://groepstherapie-festival-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialiseer Firebase
firebase.initializeApp(firebaseConfig);

// Database referentie
const database = firebase.database();
