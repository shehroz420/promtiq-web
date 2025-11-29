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
  const loginBtn = document.getElementById('loginBtn');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const headerLogoutBtn = document.getElementById('headerLogoutBtn');
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const errorMsg = document.getElementById('error');

  // Email/Password Login
  if (loginBtn) {
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
                  loginBtn.disabled = false;
                  loginBtn.innerText = "Sign In";
                }, 1000);
              })
              .catch(signupErr => {
                errorMsg.style.color = '#ef4444';
                
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
          } else {
            errorMsg.innerText = error.message;
          }
          
          googleLoginBtn.disabled = false;
          googleLoginBtn.innerHTML = '<span style="font-size: 20px;">🔍</span> Sign in with Google';
        });
    };
  }

  // Logout functionality (both buttons)
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      signOut(auth)
        .then(() => {
          console.log('User logged out');
        })
        .catch((error) => {
          console.error('Logout error:', error);
          alert('Error logging out. Please try again.');
        });
    }
  };

  if (logoutBtn) {
    logoutBtn.onclick = handleLogout;
  }

  if (headerLogoutBtn) {
    headerLogoutBtn.onclick = handleLogout;
  }

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
      
      // Show user info
      if (userEmailDisplay) {
        userEmailDisplay.innerText = user.email;
        userEmailDisplay.style.display = 'block';
      }
      
      // Show/hide appropriate elements
      loginOverlay.style.display = 'none';
      if (chatBox) chatBox.style.display = 'block';
      if (chatInputArea) chatInputArea.style.display = 'flex';
      if (logoutBtn) logoutBtn.style.display = 'block';
      if (headerLogoutBtn) headerLogoutBtn.style.display = 'block';
    } else {
      console.log('No user logged in');
      
      // Hide user info
      if (userEmailDisplay) {
        userEmailDisplay.style.display = 'none';
      }
      
      // Show/hide appropriate elements
      loginOverlay.style.display = 'flex';
      if (chatBox) chatBox.style.display = 'none';
      if (chatInputArea) chatInputArea.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (headerLogoutBtn) headerLogoutBtn.style.display = 'none';
    }
  });

});
