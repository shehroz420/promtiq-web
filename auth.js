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

let isLoginMode = true;

window.addEventListener('load', () => {
  
  // Toggle Login/Signup
  document.getElementById('loginToggle')?.addEventListener('click', () => {
    isLoginMode = true;
    document.getElementById('loginToggle').classList.add('active');
    document.getElementById('signupToggle').classList.remove('active');
    document.getElementById('authTitle').innerText = 'Welcome Back!';
    document.getElementById('authSubtitle').innerText = 'Please login to access your account';
    document.getElementById('authBtn').innerText = 'Sign In';
    document.getElementById('confirmPasswordGroup').style.display = 'none';
    document.getElementById('error').innerText = '';
  });

  document.getElementById('signupToggle')?.addEventListener('click', () => {
    isLoginMode = false;
    document.getElementById('loginToggle').classList.remove('active');
    document.getElementById('signupToggle').classList.add('active');
    document.getElementById('authTitle').innerText = 'Create Account';
    document.getElementById('authSubtitle').innerText = 'Sign up to get started';
    document.getElementById('authBtn').innerText = 'Create Account';
    document.getElementById('confirmPasswordGroup').style.display = 'block';
    document.getElementById('error').innerText = '';
  });

  // Auth Button (Login/Signup)
  document.getElementById('authBtn')?.addEventListener('click', async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const confirmPass = document.getElementById("confirmPassword")?.value;
    const errorMsg = document.getElementById('error');
    const authBtn = document.getElementById('authBtn');

    errorMsg.innerText = "";
    errorMsg.style.color = '#ef4444';

    if (!email || !pass) {
      errorMsg.innerText = "Please fill in all fields";
      return;
    }

    if (!email.includes('@')) {
      errorMsg.innerText = "Invalid email format";
      return;
    }

    if (pass.length < 6) {
      errorMsg.innerText = "Password must be at least 6 characters";
      return;
    }

    if (!isLoginMode && pass !== confirmPass) {
      errorMsg.innerText = "Passwords do not match";
      return;
    }

    authBtn.disabled = true;
    authBtn.innerText = isLoginMode ? "Signing in..." : "Creating account...";

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, pass);
        errorMsg.style.color = '#10b981';
        errorMsg.innerText = "Login successful!";
      } else {
        await createUserWithEmailAndPassword(auth, email, pass);
        errorMsg.style.color = '#10b981';
        errorMsg.innerText = "Account created!";
      }
    } catch (err) {
      errorMsg.style.color = '#ef4444';
      if (err.code === 'auth/invalid-credential') {
        errorMsg.innerText = "Invalid email or password";
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg.innerText = "Email already exists. Try login.";
      } else if (err.code === 'auth/weak-password') {
        errorMsg.innerText = "Password too weak";
      } else {
        errorMsg.innerText = err.message;
      }
    } finally {
      authBtn.disabled = false;
      authBtn.innerText = isLoginMode ? "Sign In" : "Create Account";
    }
  });

  // Google Sign-In
  document.getElementById('googleLoginBtn')?.addEventListener('click', async () => {
    const btn = document.getElementById('googleLoginBtn');
    const errorMsg = document.getElementById('error');
    
    btn.disabled = true;
    btn.innerText = "Signing in...";

    try {
      await signInWithPopup(auth, googleProvider);
      errorMsg.style.color = '#10b981';
      errorMsg.innerText = "Login successful!";
    } catch (err) {
      errorMsg.style.color = '#ef4444';
      if (err.code === 'auth/unauthorized-domain') {
        errorMsg.innerText = "Add domain to Firebase";
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMsg.innerText = "Sign-in cancelled";
      } else {
        errorMsg.innerText = err.message;
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span style="font-size: 20px;">🔍</span> Sign in with Google';
    }
  });

  // 3-Dot Menu Toggle
  document.getElementById('menuButton')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('menuDropdown').classList.toggle('show');
  });

  // Close menu on outside click
  document.addEventListener('click', () => {
    document.getElementById('menuDropdown')?.classList.remove('show');
  });

  // Logout
  document.getElementById('menuLogout')?.addEventListener('click', async () => {
    document.getElementById('menuDropdown')?.classList.remove('show');
    if (confirm('Are you sure you want to logout?')) {
      await signOut(auth);
    }
  });

  // Profile
  document.getElementById('menuProfile')?.addEventListener('click', () => {
    document.getElementById('menuDropdown')?.classList.remove('show');
    const email = auth.currentUser?.email || 'Not logged in';
    alert('Profile\n\nEmail: ' + email);
  });

  // Settings
  document.getElementById('menuSettings')?.addEventListener('click', () => {
    document.getElementById('menuDropdown')?.classList.remove('show');
    alert('Settings feature coming soon!');
  });

  // Enter key support
  ['email', 'password', 'confirmPassword'].forEach(id => {
    document.getElementById(id)?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('authBtn')?.click();
      }
    });
  });

  // Auth State Observer
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User logged in
      document.getElementById('loginOverlay').style.display = 'none';
      document.getElementById('chatBox').style.display = 'block';
      document.getElementById('chatInputArea').style.display = 'flex';
      document.getElementById('userMenu').style.display = 'block';
      document.getElementById('menuUserEmail').innerText = user.email;
    } else {
      // User logged out
      document.getElementById('loginOverlay').style.display = 'flex';
      document.getElementById('chatBox').style.display = 'none';
      document.getElementById('chatInputArea').style.display = 'none';
      document.getElementById('userMenu').style.display = 'none';
    }
  });
});
