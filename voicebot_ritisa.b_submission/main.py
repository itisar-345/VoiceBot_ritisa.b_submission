from flask import Flask, request, jsonify
from modules.asr_module import ASRModule
from modules.nlp_pipeline import NLPPipeline
from modules.response_gen import ResponseGenerator
from modules.utils import detect_language, load_audio_files_from_dir, load_json_files_from_dir
import os

app = Flask(__name__)

# Initialize modules
asr = ASRModule()
nlp = NLPPipeline()
response_gen = ResponseGenerator()

@app.route('/process_audio', methods=['POST'])
def process_audio():
    """Endpoint for processing audio input"""
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
        
    audio_file = request.files['audio']
    temp_path = f"temp_{audio_file.filename}"
    audio_file.save(temp_path)
    
    try:
        # Step 1: Transcribe audio
        transcription = asr.transcribe(temp_path)
        if not transcription:
            return jsonify({"error": "Failed to transcribe audio"}), 500
            
        # Step 2: NLP processing
        nlp_results = nlp.process_text(transcription)
        
        # Step 3: Generate response
        conversation_history = request.json.get('history', [])
        response = response_gen.generate_response(nlp_results, conversation_history)
        
        # Clean up
        os.remove(temp_path)
        
        return jsonify({
            "transcription": transcription,
            "nlp_results": nlp_results,
            "response": response
        })
        
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500

@app.route('/process_text', methods=['POST'])
def process_text():
    """Endpoint for processing text input"""
    data = request.json
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
        
    try:
        # Step 1: NLP processing
        nlp_results = nlp.process_text(data['text'])
        
        # Step 2: Generate response
        conversation_history = data.get('history', [])
        response = response_gen.generate_response(nlp_results, conversation_history)
        
        return jsonify({
            "nlp_results": nlp_results,
            "response": response
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)