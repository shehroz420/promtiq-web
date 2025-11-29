// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔹 Elements
const loginOverlay = document.getElementById('loginOverlay');
const chatBox = document.getElementById('chatBox');
const chatInputArea = document.getElementById('chatInputArea');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('error');

// 🔹 Hide chat interface initially
chatBox.style.display = 'none';
chatInputArea.style.display = 'none';

// 🔹 Login Button Click
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;

  if (!email || !pass) {
    errorMsg.innerText = "Please enter email and password";
    return;
  }

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      // Hide login overlay
      loginOverlay.style.display = 'none';
      // Show chat interface
      chatBox.style.display = 'block';
      chatInputArea.style.display = 'flex';
      errorMsg.innerText = '';
    })
    .catch(err => {
      errorMsg.innerText = err.message;
    });
});

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
