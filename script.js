// Your original webhook - NOT CHANGED
const WEBHOOK_URL = "https://shehroz910.app.n8n.cloud/webhook/c895789f-aa80-4df3-b3bd-ac4acf3608ff";

// Track if first message to remove welcome screen
let isFirstMessage = true;

// Your original addMessage function - NOT CHANGED
function addMessage(text, sender) {
  const box = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.className = `msg ${sender}`;
  div.innerText = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// Your original sendMessage with minimal additions
async function sendMessage() {
  const input = document.getElementById('userInput');
  const msg = input.value.trim();
  if (!msg) return;

  // NEW: Remove welcome message on first send
  if (isFirstMessage) {
    const welcome = document.getElementById('welcomeMessage');
    const suggestions = document.getElementById('suggestions');
    if (welcome) welcome.remove();
    if (suggestions) suggestions.remove();
    isFirstMessage = false;
  }

  addMessage(msg, 'user');
  input.value = '';

  // NEW: Show typing indicator
  showTyping();

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: msg })
    });

    const data = await res.json();
    
    // NEW: Remove typing indicator
    removeTyping();
    
    addMessage(data.reply || "(No response)", 'bot');
  } catch (err) {
    // NEW: Remove typing indicator on error too
    removeTyping();
    
    addMessage("(Error connecting to webhook)", 'bot');
  }
}

// NEW: Function to show typing dots
function showTyping() {
  const box = document.getElementById('chatBox');
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.id = 'typing';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  box.appendChild(typing);
  box.scrollTop = box.scrollHeight;
}

// NEW: Function to remove typing dots
function removeTyping() {
  const typing = document.getElementById('typing');
  if (typing) typing.remove();
}

// NEW: Function for suggestion pills
function useSuggestion(text) {
  const input = document.getElementById('userInput');
  input.value = text;
  sendMessage();
}

// Your original Enter key listener - NOT CHANGED
document.getElementById('userInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
