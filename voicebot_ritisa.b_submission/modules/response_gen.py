from transformers import AutoModelForCausalLM, AutoTokenizer
from modules.utils import read_config, get_device
import torch

class ResponseGenerator:
    def __init__(self):
        self.config = read_config()
        self.device = get_device()
        self.model_name = self.config['model']['response_generation']['chatbot_model']
        
        # Initialize model and tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForCausalLM.from_pretrained(self.model_name).to(self.device)
        self.tokenizer.pad_token = self.tokenizer.eos_token
        
    def generate_response(self, nlp_results, conversation_history=None):
        """Generate response based on NLP analysis"""
        # Prepare prompt based on intent and entities
        prompt = self._create_prompt(nlp_results, conversation_history)
        
        # Generate response
        input_ids = self.tokenizer.encode(prompt, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            output = self.model.generate(
                input_ids,
                max_length=200,
                num_return_sequences=1,
                no_repeat_ngram_size=2,
                do_sample=True,
                top_k=50,
                top_p=0.95,
                temperature=0.7
            )
            
        response = self.tokenizer.decode(output[0], skip_special_tokens=True)
        
        # Clean up the response
        response = response.replace(prompt, "").strip()
        return response
    
    def _create_prompt(self, nlp_results, conversation_history):
        """Create prompt for response generation"""
        intent = nlp_results['intent']
        entities = nlp_results['entities']
        sentiment = nlp_results['sentiment']['label']
        
        # Basic prompt engineering
        prompt = f"User's intent: {intent}\n"
        prompt += f"Sentiment: {sentiment}\n"
        
        if entities:
            prompt += "Entities mentioned:\n"
            for entity in entities:
                prompt += f"- {entity['entity']}: {entity['word']}\n"
                
        if conversation_history:
            prompt += "\nConversation history:\n"
            for i, (user, bot) in enumerate(conversation_history[-3:], 1):
                prompt += f"Turn {i}:\nUser: {user}\nBot: {bot}\n"
                
        prompt += "\nGenerate an appropriate response in the same language as the user:\n"
        return prompt