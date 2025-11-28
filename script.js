// Your original webhook - NOT CHANGED
const WEBHOOK_URL = "https://shehroz910.app.n8n.cloud/webhook/c895789f-aa80-4df3-b3bd-ac4acf3608ff";

// Track if first message to remove welcome screen
let isFirstMessage = true;

// 🧠 MEMORY SYSTEM - NEW
let conversationHistory = [];
const MEMORY_KEY = 'zenovaai_memory';
const MAX_HISTORY = 50;

// 🧠 Load saved conversations on page load - NEW
function loadMemory() {
  try {
    const saved = localStorage.getItem(MEMORY_KEY);
    if (saved) {
      conversationHistory = JSON.parse(saved);
      
      // Restore messages to UI
      conversationHistory.forEach(msg => {
        const box = document.getElementById('chatBox');
        const div = document.createElement('div');
        div.className = `msg ${msg.sender}`;
        div.innerText = msg.text;
        box.appendChild(div);
      });
      
      // Hide welcome if messages exist
      if (conversationHistory.length > 0) {
        isFirstMessage = false;
        const welcome = document.getElementById('welcomeMessage');
        const suggestions = document.getElementById('suggestions');
        if (welcome) welcome.remove();
        if (suggestions) suggestions.remove();
      }
      
      // Scroll to bottom
      const box = document.getElementById('chatBox');
      box.scrollTop = box.scrollHeight;
    }
  } catch (err) {
    console.error('Memory load error:', err);
  }
}

// 🧠 Save conversation to memory - NEW
function saveToMemory(text, sender) {
  conversationHistory.push({
    text: text,
    sender: sender,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 50 messages
  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory = conversationHistory.slice(-MAX_HISTORY);
  }
  
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(conversationHistory));
  } catch (err) {
    console.error('Memory save error:', err);
  }
}

// Your original addMessage function - SLIGHTLY MODIFIED
function addMessage(text, sender) {
  const box = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.className = `msg ${sender}`;
  div.innerText = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  
  // 🧠 Save to memory - NEW LINE
  saveToMemory(text, sender);
}

// Your original sendMessage with minimal additions
async function sendMessage() {
  const input = document.getElementById('userInput');
  const msg = input.value.trim();
  if (!msg) return;

  // Remove welcome message on first send
  if (isFirstMessage) {
    const welcome = document.getElementById('welcomeMessage');
    const suggestions = document.getElementById('suggestions');
    if (welcome) welcome.remove();
    if (suggestions) suggestions.remove();
    isFirstMessage = false;
  }

  addMessage(msg, 'user');
  input.value = '';

  // Show typing indicator
  showTyping();

  try {
    // 🧠 Send recent history for context - NEW
    const recentHistory = conversationHistory.slice(-10).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: msg,
        history: recentHistory // 🧠 Context included
      })
    });

    const data = await res.json();
    
    // Remove typing indicator
    removeTyping();
    
    addMessage(data.reply || "(No response)", 'bot');
  } catch (err) {
    // Remove typing indicator on error too
    removeTyping();
    
    addMessage("(Error connecting to webhook)", 'bot');
  }
}

// Function to show typing dots
function showTyping() {
  const box = document.getElementById('chatBox');
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.id = 'typing';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  box.appendChild(typing);
  box.scrollTop = box.scrollHeight;
}

// Function to remove typing dots
function removeTyping() {
  const typing = document.getElementById('typing');
  if (typing) typing.remove();
}

// Function for suggestion pills
function useSuggestion(text) {
  const input = document.getElementById('userInput');
  input.value = text;
  sendMessage();
}

// 🧠 NEW: Clear all memory
function clearMemory() {
  if (confirm('Clear all conversation history? This cannot be undone.')) {
    conversationHistory = [];
    localStorage.removeItem(MEMORY_KEY);
    
    // Reload page to show welcome screen
    location.reload();
  }
}

// Your original Enter key listener - NOT CHANGED
document.getElementById('userInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// 🧠 Load memory when page loads - NEW
window.addEventListener('DOMContentLoaded', loadMemory);
