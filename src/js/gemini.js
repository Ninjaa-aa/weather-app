import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

document.addEventListener('DOMContentLoaded', function() {
  const chatbotIcon = document.getElementById('chatbot-icon');
  const chatbotContainer = document.getElementById('chatbot-container');
  const closeChatbot = document.getElementById('close-chatbot');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');

  const genAI = new GoogleGenerativeAI('AIzaSyCbLndpVrUD1e--AaJ1w2f0CSuXEjuGzpI');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  chatbotIcon.addEventListener('click', toggleChatbot);
  closeChatbot.addEventListener('click', toggleChatbot);

  function toggleChatbot() {
    chatbotContainer.classList.toggle('scale-0');
    chatbotContainer.classList.toggle('scale-100');
    if (chatbotContainer.classList.contains('scale-100')) {
      chatbotInput.focus();
    }
  }

  async function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
      addMessage(message, true);
      chatbotInput.value = '';

      // Show typing indicator
      const typingIndicator = addTypingIndicator();

      try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
        });
        const response = await result.response.text();
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Limit response to 200 words
        const limitedResponse = limitWords(response, 200);
        addMessage(limitedResponse);
      } catch (error) {
        console.error('Error:', error);
        
        // Remove typing indicator
        typingIndicator.remove();
        
        addMessage('Sorry, I encountered an error. Please try again.');
      }
    }
  }

  function limitWords(text, maxWords) {
    const words = text.split(/\s+/);
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  }

  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', isUser ? 'justify-end' : 'justify-start', 'mb-4', 'opacity-0', 'transition-opacity', 'duration-300');
    
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('max-w-xs', 'p-3', 'rounded-lg', isUser ? 'bg-neon-blue' : 'bg-white', 'bg-opacity-20', 'text-white', 'shadow-lg');
    messageBubble.textContent = content;
    
    messageDiv.appendChild(messageBubble);
    chatbotMessages.appendChild(messageDiv);
    
    // Trigger reflow to enable animation
    messageDiv.offsetHeight;
    
    // Add opacity to fade in the message
    messageDiv.classList.add('opacity-100');
    
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('flex', 'justify-start', 'mb-4');
    
    const typingBubble = document.createElement('div');
    typingBubble.classList.add('max-w-xs', 'p-3', 'rounded-lg', 'bg-white', 'bg-opacity-20', 'text-white');
    typingBubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    
    typingDiv.appendChild(typingBubble);
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    return typingDiv;
  }

  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Initial greeting
  setTimeout(() => {
    addMessage("Hello! I'm your NEXUSWeather assistant. How can I help you today?");
  }, 1000);
});