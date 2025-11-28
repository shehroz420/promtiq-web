const WEBHOOK_URL = "https://shehroz910.app.n8n.cloud/webhook/c895789f-aa80-4df3-b3bd-ac4acf3608ff";

function addMessage(text, sender) {
  const box = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.className = `msg ${sender}`;
  div.innerText = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('userInput');
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, 'user');
  input.value = '';

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: msg })
    });

    const data = await res.json();
    addMessage(data.reply || "(No response)", 'bot');
  } catch (err) {
    addMessage("(Error connecting to webhook)", 'bot');
  }
}

document.getElementById('userInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});