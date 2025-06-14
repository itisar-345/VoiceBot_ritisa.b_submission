import yaml
import torch
import os
from langdetect import detect
import re

def read_config(config_path="config/config.yaml"):
    """Read configuration file"""
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    return config

def get_device():
    """Get available device"""
    return "cuda" if torch.cuda.is_available() else "cpu"

def detect_language(text):
    """Detect language of text with special handling for Hinglish"""
    try:
        # Simple heuristic for Hinglish (mix of Hindi and English)
        hindi_chars = re.findall(r'[\u0900-\u097F]+', text)
        english_chars = re.findall(r'[a-zA-Z]+', text)
        
        if hindi_chars and english_chars:
            return "hinglish"
            
        lang = detect(text)
        return "hi" if lang == "hi" else "en"
    except:
        return "en"  # default to English if detection fails

def load_audio_files_from_dir(directory, extensions=[".wav", ".mp3"]):
    """Load audio files from directory"""
    audio_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if os.path.splitext(file)[1].lower() in extensions:
                audio_files.append(os.path.join(root, file))
    return audio_files

def load_json_files_from_dir(directory):
    """Load JSON files from directory"""
    json_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.json'):
                json_files.append(os.path.join(root, file))
    return json_files