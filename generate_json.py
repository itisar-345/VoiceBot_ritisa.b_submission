# generate_json.py
import json
import os
import sys

# Add the directory containing the data files to the Python path
sys.path.append('voicebot_ritisa.b_submission/data/documents')

# Import data from the Python files
try:
    from documentdata import data as documentData
    from platformdata import data as platformData
    from profiledata import data as profileData
except ImportError as e:
    print(f"Error importing data: {e}")
    sys.exit(1)

# Define the target directory for JSON files
json_dir = 'backend/src/services'
os.makedirs(json_dir, exist_ok=True)

# Write data to JSON files
try:
    with open(os.path.join(json_dir, 'documentdata.json'), 'w') as f:
        json.dump(documentData, f, indent=2)

    with open(os.path.join(json_dir, 'platformdata.json'), 'w') as f:
        json.dump(platformData, f, indent=2)

    with open(os.path.join(json_dir, 'profiledata.json'), 'w') as f:
        json.dump(profileData, f, indent=2)

    print("JSON files generated successfully in backend/src/services/")

except IOError as e:
    print(f"Error writing JSON files: {e}")
    sys.exit(1)