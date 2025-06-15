import os
import json
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
from langchain.prompts import PromptTemplate
from langchain_aws import ChatBedrock, BedrockEmbeddings
from langchain_core.runnables import RunnableSequence
from langchain_core.output_parsers import StrOutputParser
import soundfile as sf
import pyttsx3
import logging
import importlib.util
from pathlib import Path
from dotenv import load_dotenv
import asyncio
import speech_recognition as sr
import faiss
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
import boto3

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class VoiceAssistant:
    def __init__(self, data_dir="data_files", transcripts_dir="transcript", audio_dir="audio"):
        self.data_dir = data_dir
        self.transcripts_dir = transcripts_dir
        self.audio_dir = audio_dir
        
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.transcripts_dir, exist_ok=True)
        os.makedirs(self.audio_dir, exist_ok=True)
        
        self.asr_processor = None
        self.asr_model = None
        self.llm = None
        self.intent_chain = None
        self.response_chain = None
        self.embeddings = None
        self.vector_store = None
        self.tts_engine = None
        self.data = {}
        self.processors = {}
        self.transcript_data = []
        self.response_file = os.path.join(self.audio_dir, "responses.json")
        self.recognizer = sr.Recognizer()
        
        self.aws_region = os.getenv("AWS_REGION_NAME", "us-west-2")
        try:
            session = boto3.Session()
            credentials = session.get_credentials()
            if not credentials:
                raise ValueError("No valid AWS credentials found. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION_NAME in .env file or configure AWS CLI.")
            logger.info("AWS credentials validated successfully")
        except Exception as e:
            logger.error(f"Error validating AWS credentials: {str(e)}")
            raise ValueError(f"Failed to validate AWS credentials: {str(e)}")
        
        self.load_models()
        self.load_data_files()
        self.load_transcripts()
        self.initialize_vector_store()
        
    def load_models(self):
        """Load models and initialize LangChain with AWS Bedrock"""
        logger.info("Loading ASR model...")
        self.asr_processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
        self.asr_model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")
        
        logger.info("Initializing AWS Bedrock LLM and Embeddings...")
        self.llm = ChatBedrock(
            model_id="anthropic.claude-3-5-sonnet-20241022-v2:0",
            region_name=self.aws_region,
            model_kwargs={"temperature": 0.7, "max_tokens": 300}
        )
        
        self.embeddings = BedrockEmbeddings(
            model_id="amazon.titan-embed-text-v1",
            region_name=self.aws_region
        )
        
        intent_prompt = PromptTemplate(
            input_variables=["text"],
            template="Classify the user intent in this text as a single word (e.g., 'question', 'command', 'greeting', 'unknown').\n\nText: {text}"
        )
        self.intent_chain = RunnableSequence(intent_prompt | self.llm | StrOutputParser())
        
        response_prompt = PromptTemplate(
            input_variables=["context", "query"],
            template="You are a helpful voice assistant. Use the context to answer the query concisely.\n\nContext: {context}\nQuery: {query}"
        )
        self.response_chain = RunnableSequence(response_prompt | self.llm | StrOutputParser())
        
        logger.info("Initializing TTS engine...")
        self.tts_engine = pyttsx3.init()
        self.tts_engine.setProperty('rate', 150)
        
    def initialize_vector_store(self):
        """Initialize FAISS vector store with optimized batch processing"""
        logger.info("Initializing FAISS vector store...")
        try:
            dimension = 1536  # Dimension for amazon.titan-embed-text-v1
            index = faiss.IndexFlatL2(dimension)
            self.vector_store = FAISS(
                embedding_function=self.embeddings,
                index=index,
                docstore=InMemoryDocstore(),
                index_to_docstore_id={}
            )
            
            documents = []
            doc_ids = []
            batch_size = 100  # Process documents in batches
            
            for data_type in self.data:
                if data_type == 'document':
                    for filename, overview in zip(self.data['document']['documents']['filenames'], 
                                                 self.data['document']['documents']['overviews']):
                        documents.append(f"{filename}: {overview['description']}")
                        doc_ids.append(f"doc_{filename}")
                elif data_type == 'platform':
                    for month, summary in zip(self.data['platform']['factsheets']['months'], 
                                             self.data['platform']['factsheets']['summaries']):
                        documents.append(f"{month}: {summary}")
                        doc_ids.append(f"platform_{month}")
                elif data_type == 'profile':
                    for name, summary in zip(self.data['profile']['profiles']['names'], 
                                            self.data['profile']['profiles']['summaries']):
                        documents.append(f"{name}: {summary}")
                        doc_ids.append(f"profile_{name}")
            
            for transcript in self.transcript_data:
                for segment in transcript.get('segments', []):
                    if 'text' in segment:
                        documents.append(segment['text'])
                        doc_ids.append(f"transcript_{len(documents)}")
            
            if documents:
                # Add documents in batches
                for i in range(0, len(documents), batch_size):
                    batch_docs = documents[i:i + batch_size]
                    batch_ids = doc_ids[i:i + batch_size]
                    self.vector_store.add_texts(texts=batch_docs, ids=batch_ids)
                logger.info("Populated FAISS vector store with context data")
            else:
                logger.warning("No documents available to populate FAISS vector store")
                
        except Exception as e:
            logger.error(f"Error initializing FAISS vector store: {str(e)}")
        
    def load_data_files(self):
        """Load Python data files and their process_query functions"""
        logger.info("Loading data files...")
        
        data_files = {
            'document': 'documentdata.py',
            'platform': 'platformdata.py',
            'profile': 'profiledata.py'
        }
        
        for data_type, filename in data_files.items():
            filepath = os.path.join(self.data_dir, filename)
            if os.path.exists(filepath):
                try:
                    spec = importlib.util.spec_from_file_location(data_type, filepath)
                    module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(module)
                    self.data[data_type] = getattr(module, f"{data_type}_data")
                    self.processors[data_type] = getattr(module, 'process_query')
                    logger.info(f"Loaded {filename}")
                except Exception as e:
                    logger.error(f"Error loading {filename}: {str(e)}")
            else:
                logger.warning(f"Data file not found: {filepath}")
                
    def load_transcripts(self):
        """Load JSON transcript files"""
        logger.info("Loading transcript files...")
        self.transcript_data = []
        
        for filename in os.listdir(self.transcripts_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(self.transcripts_dir, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        transcript = json.load(f)
                        self.transcript_data.append(transcript)
                    logger.info(f"Loaded transcript: {filename}")
                except Exception as e:
                    logger.error(f"Error loading transcript {filename}: {str(e)}")
                    
    def transcribe_audio(self, audio_path):
        """Transcribe audio using Wav2Vec2"""
        logger.info(f"Transcribing audio: {audio_path}")
        audio, sample_rate = sf.read(audio_path)
        if sample_rate != 16000:
            logger.warning("Sample rate is not 16000 Hz")
        
        inputs = self.asr_processor(audio, sampling_rate=16000, return_tensors="pt", padding=True)
        with torch.no_grad():
            logits = self.asr_model(inputs.input_values).logits
        predicted_ids = torch.argmax(logits, dim=-1)
        transcription = self.asr_processor.batch_decode(predicted_ids)[0]
        return transcription.lower()
        
    def process_text(self, text):
        """Process text for intent classification"""
        logger.info("Processing text...")
        try:
            intent = self.intent_chain.invoke({"text": text}).strip()
        except Exception as e:
            logger.error(f"Error processing text: {str(e)}")
            intent = "unknown"
        
        language = 'en'
        if any(ord(char) in range(0x0900, 0x097F) for char in text):
            language = 'hi'
            
        return {'text': text, 'intent': intent, 'language': language}
        
    async def generate_response(self, query, context, language='en'):
        """Generate response using data files or LangChain LLM"""
        logger.info("Generating response...")
        
        query_lower = query.lower()
        response = None
        
        if any(keyword in query_lower for keyword in ['document', 'rbi', 'lending', 'regulation', 'market', 'msme', 'registration', 'दस्तावेज', 'आरबीआई', 'उधार', 'विनियमन', 'बाजार', 'पंजीकरण']):
            if 'document' in self.processors:
                logger.info("Using documentdata.py")
                response = await self.processors['document'](query, [], preferred_language=language)
        elif any(keyword in query_lower for keyword in ['bhavin', 'dipesh', 'patel', 'karki', 'profile', 'experience', 'skills', 'education', 'भाविन', 'दीपेश', 'पटेल', 'कार्की', 'प्रोफाइल', 'अनुभव', 'कौशल', 'शिक्षा']):
            if 'profile' in self.processors:
                logger.info("Using profiledata.py")
                response = await self.processors['profile'](query, [], preferred_language=language)
        elif any(keyword in query_lower for keyword in ['platform', 'performance', 'metrics', 'loans', 'instamoney', 'factsheet', 'escrow', 'प्लेटफॉर्म', 'प्रदर्शन', 'मेट्रिक्स', 'ऋण', 'इंस्टामनी', 'फैक्टशीट', 'एस्क्रो']):
            if 'platform' in self.processors:
                logger.info("Using platformdata.py")
                response = await self.processors['platform'](query, [], preferred_language=language)
        
        if response is None:
            logger.info("Using LangChain LLM with FAISS")
            context_str = ""
            if self.vector_store:
                try:
                    docs = self.vector_store.similarity_search(query, k=5)
                    context_str = "\n".join([doc.page_content for doc in docs])
                except Exception as e:
                    logger.error(f"Error retrieving FAISS context: {str(e)}")
            
            try:
                response = await self.response_chain.ainvoke({
                    "context": context_str,
                    "query": query
                })
            except Exception as e:
                logger.error(f"Error generating response: {str(e)}")
                response = "I couldn't process your request. Please try again."
            
        return response

    def transcribe_live_audio(self):
        """Capture and transcribe live audio"""
        logger.info("Listening for voice input...")
        with sr.Microphone() as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
            self.recognizer.dynamic_energy_threshold = True
            print("Speak your query (say 'exit' to quit):")
            try:
                audio = self.recognizer.listen(source, timeout=10, phrase_time_limit=60)
                logger.info("Transcribing live audio...")
                text = self.recognizer.recognize_google(audio).lower()
                logger.info(f"Transcribed: {text}")
                return text
            except sr.WaitTimeoutError:
                logger.warning("No audio detected")
                return None
            except sr.UnknownValueError:
                logger.warning("Could not understand audio")
                return None
            except sr.RequestError as e:
                logger.error(f"Speech recognition error: {str(e)}")
                return None

    async def start_chatbot(self):
        """Start interactive chatbot"""
        logger.info("Starting chatbot...")
        print("Started. Say 'exit' to quit.")
        
        while True:
            text = self.transcribe_live_audio()
            if text is None:
                print("No speech detected or unclear. Try again.")
                continue
            if text.strip().lower() == 'exit':
                print("Exiting...")
                break
                
            processed = self.process_text(text)
            language = processed['language']
            intent = processed['intent']
            logger.info(f"Intent: {intent}, Language: {language}")
            
            response = await self.generate_response(text, {}, language)
            
            print(f"\nResponse: {response}\n")
            
            try:
                responses = []
                if os.path.exists(self.response_file):
                    with open(self.response_file, 'r', encoding='utf-8') as f:
                        responses = json.load(f)
                responses.append({
                    'audio_file': 'live_input',
                    'transcription': text,
                    'intent': intent,
                    'language': language,
                    'response': response
                })
                with open(self.response_file, 'w', encoding='utf-8') as f:
                    json.dump(responses, f, indent=4, ensure_ascii=False)
                logger.info(f"Saved response to {self.response_file}")
            except Exception as e:
                logger.error(f"Error saving response: {str(e)}")
        
        logger.info("Chatbot stopped.")
        
    def text_to_speech(self, text):
        """Convert text to speech"""
        logger.info("Converting text to speech...")
        self.tts_engine.say(text)
        self.tts_engine.runAndWait()
        
    async def process_audio_files(self):
        """Process audio files in audio directory"""
        logger.info("Processing audio files...")
        responses = []
        
        for filename in os.listdir(self.audio_dir):
            if filename.endswith('.wav'):
                audio_path = os.path.join(self.audio_dir, filename)
                try:
                    text = self.transcribe_audio(audio_path)
                    if not text.strip():
                        logger.info(f"No transcription for {filename}")
                        continue
                        
                    logger.info(f"Transcribed {filename}: {text}")
                    
                    processed = self.process_text(text)
                    response = await self.generate_response(processed['text'], {}, processed['language'])
                    logger.info(f"Response for {filename}: {response}")
                    
                    responses.append({
                        'audio_file': filename,
                        'transcription': text,
                        'intent': processed['intent'],
                        'language': processed['language'],
                        'response': response
                    })
                    
                except Exception as e:
                    logger.error(f"Error processing {filename}: {str(e)}")
                    continue
        
        try:
            with open(self.response_file, 'w', encoding='utf-8') as f:
                json.dump(responses, f, indent=4, ensure_ascii=False)
            logger.info(f"Saved responses to {self.response_file}")
        except Exception as e:
            logger.error(f"Error saving responses: {str(e)}")
        
        return responses
        
    async def start(self):
        """Start voice assistant"""
        logger.info("Starting voice assistant...")
        logger.info(f"Data directory: {os.path.abspath(self.data_dir)}")
        logger.info(f"Transcripts directory: {os.path.abspath(self.transcripts_dir)}")
        logger.info(f"Audio directory: {os.path.abspath(self.audio_dir)}")
        
        await self.process_audio_files()
        logger.info("Finished processing audio files.")
        
        await self.start_chatbot()

if __name__ == "__main__":
    assistant = VoiceAssistant(
        data_dir="data_files",
        transcripts_dir="transcript",
        audio_dir="audio"
    )
    asyncio.run(assistant.start())