// Chat Widget for Poppe Mechatronik
document.addEventListener('DOMContentLoaded', function() {
    // Create and append chat widget HTML
    const chatWidget = document.createElement('div');
    chatWidget.id = 'chat-widget';
    chatWidget.innerHTML = `
        <div id="chat-widget-container" style="display: none;">
            <div id="chat-header">
                <span>Poppe Mechatronik Chat</span>
                <button id="close-chat">×</button>
            </div>
            <div id="chat-messages"></div>
            <div id="chat-input-container">
                <input type="text" id="chat-input" placeholder="Type your message...">
                <button id="send-message">Send</button>
            </div>
        </div>
        <button id="chat-widget-button">💬</button>
    `;
    document.body.appendChild(chatWidget);

    // Add styles
    const styles = `
        #chat-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            font-family: Arial, sans-serif;
        }

        #chat-widget-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #0056b3;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 24px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
        }

        #chat-widget-button:hover {
            transform: scale(1.1);
        }

        #chat-widget-container {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
        }

        #chat-header {
            background-color: #0056b3;
            color: white;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #close-chat {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
        }

        #chat-messages {
            flex-grow: 1;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        #chat-input-container {
            padding: 15px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        }

        #chat-input {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            outline: none;
        }

        #send-message {
            padding: 10px 20px;
            background-color: #0056b3;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .message {
            max-width: 80%;
            padding: 10px;
            border-radius: 10px;
            margin: 5px 0;
        }

        .user-message {
            background-color: #e3f2fd;
            align-self: flex-end;
        }

        .bot-message {
            background-color: #f5f5f5;
            align-self: flex-start;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Get DOM elements
    const chatButton = document.getElementById('chat-widget-button');
    const chatContainer = document.getElementById('chat-widget-container');
    const closeButton = document.getElementById('close-chat');
    const sendButton = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Add welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message bot-message';
    welcomeMessage.textContent = 'Welcome to Poppe Mechatronik! How can I assist you today?';
    chatMessages.appendChild(welcomeMessage);

    // Toggle chat window
    chatButton.addEventListener('click', () => {
        chatContainer.style.display = chatContainer.style.display === 'none' ? 'flex' : 'none';
        if (chatContainer.style.display === 'flex') {
            chatInput.focus();
        }
    });

    closeButton.addEventListener('click', () => {
        chatContainer.style.display = 'none';
    });

    // Send message function
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.textContent = message;
        chatMessages.appendChild(userMessageDiv);

        // Clear input
        chatInput.value = '';
        chatInput.focus();

        try {
            // Send message to backend
            const response = await fetch('https://poppe-chatbot-1.onrender.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Add bot response to chat
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'message bot-message';
            botMessageDiv.textContent = data.response;
            chatMessages.appendChild(botMessageDiv);
        } catch (error) {
            console.error('Error:', error);
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.className = 'message bot-message';
            errorMessageDiv.textContent = 'Sorry, I encountered an error. Please try again later.';
            chatMessages.appendChild(errorMessageDiv);
        }

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Event listeners for sending messages
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 