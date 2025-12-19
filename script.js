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
  const div = document.createElement('div');
  div.className = `msg ${sender}`;
  div.innerText = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  
  saveToMemory(text, sender);
}

// 🔹 FIXED: sendMessage handles different n8n response formats
async function sendMessage() {
  const input = document.getElementById('userInput');
  const msg = input.value.trim();
  if (!msg) return;

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
    const recentHistory = conversationHistory.slice(-10).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    const emailInput = document.getElementById('userEmail');
    const currentUserEmail = emailInput ? emailInput.value.trim() : "user@example.com";

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: currentUserEmail,
        query: msg,
        history: recentHistory
      })
    });

    // 💡 The Fix starts here: Determine the type of response
    const data = await res.json();
    removeTyping();

    let botResponse = "(No response)";

    if (typeof data === 'string') {
      // If n8n sends raw text: "I only tell you about researching..."
      botResponse = data;
    } else if (data.reply) {
      // If n8n sends { "reply": "..." }
      botResponse = data.reply;
    } else if (data.output) {
      // If n8n sends { "output": "..." }
      botResponse = data.output;
    } else if (Array.isArray(data) && data.length > 0) {
      // If n8n sends an array, check the first item
      botResponse = data[0].reply || data[0].output || data[0].text || JSON.stringify(data[0]);
    } else if (data.text) {
        botResponse = data.text;
    }

    addMessage(botResponse, 'bot');

  } catch (err) {
    console.error("Fetch Error:", err);
    removeTyping();
    addMessage("(Error connecting to webhook)", 'bot');
  }
}

// Function to show typing dots
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

// 🧠 Clear all memory
function clearMemory(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  if (confirm('Clear all conversation history? This cannot be undone.')) {
    try {
      conversationHistory = [];
      localStorage.removeItem(MEMORY_KEY);

      const box = document.getElementById('chatBox');
      if (box) {
        box.innerHTML = ''; 
      }

      isFirstMessage = true;

      const welcomeHTML = `
        <div class="welcome-message" id="welcomeMessage">
          <h2>How Can I Help You This Morning?</h2>
          <p>I'm here to assist with anything you need</p>
        </div>
        <div class="suggestions" id="suggestions">
          <div class="suggestion-pill" onclick="useSuggestion('Write an email')">✍️ Write an email</div>
          <div class="suggestion-pill" onclick="useSuggestion('Explain a concept')">🧠 Explain a concept</div>
          <div class="suggestion-pill" onclick="useSuggestion('Plan my day')">📅 Plan my day</div>
          <div class="suggestion-pill" onclick="useSuggestion('Create content')">🎨 Create content</div>
        </div>
      `;
      box.insertAdjacentHTML('beforeend', welcomeHTML);
      
    } catch (error) {
      console.error('Error clearing memory:', error);
    }
  }
  return false;
}

// Enter key listener
document.getElementById('userInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Load memory when page loads
window.addEventListener('DOMContentLoaded', loadMemory);

