// PromtIQ Premium Chat Script

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
let isFirstMessage = true;

// Function to send message
function sendMessage() {
  const message = userInput.value.trim();
  
  if (message === '') {
    return; // Don't send empty messages
  }

  // Remove welcome message and suggestions on first message
  if (isFirstMessage) {
    removeWelcomeElements();
    isFirstMessage = false;
  }

  // Add user message to chat
  addMessage(message, 'user');
  
  // Clear input
  userInput.value = '';
  
  // Show typing indicator
  showTypingIndicator();
  
  // Simulate bot response after delay
  setTimeout(() => {
    removeTypingIndicator();
    
    // Here you would typically call your API
    // For now, we'll use a placeholder response
    const botResponse = getBotResponse(message);
    addMessage(botResponse, 'bot');
  }, 1500);
}

// Function to add message to chat
function addMessage(text, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `msg ${type}`;
  messageDiv.textContent = text;
  
  chatBox.appendChild(messageDiv);
  
  // Scroll to bottom smoothly
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to show typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Function to remove welcome elements
function removeWelcomeElements() {
  const welcomeMessage = document.getElementById('welcomeMessage');
  const suggestions = document.getElementById('suggestions');
  
  if (welcomeMessage) {
    welcomeMessage.remove();
  }
  
  if (suggestions) {
    suggestions.remove();
  }
}

// Function to handle suggestion click
function useSuggestion(text) {
  userInput.value = text;
  sendMessage();
}

// Function to handle Enter key press
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// Function to get bot response (replace this with your actual API call)
function getBotResponse(userMessage) {
  // This is a placeholder. Replace with your actual API call
  // Example: return await fetch('/api/chat', { method: 'POST', body: JSON.stringify({message: userMessage}) })
  
  const responses = [
    "That's a great question! I'd be happy to help you with that. Let me provide you with a comprehensive answer tailored to your needs.",
    "I understand what you're looking for. Here's my detailed response based on my knowledge and capabilities.",
    "Excellent! I can definitely assist you with that. Let me break this down for you in a clear and helpful way.",
    "Thanks for reaching out! I've analyzed your request and here's what I recommend based on best practices.",
    "I'm here to help! Let me provide you with the information you need to move forward confidently.",
    "Great question! Based on what you've asked, here's the most helpful information I can provide.",
    "I've got you covered! Here's everything you need to know about that topic."
  ];
  
  // Return a random response
  return responses[Math.floor(Math.random() * responses.length)];
}

// Auto-focus input field when page loads
window.addEventListener('load', () => {
  userInput.focus();
});
