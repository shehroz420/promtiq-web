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

// Initialize Firebase IMMEDIATELY
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

console.log('Firebase initialized successfully!');

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, attaching auth handlers...');

  // Get elements
  const loginOverlay = document.getElementById('loginOverlay');
  const chatBox = document.getElementById('chatBox');
  const chatInputArea = document.getElementById('chatInputArea');
  const authBtn = document.getElementById('authBtn');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const menuLogout = document.getElementById('menuLogout');
  const userMenu = document.getElementById('userMenu');
  const menuUserEmail = document.getElementById('menuUserEmail');
  const errorMsg = document.getElementById('error');

  console.log('Elements found:', {
    authBtn: !!authBtn,
    googleLoginBtn: !!googleLoginBtn,
    errorMsg: !!errorMsg
  });

  // Check if we're in login or signup mode
  function isLoginMode() {
    return window.isLoginMode !== false;
  }

  // Main Auth Button Handler (Login/Signup)
  if (authBtn) {
    console.log('Attaching auth button handler...');
    
    authBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      console.log('Auth button clicked!');
      
      const email = document.getElementById("email")?.value;
      const pass = document.getElementById("password")?.value;
      const confirmPass = document.getElementById("confirmPassword")?.value;

      console.log('Form values:', { email: !!email, pass: !!pass });

      // Clear previous error
      if (errorMsg) {
        errorMsg.innerText = "";
        errorMsg.style.color = '#ef4444';
      }

      // Validation
      if (!email || !pass) {
        if (errorMsg) errorMsg.innerText = "Please fill in all fields";
        console.log('Validation failed: empty fields');
        return;
      }

      if (!email.includes('@')) {
        if (errorMsg) errorMsg.innerText = "Please enter a valid email";
        console.log('Validation failed: invalid email');
        return;
      }

      if (pass.length < 6) {
        if (errorMsg) errorMsg.innerText = "Password must be at least 6 characters";
        console.log('Validation failed: password too short');
        return;
      }

      // If signup mode, check password confirmation
      if (!isLoginMode()) {
        if (!confirmPass) {
          if (errorMsg) errorMsg.innerText = "Please confirm your password";
          return;
        }
        if (pass !== confirmPass) {
          if (errorMsg) errorMsg.innerText = "Passwords do not match";
          return;
        }
      }

      // Disable button
      authBtn.disabled = true;
      const originalText = authBtn.innerText;
      authBtn.innerText = isLoginMode() ? "Signing in..." : "Creating account...";

      console.log('Attempting auth...', isLoginMode() ? 'LOGIN' : 'SIGNUP');

      try {
        if (isLoginMode()) {
          // LOGIN MODE
          console.log('Trying to login...');
          await signInWithEmailAndPassword(auth, email, pass);
          
          if (errorMsg) {
            errorMsg.style.color = '#10b981';
            errorMsg.innerText = "Login successful!";
          }
          console.log('Login successful!');
          
        } else {
          // SIGNUP MODE
          console.log('Trying to create account...');
          await createUserWithEmailAndPassword(auth, email, pass);
          
          if (errorMsg) {
            errorMsg.style.color = '#10b981';
            errorMsg.innerText = "Account created successfully!";
          }
          console.log('Account created successfully!');
        }
      } catch (err) {
        console.error('Auth error:', err.code, err.message);
        
        if (errorMsg) {
          errorMsg.style.color = '#ef4444';
          
          if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
            errorMsg.innerText = "Invalid email or password. Try signing up instead.";
          } else if (err.code === 'auth/wrong-password') {
            errorMsg.innerText = "Incorrect password";
          } else if (err.code === 'auth/email-already-in-use') {
            errorMsg.innerText = "Email already exists. Please login instead.";
          } else if (err.code === 'auth/weak-password') {
            errorMsg.innerText = "Password is too weak. Use at least 6 characters.";
          } else if (err.code === 'auth/invalid-email') {
            errorMsg.innerText = "Invalid email format";
          } else if (err.code === 'auth/network-request-failed') {
            errorMsg.innerText = "Network error. Check your connection.";
          } else {
            errorMsg.innerText = err.message;
          }
        }
      } finally {
        authBtn.disabled = false;
        authBtn.innerText = originalText;
      }
    });
    
    console.log('Auth button handler attached successfully!');
  } else {
    console.error('Auth button not found!');
  }

  // Google Sign-In Handler
  if (googleLoginBtn) {
    console.log('Attaching Google login handler...');
    
    googleLoginBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      console.log('Google login button clicked!');
      
      googleLoginBtn.disabled = true;
      googleLoginBtn.innerText = "Signing in with Google...";
      if (errorMsg) errorMsg.innerText = "";

      try {
        console.log('Opening Google popup...');
        const result = await signInWithPopup(auth, googleProvider);
        
        console.log('Google Sign-In successful:', result.user.email);
        
        if (errorMsg) {
          errorMsg.style.color = '#10b981';
          errorMsg.innerText = "Login successful!";
        }
        
      } catch (error) {
        console.error('Google Sign-In error:', error.code, error.message);
        
        if (errorMsg) {
          errorMsg.style.color = '#ef4444';
          
          if (error.code === 'auth/popup-closed-by-user') {
            errorMsg.innerText = "Sign-in cancelled";
          } else if (error.code === 'auth/popup-blocked') {
            errorMsg.innerText = "Popup blocked. Please allow popups.";
          } else if (error.code === 'auth/unauthorized-domain') {
            errorMsg.innerText = "Domain not authorized. Add domain to Firebase.";
          } else {
            errorMsg.innerText = error.message;
          }
        }
      } finally {
        googleLoginBtn.disabled = false;
        googleLoginBtn.innerHTML = '<span style="font-size: 20px;">🔍</span> Sign in with Google';
      }
    });
    
    console.log('Google login handler attached successfully!');
  } else {
    console.error('Google login button not found!');
  }

  // Logout Handler
  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await signOut(auth);
        console.log('User logged out successfully');
        
        // Close menu
        const menuDropdown = document.getElementById('menuDropdown');
        if (menuDropdown) menuDropdown.classList.remove('show');
        
      } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
      }
    }
  };

  if (menuLogout) {
    menuLogout.addEventListener('click', handleLogout);
    console.log('Logout handler attached!');
  }

  // Enter key support for all inputs
  const inputs = ['email', 'password', 'confirmPassword'];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          authBtn?.click();
        }
      });
    }
  });
  
  console.log('Enter key handlers attached!');

  // Auth State Observer
  onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user ? user.email : 'No user');
    
    if (user) {
      // User is logged in
      console.log('User logged in:', user.email);
      
      // Update menu with user email
      if (menuUserEmail) {
        menuUserEmail.innerText = user.email;
      }
      
      // Show/hide appropriate elements
      if (loginOverlay) loginOverlay.style.display = 'none';
      if (chatBox) chatBox.style.display = 'block';
      if (chatInputArea) chatInputArea.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'block';
      
    } else {
      // User is logged out
      console.log('No user logged in');
      
      // Show/hide appropriate elements
      if (loginOverlay) loginOverlay.style.display = 'flex';
      if (chatBox) chatBox.style.display = 'none';
      if (chatInputArea) chatInputArea.style.display = 'none';
      if (userMenu) userMenu.style.display = 'none';
    }
  });

  console.log('Auth initialization complete!');
});
