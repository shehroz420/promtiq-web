// ⚡ ZENOVAAI - FULL REFINED CODE
const WEBHOOK_URL = "https://ahaseeb590.app.n8n.cloud/webhook/Shehrozbhai12";

let isFirstMessage = true;
let conversationHistory = [];
const MEMORY_KEY = 'zenovaai_memory';
const MAX_HISTORY = 50;

// 🧠 Memory Load: Purani chat wapas lane ke liye
function loadMemory() {
  try {
    const saved = localStorage.getItem(MEMORY_KEY);
    if (saved) {
      conversationHistory = JSON.parse(saved);
      const box = document.getElementById('chatBox');
      if (!box) return;
      
      conversationHistory.forEach(msg => {
        const div = document.createElement('div');
        div.className = `msg ${msg.sender}`;
        div.innerText = msg.text;
        box.appendChild(div);
      });
      
      if (conversationHistory.length > 0) {
        isFirstMessage = false;
        hideWelcomeUI();
      }
      box.scrollTop = box.scrollHeight;
    }
  } catch (err) { console.error('Memory load error:', err); }
}

function hideWelcomeUI() {
  const welcome = document.getElementById('welcomeMessage');
  const suggestions = document.getElementById('suggestions');
  if (welcome) welcome.remove();
  if (suggestions) suggestions.remove();
}

// 🧠 Save to Local Storage
function saveToMemory(text, sender) {
  conversationHistory.push({ text: text, sender: sender, timestamp: new Date().toISOString() });
  if (conversationHistory.length > MAX_HISTORY) conversationHistory = conversationHistory.slice(-MAX_HISTORY);
  localStorage.setItem(MEMORY_KEY, JSON.stringify(conversationHistory));
}

// ✨ Add Message to UI with "No Special Characters" filter
function addMessage(text, sender) {
  const box = document.getElementById('chatBox');
  if (!box) return;
  
  const div = document.createElement('div');
  div.className = `msg ${sender}`;
  
  // 🪄 Aapki condition: Special characters saaf karna (?, !, @, etc)
  const cleanText = text.replace(/[^\w\s\u0600-\u06FF]/gi, '');
  
  div.innerText = cleanText;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  
  saveToMemory(cleanText, sender);
}

// 🚀 Main Send Function - NO HARDCODED REPLIES HERE
async function sendMessage() {
  const input = document.getElementById('userInput');
  const msg = input.value.trim();
  if (!msg) return;

  if (isFirstMessage) {
    hideWelcomeUI();
    isFirstMessage = false;
  }

  addMessage(msg, 'user');
  input.value = '';
  showTyping();

  try {
    // n8n ko request bhejna
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: msg,
        history: conversationHistory.slice(-5) // Sirf last 5 messages context ke liye
      })
    });

    const rawData = await res.text();
    let botResponse = "";

    try {
      // JSON format handle karna
      const parsed = JSON.parse(rawData);
      botResponse = parsed.output || parsed.reply || parsed.text || (Array.isArray(parsed) ? parsed[0].output : rawData);
    } catch (e) {
      // Agar direct text bhej raha hai n8n
      botResponse = rawData;
    }

    removeTyping();

    // Final Reply display (Jo n8n se aaya hai wahi dikhega)
    if (!botResponse || botResponse === "{}" || botResponse === "[]") {
      addMessage("I am here to help you with research and math", 'bot');
    } else {
      addMessage(botResponse, 'bot');
    }

  } catch (err) {
    console.error("Fetch Error:", err);
    removeTyping();
    addMessage("Connection problem please try again", 'bot');
  }
}

// ⌨️ Typing Indicator
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

// 💡 Suggestions
function useSuggestion(text) {
  document.getElementById('userInput').value = text;
  sendMessage();
}

// 🗑️ Clear Memory
function clearMemory(event) {
  if (event) event.preventDefault();
  if (confirm('Clear chat history?')) {
    localStorage.removeItem(MEMORY_KEY);
    location.reload(); 
  }
  return false;
}

// 🎧 Listeners
document.getElementById('userInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

window.addEventListener('DOMContentLoaded', loadMemory);
