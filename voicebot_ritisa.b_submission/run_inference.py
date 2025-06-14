from modules.asr_module import ASRModule
from modules.nlp_pipeline import NLPPipeline
from modules.utils import load_audio_files_from_dir, load_json_files_from_dir
import json
import os
from tqdm import tqdm

def batch_process(data_dir, output_dir="output"):
    """Batch process audio and JSON files in a directory"""
    os.makedirs(output_dir, exist_ok=True)
    
    # Initialize modules
    asr = ASRModule()
    nlp = NLPPipeline()
    
    # Process audio files
    audio_files = load_audio_files_from_dir(data_dir)
    audio_results = {}
    
    print(f"Processing {len(audio_files)} audio files...")
    for audio_file in tqdm(audio_files):
        try:
            transcription = asr.transcribe(audio_file)
            if transcription:
                nlp_results = nlp.process_text(transcription)
                audio_results[audio_file] = {
                    "transcription": transcription,
                    "nlp_results": nlp_results
                }
        except Exception as e:
            print(f"Error processing {audio_file}: {str(e)}")
    
    # Save audio results
    with open(os.path.join(output_dir, "audio_results.json"), 'w', encoding='utf-8') as f:
        json.dump(audio_results, f, ensure_ascii=False, indent=2)
    
    # Process JSON files
    json_files = load_json_files_from_dir(data_dir)
    json_results = {}
    
    print(f"Processing {len(json_files)} JSON files...")
    for json_file in tqdm(json_files):
        try:
            nlp_results = nlp.process_json(json_file)
            json_results[json_file] = nlp_results
        except Exception as e:
            print(f"Error processing {json_file}: {str(e)}")
    
    # Save JSON results
    with open(os.path.join(output_dir, "json_results.json"), 'w', encoding='utf-8') as f:
        json.dump(json_results, f, ensure_ascii=False, indent=2)
    
    print(f"Processing complete. Results saved to {output_dir}")

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", type=str, required=True, help="Directory containing audio and JSON files")
    parser.add_argument("--output_dir", type=str, default="output", help="Output directory for results")
    args = parser.parse_args()
    
    batch_process(args.data_dir, args.output_dir)