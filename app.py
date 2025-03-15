from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from langdetect import detect
import os

app = Flask(__name__, 
    static_url_path='',
    static_folder='static',
    template_folder='templates')

# Configure CORS for Wix domain
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://www.poppemechatronik.com",
            "http://www.poppemechatronik.com",
            "https://poppemechatronik.com",
            "http://poppemechatronik.com"
        ],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Simple response dictionary
responses = {
    'de': {  # German responses
        'greeting': 'Willkommen bei Poppe Mechatronik! Wie kann ich Ihnen helfen?',
        'services': 'Wir bieten Dienstleistungen in den Bereichen Mechatronik, 3D-Druck und Prototypenbau an. Unsere Spezialitäten sind CAD- und PCB-Design sowie Rapid-Prototyping-Verfahren.',
        'contact': 'Sie können uns unter benjamin@poppemechatronik.com oder +49 15752783176 erreichen.',
        'hours': 'Unsere Öffnungszeiten sind Mo-Fr 8:00-20:00 und Sa 9:00-19:00.',
        'location': 'Sie finden uns in der Fabrikstraße 45, 71522 Backnang, Deutschland.',
        'about': 'Poppe Mechatronik ist Ihr Spezialist für additive Fertigungsverfahren. Unser Team besteht aus begeisterten Fachleuten mit frischem Know-How.',
        'default': 'Tut mir leid, ich verstehe die Frage nicht. Können Sie es bitte anders formulieren?'
    },
    'en': {  # English responses
        'greeting': 'Welcome to Poppe Mechatronik! How can I help you?',
        'services': 'We offer services in mechatronics, 3D printing, and prototype construction. We specialize in CAD and PCB design, as well as rapid prototyping processes.',
        'contact': 'You can reach us at benjamin@poppemechatronik.com or +49 15752783176.',
        'hours': 'Our business hours are Mon-Fri 8:00-20:00 and Sat 9:00-19:00.',
        'location': 'You can find us at Fabrikstraße 45, 71522 Backnang, Germany.',
        'about': 'Poppe Mechatronik is your specialist for additive manufacturing processes. Our team consists of enthusiastic experts with fresh know-how.',
        'default': 'I apologize, I don\'t understand the question. Could you please rephrase it?'
    }
}

def get_response(message, lang):
    message = message.lower()
    
    # Keyword matching
    if any(word in message for word in ['hallo', 'hi', 'hey', 'hello', 'guten tag']):
        return responses[lang]['greeting']
    elif any(word in message for word in ['service', 'dienst', 'angebot', 'offer', 'leistung', '3d', 'druck', 'print', 'prototyp']):
        return responses[lang]['services']
    elif any(word in message for word in ['contact', 'kontakt', 'email', 'phone', 'telefon', 'mail', 'nummer']):
        return responses[lang]['contact']
    elif any(word in message for word in ['hours', 'zeit', 'öffnung', 'open', 'geschäft']):
        return responses[lang]['hours']
    elif any(word in message for word in ['where', 'wo', 'address', 'adresse', 'location', 'standort', 'find']):
        return responses[lang]['location']
    elif any(word in message for word in ['about', 'über', 'team', 'company', 'firma', 'unternehmen']):
        return responses[lang]['about']
    
    return responses[lang]['default']

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    if not request.is_json:
        return jsonify({'error': 'Content-Type must be application/json'}), 400
        
    user_message = request.json.get('message', '')
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    try:
        # Detect language (default to German if unsure)
        try:
            lang = detect(user_message)
            if lang not in ['de', 'en']:
                lang = 'de'
        except:
            lang = 'de'
        
        # Get response
        response = get_response(user_message, lang)
        
        return jsonify({
            'response': response,
            'language': lang
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port) 