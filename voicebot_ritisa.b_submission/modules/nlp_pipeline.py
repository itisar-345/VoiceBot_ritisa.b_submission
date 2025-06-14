from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    pipeline,
    AutoModelForTokenClassification
)
from modules.utils import read_config, get_device, detect_language
import torch
import json
import re

class NLPPipeline:
    def __init__(self):
        self.config = read_config()
        self.device = get_device()
        self.supported_languages = self.config['data']['supported_languages']
        
        # Load models
        self.load_models()
        
    def load_models(self):
        """Load all NLP models"""
        # Intent classification
        self.intent_tokenizer = AutoTokenizer.from_pretrained(self.config['model']['nlp']['intent_model'])
        self.intent_model = AutoModelForSequenceClassification.from_pretrained(
            self.config['model']['nlp']['intent_model']
        ).to(self.device)
        
        # NER
        self.ner_pipeline = pipeline(
            "ner",
            model=self.config['model']['nlp']['ner_model'],
            tokenizer=self.config['model']['nlp']['ner_model'],
            device=0 if self.device == "cuda" else -1
        )
        
        # Sentiment analysis
        self.sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model=self.config['model']['nlp']['sentiment_model'],
            device=0 if self.device == "cuda" else -1
        )
        
    def preprocess_text(self, text):
        """Clean and preprocess text"""
        # Basic cleaning
        text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
        text = text.strip()
        return text
    
    def detect_intent(self, text):
        """Classify user intent"""
        text = self.preprocess_text(text)
        inputs = self.intent_tokenizer(text, return_tensors="pt", truncation=True, padding=True).to(self.device)
        
        with torch.no_grad():
            outputs = self.intent_model(**inputs)
        
        probabilities = torch.softmax(outputs.logits, dim=1)
        predicted_class = torch.argmax(probabilities, dim=1).item()
        
        # This would need to be mapped to your actual intent classes
        intent_classes = ["query", "command", "greeting", "unknown"]
        return intent_classes[predicted_class]
    
    def extract_entities(self, text):
        """Extract named entities from text"""
        results = self.ner_pipeline(text)
        entities = []
        current_entity = None
        
        for entity in results:
            if entity['entity'].startswith('B-'):
                if current_entity:
                    entities.append(current_entity)
                current_entity = {
                    'entity': entity['entity'][2:],
                    'word': entity['word'],
                    'score': entity['score']
                }
            elif entity['entity'].startswith('I-') and current_entity:
                current_entity['word'] += ' ' + entity['word']
                current_entity['score'] = (current_entity['score'] + entity['score']) / 2
                
        if current_entity:
            entities.append(current_entity)
            
        return entities
    
    def analyze_sentiment(self, text):
        """Analyze sentiment of the text"""
        result = self.sentiment_pipeline(text)[0]
        return {
            'label': result['label'],
            'score': result['score']
        }
    
    def process_text(self, text):
        """Complete NLP processing pipeline"""
        language = detect_language(text)
        if language not in self.supported_languages:
            raise ValueError(f"Unsupported language: {language}")
            
        return {
            'text': text,
            'language': language,
            'intent': self.detect_intent(text),
            'entities': self.extract_entities(text),
            'sentiment': self.analyze_sentiment(text)
        }
    
    def process_json(self, json_path):
        """Process JSON input file"""
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        if 'text' not in data:
            raise ValueError("JSON file must contain 'text' field")
            
        return self.process_text(data['text'])