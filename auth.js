// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// 🔹 Your Firebase Web App Config
const firebaseConfig = {
  apiKey: "AIzaSyCnstr_3cL6sxlLdUMixynmjXuX_fKQRRQ",
  authDomain: "zenova-ai-fe0e7.firebaseapp.com",
  projectId: "zenova-ai-fe0e7",
  storageBucket: "zenova-ai-fe0e7.firebasestorage.app",
  messagingSenderId: "151247656044",
  appId: "1:151247656044:web:8f012ff74fc8e2af77f449",
  measurementId: "G-RM6Y9C473E"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔹 Login Button Click
const loginBtn = document.getElementById("loginBtn");
loginBtn.onclick = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      // Hide login overlay
      document.querySelector('.login-container').style.display = 'none';
      
      // Show chat interface
      document.getElementById('chatBox').style.display = 'block';
      document.getElementById('chatInputArea').style.display = 'flex';
    })
    .catch(err => {
      document.getElementById("error").innerText = err.message;
    });
};

// 🔹 Auto Show Chat if Already Logged In
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.querySelector('.login-container').style.display = 'none';
    document.getElementById('chatBox').style.display = 'block';
    document.getElementById('chatInputArea').style.display = 'flex';
  } else {
    document.querySelector('.login-container').style.display = 'flex';
    document.getElementById('chatBox').style.display = 'none';
    document.getElementById('chatInputArea').style.display = 'none';
  }
});
