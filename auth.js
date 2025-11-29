// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Firebase Web config
const firebaseConfig = {
  apiKey: "AIzaSyCnstr_3cL6sxlLdUMixynmjXuX_fKQRRQ",
  authDomain: "zenova-ai-fe0e7.firebaseapp.com",
  projectId: "zenova-ai-fe0e7",
  storageBucket: "zenova-ai-fe0e7.firebasestorage.app",
  messagingSenderId: "151247656044",
  appId: "1:151247656044:web:8f012ff74fc8e2af77f449",
  measurementId: "G-RM6Y9C473E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Login Button Logic
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.onclick = () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        window.location.href = "dashboard.html";
      })
      .catch((err) => {
        document.getElementById("error").innerText = err.message;
      });
  };
}

export { onAuthStateChanged, signOut };
