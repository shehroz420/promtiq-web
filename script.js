// Your original webhook
const WEBHOOK_URL = "https://ahaseeb590.app.n8n.cloud/webhook/Shehrozbhai12";

// Track if first message to remove welcome screen
let isFirstMessage = true;

// 🧠 MEMORY SYSTEM
let conversationHistory = [];
const MEMORY_KEY = 'zenovaai_memory';
const MAX_HISTORY = 50;

// 🧠 Load saved conversations on page load
function loadMemory() {
  try {
    const saved = localStorage.getItem(MEMORY_KEY);
    if (saved) {
      conversationHistory = JSON.parse(saved);
      const box = document.getElementById('chatBox');
      conversationHistory.forEach(msg => {
        const div = document.createElement('div');
        div.className = `msg ${msg.sender}`;
        div.innerText = msg.text;
        box.appendChild(div);
      });
      
      if (conversationHistory.length > 0) {
        isFirstMessage = false;
        const welcome = document.getElementById('welcomeMessage');
        const suggestions = document.getElementById('suggestions');
        if (welcome) welcome.remove();
        if (suggestions) suggestions.remove();
      }
      box.scrollTop = box.scrollHeight;
    }
  } catch (err) {
    console.error('Memory load error:', err);
  }
}

// 🧠 Save conversation to memory
function saveToMemory(text, sender) {
  conversationHistory.push({
    text: text,
    sender: sender,
    timestamp: new Date().toISOString()
  });
  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory = conversationHistory.slice(-MAX_HISTORY);
  }
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(conversationHistory));
  } catch (err) {
    console.error('Memory save error:', err);
  }
}

// Function to add message to UI
function addMessage(text, sender) {
  const box = document.getElementById('chatBox');
  if (!box) return;
  const div = document.createElement('div');
  div.className = `msg ${sender}`;
  div.innerText = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  saveToMemory(text, sender);
}

// 🔹 FULLY FIXED: sendMessage function
async function sendMessage() {
  const input = document.getElementById('userInput');
  const msg = input.value.trim();
  if (!msg) return;

  // UI cleanup on first message
  if (isFirstMessage) {
    const welcome = document.getElementById('welcomeMessage');
    const suggestions = document.getElementById('suggestions');
    if (welcome) welcome.remove();
    if (suggestions) suggestions.remove();
    isFirstMessage = false;
  }

  addMessage(msg, 'user');
  input.value = '';
  showTyping();

  try {
    const emailInput = document.getElementById('userEmail');
    const currentUserEmail = emailInput ? emailInput.value.trim() : "user@example.com";

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: currentUserEmail,
        query: msg,
        history: conversationHistory.slice(-10) 
      })
    });

    // 1. Get response as Text first (Safest way)
    const rawData = await res.text();
    let botResponse = "";

    try {
      // 2. Try to parse as JSON
      const parsed = JSON.parse(rawData);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        // If n8n returns an array: [ { "output": "..." } ]
        botResponse = parsed[0].output || parsed[0].reply || parsed[0].text || JSON.stringify(parsed[0]);
      } else if (typeof parsed === 'object') {
        // If n8n returns an object: { "output": "..." }
        botResponse = parsed.output || parsed.reply || parsed.text || JSON.stringify(parsed);
      } else {
        botResponse = parsed.toString();
      }
    } catch (e) {
      // 3. If parsing fails, it's already a plain string
      botResponse = rawData;
    }

    removeTyping();

    // Fallback if response is still empty
    if (!botResponse || botResponse === "{}" || botResponse === "[]") {
      addMessage("I'm sorry, I couldn't process that. Please try again.", 'bot');
    } else {
      addMessage(botResponse, 'bot');
    }

  } catch (err) {
    console.error("Fetch Error:", err);
    removeTyping();
    addMessage("Error: Could not connect to ZenovaAI. Please check your connection.", 'bot');
  }
}

// Typing Indicator Functions
function showTyping() {
  const box = document.getElementById('chatBox');
  if (document.getElementById('typing')) return;
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.id = 'typing';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  box.appendChild(typing);
  box.scrollTop = box.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('typing');
  if (typing) typing.remove();
}

// Suggestion pills helper
function useSuggestion(text) {
  const input = document.getElementById('userInput');
  if (input) {
    input.value = text;
    sendMessage();
  }
}

// Clear memory logic
function clearMemory(event) {
  if (event) {
    event.preventDefault();
  }
  if (confirm('Clear all conversation history?')) {
    conversationHistory = [];
    localStorage.removeItem(MEMORY_KEY);
    location.reload(); // Simplest way to reset UI
  }
  return false;
}

// Event Listeners
document.getElementById('userInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

window.addEventListener('DOMContentLoaded', loadMemory);

