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

  document.getElementById('authBtn')?.addEventListener('click', async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const confirmPass = document.getElementById("confirmPassword")?.value;
    const errorMsg = document.getElementById('error');
    const authBtn = document.getElementById('authBtn');

    errorMsg.innerText = "";

    if (!email || !pass) {
      errorMsg.innerText = "Please fill in all fields";
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
      } else {
        await createUserWithEmailAndPassword(auth, email, pass);
      }
      errorMsg.style.color = '#10b981';
      errorMsg.innerText = isLoginMode ? "Login successful!" : "Account created!";
    } catch (err) {
      errorMsg.style.color = '#ef4444';
      if (err.code === 'auth/invalid-credential') {
        errorMsg.innerText = "Invalid email or password";
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg.innerText = "Email already exists";
      } else {
        errorMsg.innerText = err.message;
      }
    } finally {
      authBtn.disabled = false;
      authBtn.innerText = isLoginMode ? "Sign In" : "Create Account";
    }
  });

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
      errorMsg.innerText = err.message;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span style="font-size: 20px;">🔍</span> Sign in with Google';
    }
  });

  document.getElementById('menuTrigger')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('userMenuDropdown')?.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    document.getElementById('userMenuDropdown')?.classList.remove('show');
  });

  document.getElementById('optionLogout')?.addEventListener('click', async () => {
    document.getElementById('userMenuDropdown')?.classList.remove('show');
    if (confirm('Logout?')) {
      await signOut(auth);
    }
  });

  window.openSettings = () => {
    document.getElementById('userMenuDropdown')?.classList.remove('show');
    document.getElementById('settingsModal')?.classList.add('show');
    if (auth.currentUser) {
      document.getElementById('settingsEmail').innerText = auth.currentUser.email;
    }
    loadSavedSettings();
  };

  window.closeSettingsModal = () => {
    document.getElementById('settingsModal')?.classList.remove('show');
  };

  window.openProfile = () => {
    document.getElementById('userMenuDropdown')?.classList.remove('show');
    document.getElementById('profileModal')?.classList.add('show');
    if (auth.currentUser) {
      const email = auth.currentUser.email;
      document.getElementById('profileUserEmail').innerText = email;
      document.getElementById('profileAvatarLarge').innerText = email.charAt(0).toUpperCase();
      const msgCount = localStorage.getItem('zenovaai_messageCount') || '0';
      document.getElementById('totalMessages').innerText = msgCount;
    }
  };

  window.closeProfileModal = () => {
    document.getElementById('profileModal')?.classList.remove('show');
  };

  window.toggleDarkMode = () => {
    document.getElementById('darkModeToggle')?.classList.toggle('active');
  };

  window.toggleCompactMode = () => {
    document.getElementById('compactToggle')?.classList.toggle('active');
  };

  window.toggleNotifications = () => {
    document.getElementById('notificationsToggle')?.classList.toggle('active');
  };

  window.toggleSound = () => {
    document.getElementById('soundToggle')?.classList.toggle('active');
  };

  window.toggleAnalytics = () => {
    document.getElementById('analyticsToggle')?.classList.toggle('active');
  };

  window.clearAllData = () => {
    if (confirm('⚠️ Delete all data?')) {
      if (confirm('Cannot be undone. Confirm?')) {
        localStorage.clear();
        alert('All data cleared!');
        location.reload();
      }
    }
  };

  function loadSavedSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem('app_settings') || '{}');
      if (settings.darkMode) document.getElementById('darkModeToggle')?.classList.add('active');
      if (settings.compact) document.getElementById('compactToggle')?.classList.add('active');
    } catch(e) {}
  }

  function saveSettings() {
    const settings = {
      darkMode: document.getElementById('darkModeToggle')?.classList.contains('active'),
      compact: document.getElementById('compactToggle')?.classList.contains('active'),
      notifications: document.getElementById('notificationsToggle')?.classList.contains('active'),
      sound: document.getElementById('soundToggle')?.classList.contains('active'),
      analytics: document.getElementById('analyticsToggle')?.classList.contains('active')
    };
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }

  document.getElementById('closeSettings')?.addEventListener('click', closeSettingsModal);
  document.getElementById('cancelSettings')?.addEventListener('click', closeSettingsModal);
  document.getElementById('saveSettings')?.addEventListener('click', () => {
    saveSettings();
    closeSettingsModal();
    alert('Settings saved!');
  });

  document.getElementById('closeProfile')?.addEventListener('click', closeProfileModal);
  document.getElementById('closeProfileBtn')?.addEventListener('click', closeProfileModal);

  document.getElementById('settingsModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'settingsModal') closeSettingsModal();
  });

  document.getElementById('profileModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'profileModal') closeProfileModal();
  });

  document.getElementById('optionProfile')?.addEventListener('click', openProfile);
  document.getElementById('optionSettings')?.addEventListener('click', openSettings);

  ['email', 'password', 'confirmPassword'].forEach(id => {
    document.getElementById(id)?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('authBtn')?.click();
      }
    });
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById('loginOverlay').style.display = 'none';
      document.getElementById('chatBox').style.display = 'block';
      document.getElementById('chatInputArea').style.display = 'flex';
      document.getElementById('userMenuContainer').style.display = 'block';
      document.getElementById('displayUserEmail').innerText = user.email;
    } else {
      document.getElementById('loginOverlay').style.display = 'flex';
      document.getElementById('chatBox').style.display = 'none';
      document.getElementById('chatInputArea').style.display = 'none';
      document.getElementById('userMenuContainer').style.display = 'none';
    }
  });
});
