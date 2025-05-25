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

// Initialiseer Firebase als het beschikbaar is
let firebaseInitialized = false;
try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    firebaseInitialized = true;
    console.log("Firebase succesvol geïnitialiseerd");
  } else {
    console.warn("Firebase is niet beschikbaar");
  }
} catch (error) {
  console.error("Firebase initialisatie fout:", error);
}

// Database referentie
let database = null;
if (firebaseInitialized) {
  database = firebase.database();
  
  // Test database connectie
  database.ref('.info/connected').on('value', (snapshot) => {
    const connected = snapshot.val();
    if (connected) {
      console.log("Verbonden met Firebase database");
    } else {
      console.log("Niet verbonden met Firebase database");
    }
  });
}

// Eenvoudige localStorage helpers
const localStorageHelpers = {
  saveData: function(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Fout bij opslaan in localStorage:", e);
      return false;
    }
  },
  
  getData: function(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Fout bij ophalen uit localStorage:", e);
      return null;
    }
  },
  
  // Specifieke helpers voor likes en deelnemers
  saveLikes: function(likes) {
    return this.saveData('festival_likes', likes);
  },
  
  getLikes: function() {
    return this.getData('festival_likes') || {};
  },
  
  saveParticipant: function(activityId, name) {
    let participants = this.getParticipants(activityId) || [];
    participants.push({
      name: name,
      timestamp: new Date().getTime()
    });
    
    let allParticipants = this.getData('festival_participants') || {};
    allParticipants[activityId] = participants;
    return this.saveData('festival_participants', allParticipants);
  },
  
  getParticipants: function(activityId) {
    const allParticipants = this.getData('festival_participants') || {};
    return allParticipants[activityId] || [];
  },
  
  getAllParticipants: function() {
    return this.getData('festival_participants') || {};
  }
};

// Exporteer voor gebruik in script.js
window.festivalStorage = {
  firebase: {
    initialized: firebaseInitialized,
    database: database
  },
  local: localStorageHelpers
};
