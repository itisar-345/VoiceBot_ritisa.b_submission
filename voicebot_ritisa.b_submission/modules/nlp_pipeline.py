from sentence_transformers import SentenceTransformer
from faiss import IndexFlatIP
import numpy as np
import json

class NLPPipeline:
    def __init__(self):
        # ... (previous init code)
        self.embedding_model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')
        self.vector_index = None
        self.documents = []
        self.load_rag_components()
    
    def load_rag_components(self):
        """Load documents and build vector index"""
        # Load your JSX/JS documents
        self.load_documents("data/documents/")
        
        # Generate embeddings
        doc_texts = [doc['content'] for doc in self.documents]
        embeddings = self.embedding_model.encode(doc_texts, show_progress_bar=True)
        
        # Create FAISS index
        self.vector_index = IndexFlatIP(embeddings.shape[1])
        self.vector_index.add(embeddings)
    
    def load_documents(self, dir_path):
        """Load and parse JSX/JS documents"""
        for file in os.listdir(dir_path):
            if file.endswith(('.js', '.jsx')):
                with open(os.path.join(dir_path, file), 'r', encoding='utf-8') as f:
                    content = f.read()
                    self.documents.append({
                        'source': file,
                        'content': content
                    })
    
    def retrieve_context(self, query_embedding, top_k=3):
        """Retrieve relevant context using vector similarity"""
        D, I = self.vector_index.search(np.array([query_embedding]), top_k)
        return [self.documents[i] for i in I[0]]
    
    def process_with_rag(self, text):
        """Full processing with RAG"""
        # Standard NLP processing
        nlp_results = self.process_text(text)
        
        # Generate embedding for the query
        query_embedding = self.embedding_model.encode(text)
        
        # Retrieve relevant context
        context = self.retrieve_context(query_embedding)
        nlp_results['context'] = context
        
        return nlp_results