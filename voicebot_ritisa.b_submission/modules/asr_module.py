import torch
import torchaudio
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
from modules.utils import read_config, get_device
import os
import librosa
import numpy as np

class ASRModule:
    def __init__(self):
        self.config = read_config()
        self.device = get_device()
        self.model_name = self.config['model']['asr']['model_name']
        self.sampling_rate = self.config['model']['asr']['sampling_rate']
        self.max_audio_length = self.config['data']['max_audio_length']
        
        # Initialize model and processor
        self.processor = Wav2Vec2Processor.from_pretrained(self.model_name)
        self.model = Wav2Vec2ForCTC.from_pretrained(self.model_name).to(self.device)
        
    def load_audio(self, audio_path):
        """Load and preprocess audio file"""
        try:
            # Load audio file
            speech, sr = librosa.load(audio_path, sr=self.sampling_rate)
            
            # Trim silence
            speech, _ = librosa.effects.trim(speech, top_db=20)
            
            # Limit audio length
            if len(speech) > self.max_audio_length * sr:
                speech = speech[:self.max_audio_length * sr]
                
            return speech
        except Exception as e:
            print(f"Error loading audio file {audio_path}: {str(e)}")
            return None
    
    def transcribe(self, audio_path):
        """Transcribe audio file to text"""
        speech = self.load_audio(audio_path)
        if speech is None:
            return None
            
        # Process audio
        inputs = self.processor(
            speech, 
            sampling_rate=self.sampling_rate, 
            return_tensors="pt", 
            padding=True
        ).to(self.device)
        
        # Inference
        with torch.no_grad():
            logits = self.model(inputs.input_values).logits
            
        # Decode
        predicted_ids = torch.argmax(logits, dim=-1)
        transcription = self.processor.batch_decode(predicted_ids)[0]
        
        return transcription
    
    def batch_transcribe(self, audio_files):
        """Transcribe multiple audio files"""
        results = {}
        for audio_file in audio_files:
            if os.path.splitext(audio_file)[1].lower() in self.config['data']['audio_extensions']:
                transcription = self.transcribe(audio_file)
                results[audio_file] = transcription
        return results