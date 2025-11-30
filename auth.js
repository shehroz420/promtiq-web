import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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
  const googleProvider = new GoogleAuthProvider();

  // Elements
  const loginOverlay = document.getElementById('loginOverlay');
  const chatBox = document.getElementById('chatBox');
  const chatInputArea = document.getElementById('chatInputArea');
  const authBtn = document.getElementById('authBtn');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const menuLogout = document.getElementById('menuLogout');
  const userMenu = document.getElementById('userMenu');
  const menuUserEmail = document.getElementById('menuUserEmail');
  const errorMsg = document.getElementById('error');

  // Check if we're in login or signup mode
  function isLoginMode() {
    // Access global variable
    return window.isLoginMode !== false;
  }

  // Main Auth Button (Login/Signup)
  if (authBtn) {
    authBtn.onclick = () => {
      const email = document.getElementById("email").value;
      const pass = document.getElementById("password").value;
      const confirmPass = document.getElementById("confirmPassword")?.value;

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

      // If signup mode, check password confirmation
      if (!isLoginMode()) {
        if (!confirmPass) {
          errorMsg.style.color = '#ef4444';
          errorMsg.innerText = "Please confirm your password";
          return;
        }
        if (pass !== confirmPass) {
          errorMsg.style.color = '#ef4444';
          errorMsg.innerText = "Passwords do not match";
          return;
        }
      }

      // Disable button and show loading
      authBtn.disabled = true;
      const originalText = authBtn.innerText;
      authBtn.innerText = isLoginMode() ? "Signing in..." : "Creating account...";
      errorMsg.innerText = "";

      if (isLoginMode()) {
        // LOGIN MODE
        signInWithEmailAndPassword(auth, email, pass)
          .then(() => {
            errorMsg.style.color = '#10b981';
            errorMsg.innerText = "Login successful!";
            authBtn.disabled = false;
            authBtn.innerText = originalText;
          })
          .catch(err => {
            errorMsg.style.color = '#ef4444';
            
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
              errorMsg.innerText = "Invalid email or password. Try signing up instead.";
            } else if (err.code === 'auth/wrong-password') {
              errorMsg.innerText = "Incorrect password";
            } else if (err.code === 'auth/invalid-email') {
              errorMsg.innerText = "Invalid email format";
            } else if (err.code === 'auth/network-request-failed') {
              errorMsg.innerText = "Network error. Check your connection.";
            } else {
              errorMsg.innerText = err.message;
            }
            
            authBtn.disabled = false;
            authBtn.innerText = originalText;
          });
      } else {
        // SIGNUP MODE
        createUserWithEmailAndPassword(auth, email, pass)
          .then(() => {
            errorMsg.style.color = '#10b981';
            errorMsg.innerText = "Account created successfully!";
            
            setTimeout(() => {
              authBtn.disabled = false;
              authBtn.innerText = originalText;
            }, 1000);
          })
          .catch(err => {
            errorMsg.style.color = '#ef4444';
            
            if (err.code === 'auth/email-already-in-use') {
              errorMsg.innerText = "Email already exists. Please login instead.";
            } else if (err.code === 'auth/weak-password') {
              errorMsg.innerText = "Password is too weak. Use at least 6 characters.";
            } else if (err.code === 'auth/invalid-email') {
              errorMsg.innerText = "Invalid email format.";
            } else {
              errorMsg.innerText = err.message;
            }
            
            authBtn.disabled = false;
            authBtn.innerText = originalText;
          });
      }
    };
  }

  // Google Sign-In
  if (googleLoginBtn) {
    googleLoginBtn.onclick = () => {
      googleLoginBtn.disabled = true;
      googleLoginBtn.innerText = "Signing in with Google...";
      errorMsg.innerText = "";

      signInWithPopup(auth, googleProvider)
        .then((result) => {
          console.log('Google Sign-In successful:', result.user.email);
          errorMsg.style.color = '#10b981';
          errorMsg.innerText = "Login successful!";
          googleLoginBtn.disabled = false;
          googleLoginBtn.innerHTML = '<span style="font-size: 20px;">🔍</span> Sign in with Google';
        })
        .catch((error) => {
          console.error('Google Sign-In error:', error);
          errorMsg.style.color = '#ef4444';
          
          if (error.code === 'auth/popup-closed-by-user') {
            errorMsg.innerText = "Sign-in cancelled";
          } else if (error.code === 'auth/popup-blocked') {
            errorMsg.innerText = "Popup blocked. Please allow popups.";
          } else if (error.code === 'auth/unauthorized-domain') {
            errorMsg.innerText = "Domain not authorized. Contact support.";
          } else {
            errorMsg.innerText = error.message;
          }
          
          googleLoginBtn.disabled = false;
          googleLoginBtn.innerHTML = '<span style="font-size: 20px;">🔍</span> Sign in with Google';
        });
    };
  }

  // Logout functionality (from 3-dot menu)
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      signOut(auth)
        .then(() => {
          console.log('User logged out');
          // Close menu
          document.getElementById('menuDropdown')?.classList.remove('show');
        })
        .catch((error) => {
          console.error('Logout error:', error);
          alert('Error logging out. Please try again.');
        });
    }
  };

  if (menuLogout) {
    menuLogout.onclick = handleLogout;
  }

  // Enter key support
  const passwordInput = document.getElementById('password');
  const emailInput = document.getElementById('email');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  [passwordInput, emailInput, confirmPasswordInput].forEach(input => {
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          authBtn?.click();
        }
      });
    }
  });

  // Auto show chat if already logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User logged in:', user.email);
      
      // Update menu with user email
      if (menuUserEmail) {
        menuUserEmail.innerText = user.email;
      }
      
      // Show/hide appropriate elements
      loginOverlay.style.display = 'none';
      if (chatBox) chatBox.style.display = 'block';
      if (chatInputArea) chatInputArea.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'block';
    } else {
      console.log('No user logged in');
      
      // Show/hide appropriate elements
      loginOverlay.style.display = 'flex';
      if (chatBox) chatBox.style.display = 'none';
      if (chatInputArea) chatInputArea.style.display = 'none';
      if (userMenu) userMenu.style.display = 'none';
    }
  });

});
