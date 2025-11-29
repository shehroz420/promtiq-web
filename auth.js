import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {

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

  // Elements
  const loginOverlay = document.getElementById('loginOverlay');
  const chatBox = document.getElementById('chatBox');
  const chatInputArea = document.getElementById('chatInputArea');
  const loginBtn = document.getElementById('loginBtn');
  const errorMsg = document.getElementById('error');

  // Login button with auto-signup
  loginBtn.onclick = () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    // Validation
    if (!email || !pass) {
      errorMsg.style.color = '#ef4444';
      errorMsg.innerText = "Please fill in all fields";
      return;
    }

    if (!email.includes('@')) {
      errorMsg.style.color = '#ef4444';
      errorMsg.innerText = "Please enter a valid email";
      return;
    }

    if (pass.length < 6) {
      errorMsg.style.color = '#ef4444';
      errorMsg.innerText = "Password must be at least 6 characters";
      return;
    }

    // Disable button and show loading
    loginBtn.disabled = true;
    loginBtn.innerText = "Signing in...";
    errorMsg.innerText = "";

    // Try to login first
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        errorMsg.style.color = '#10b981';
        errorMsg.innerText = "Login successful!";
        loginOverlay.style.display = 'none';
        chatBox.style.display = 'block';
        chatInputArea.style.display = 'flex';
        loginBtn.disabled = false;
        loginBtn.innerText = "Sign In";
      })
      .catch(err => {
        // If user doesn't exist, create new account automatically
        if (err.code === 'auth/invalid-credential' || 
            err.code === 'auth/user-not-found' || 
            err.code === 'auth/wrong-password') {
          
          errorMsg.style.color = '#f59e0b';
          errorMsg.innerText = "User not found. Creating new account...";
          loginBtn.innerText = "Creating account...";
          
          // Auto signup
          createUserWithEmailAndPassword(auth, email, pass)
            .then(() => {
              errorMsg.style.color = '#10b981';
              errorMsg.innerText = "Account created successfully! Logging in...";
              
              setTimeout(() => {
                loginOverlay.style.display = 'none';
                chatBox.style.display = 'block';
                chatInputArea.style.display = 'flex';
                loginBtn.disabled = false;
                loginBtn.innerText = "Sign In";
              }, 1000);
            })
            .catch(signupErr => {
              errorMsg.style.color = '#ef4444';
              
              // Better error messages
              if (signupErr.code === 'auth/email-already-in-use') {
                errorMsg.innerText = "Email already exists. Please try logging in.";
              } else if (signupErr.code === 'auth/weak-password') {
                errorMsg.innerText = "Password is too weak. Use at least 6 characters.";
              } else if (signupErr.code === 'auth/invalid-email') {
                errorMsg.innerText = "Invalid email format.";
              } else {
                errorMsg.innerText = signupErr.message;
              }
              
              loginBtn.disabled = false;
              loginBtn.innerText = "Sign In";
            });
        } else {
          // Other errors
          errorMsg.style.color = '#ef4444';
          
          if (err.code === 'auth/invalid-email') {
            errorMsg.innerText = "Invalid email format";
          } else if (err.code === 'auth/network-request-failed') {
            errorMsg.innerText = "Network error. Check your connection.";
          } else {
            errorMsg.innerText = err.message;
          }
          
          loginBtn.disabled = false;
          loginBtn.innerText = "Sign In";
        }
      });
  };

  // Enter key support
  const passwordInput = document.getElementById('password');
  const emailInput = document.getElementById('email');
  
  if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        loginBtn.click();
      }
    });
  }
  
  if (emailInput) {
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        loginBtn.click();
      }
    });
  }

  // Auto show chat if already logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User logged in:', user.email);
      loginOverlay.style.display = 'none';
      chatBox.style.display = 'block';
      chatInputArea.style.display = 'flex';
    } else {
      console.log('No user logged in');
      loginOverlay.style.display = 'flex';
      chatBox.style.display = 'none';
      chatInputArea.style.display = 'none';
    }
  });

});
