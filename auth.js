// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  // 🔹 Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyCnstr_3cL6sxlLdUMixynmjXuX_fKQRRQ",
    authDomain: "zenova-ai-fe0e7.firebaseapp.com",
    projectId: "zenova-ai-fe0e7",
    storageBucket: "zenova-ai-fe0e7.firebasestorage.app",
    messagingSenderId: "151247656044",
    appId: "1:151247656044:web:8f012ff74fc8e2af77f449",
    measurementId: "G-RM6Y9C473E"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // 🔹 DOM Elements
  const loginOverlay = document.getElementById('loginOverlay');
  const chatBox = document.getElementById('chatBox');
  const chatInputArea = document.getElementById('chatInputArea');
  const loginBtn = document.getElementById('loginBtn');
  const errorMsg = document.getElementById('error');

  // 🔹 Login Button Click
  loginBtn.onclick = () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        loginOverlay.style.display = 'none';
        chatBox.style.display = 'block';
        chatInputArea.style.display = 'flex';
      })
      .catch(err => {
        errorMsg.innerText = err.message;
      });
  };

  // 🔹 Auto Show Chat if Already Logged In
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginOverlay.style.display = 'none';
      chatBox.style.display = 'block';
      chatInputArea.style.display = 'flex';
    } else {
      loginOverlay.style.display = 'flex';
      chatBox.style.display = 'none';
      chatInputArea.style.display = 'none';
    }
  });
});
