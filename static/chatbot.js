// Wix-compatible chat widget
(function() {
    // Create chat widget HTML with Poppe Mechatronik's color scheme
    const chatWidget = document.createElement('div');
    chatWidget.innerHTML = `
        <div id="poppe-chat-widget" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            display: none;
            flex-direction: column;
            z-index: 999999;
            font-family: Arial, sans-serif;
            color: #333;
        ">
            <div style="
                padding: 15px;
                background: #2B7C85;
                color: white;
                border-radius: 10px 10px 0 0;
                font-weight: bold;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            ">
                <span>Poppe Mechatronik Chat</span>
                <button onclick="document.getElementById('poppe-chat-widget').style.display='none';document.getElementById('poppe-chat-button').style.transform='scale(1)';" style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 20px;
                    padding: 0;
                    line-height: 1;
                ">×</button>
            </div>
            <div id="poppe-chat-messages" style="
                flex-grow: 1;
                overflow-y: auto;
                padding: 15px;
                background: #fff;
                display: flex;
                flex-direction: column;
                gap: 10px;
            ">
                <div style="
                    padding: 10px;
                    background: #f1f1f1;
                    border-radius: 10px;
                    max-width: 80%;
                    color: #333;
                ">Willkommen! Wie kann ich Ihnen helfen? / Welcome! How can I help you?</div>
            </div>
            <div style="
                padding: 15px;
                border-top: 1px solid #eee;
                background: #fff;
                border-radius: 0 0 10px 10px;
            ">
                <input type="text" id="poppe-chat-input" placeholder="Ihre Nachricht... / Your message..." style="
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 14px;
                    color: #333;
                    background: #fff;
                    box-sizing: border-box;
                ">
            </div>
        </div>
        <button id="poppe-chat-button" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: #2B7C85;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 24px;
        ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: white;">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </button>
    `;

    // Append to body when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', appendChat);
    } else {
        appendChat();
    }

    function appendChat() {
        document.body.appendChild(chatWidget);
        initializeChat();
    }

    function initializeChat() {
        const chatButton = document.getElementById('poppe-chat-button');
        const chatWidgetContainer = document.getElementById('poppe-chat-widget');
        const chatMessages = document.getElementById('poppe-chat-messages');
        const chatInput = document.getElementById('poppe-chat-input');

        // Toggle chat widget with animation
        chatButton.addEventListener('click', () => {
            const isVisible = chatWidgetContainer.style.display === 'flex';
            chatWidgetContainer.style.display = isVisible ? 'none' : 'flex';
            chatButton.style.transform = isVisible ? 'scale(1)' : 'scale(0)';
            if (!isVisible) {
                chatInput.focus();
            }
        });

        // Add message to chat
        function addMessage(message, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                margin: 5px 0;
                padding: 12px;
                border-radius: 10px;
                max-width: 80%;
                ${isUser ? 'margin-left: auto; background: #2B7C85; color: white;' : 'background: #f1f1f1; color: #333;'}
                animation: fadeIn 0.3s ease;
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.4;
            `;
            messageDiv.textContent = message;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Handle send message
        async function sendMessage(message) {
            try {
                const response = await fetch('https://poppe-chatbot.onrender.com/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
                });
                
                const data = await response.json();
                
                if (data.error) {
                    addMessage('Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
                } else {
                    addMessage(data.response);
                }
            } catch (error) {
                console.error('Error:', error);
                addMessage('Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
            }
        }

        // Handle input
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim()) {
                const message = chatInput.value.trim();
                addMessage(message, true);
                sendMessage(message);
                chatInput.value = '';
            }
        });

        // Add custom styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            #poppe-chat-widget * {
                box-sizing: border-box;
            }
            #poppe-chat-messages::-webkit-scrollbar {
                width: 6px;
            }
            #poppe-chat-messages::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }
            #poppe-chat-messages::-webkit-scrollbar-thumb {
                background: #2B7C85;
                border-radius: 3px;
            }
        `;
        document.head.appendChild(style);
    }
})(); 