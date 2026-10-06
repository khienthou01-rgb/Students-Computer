"""
Module: Student Agent Configuration Manager
Handles persistent agent credentials and classroom binding.
"""
import os
import json

DEFAULT_CONFIG_DIR = os.path.join(os.environ.get('ProgramData', 'C:\\ProgramData'), 'TIS-Lab-Agent')
LOCAL_CONFIG_DIR = os.path.dirname(os.path.abspath(__file__))

def get_config_path():
    # Prefer local config file if present, otherwise system ProgramData
    local_path = os.path.join(LOCAL_CONFIG_DIR, 'agent_config.json')
    if os.path.exists(local_path):
        return local_path
    return os.path.join(DEFAULT_CONFIG_DIR, 'agent_config.json')

def load_config():
    path = get_config_path()
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[Config] Error reading {path}: {e}")
    return {}

def save_config(config_data):
    path = get_config_path()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(config_data, f, indent=2, ensure_ascii=False)
    print(f"[Config] Saved credentials to {path}")
