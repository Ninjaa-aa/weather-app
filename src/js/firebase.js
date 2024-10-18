        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries
      
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
          apiKey: "AIzaSyAhjRvtdkSYmAs6L2rDNqQ8KoeOZdTpANc",
          authDomain: "nexus-weather-511.firebaseapp.com",
          projectId: "nexus-weather-511",
          storageBucket: "nexus-weather-511.appspot.com",
          messagingSenderId: "749467755630",
          appId: "1:749467755630:web:4c22c55c866549cfafb27f",
          measurementId: "G-M7J09Y3B8P"
        };
      
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);