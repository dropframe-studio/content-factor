import PySimpleGUI as sg
import json
import os
from datetime import datetime

# === PATHS ===
LINKS_JSON_PATH = 'data/links/rsys_core.json'
ARTIFACTS_DIR = 'data/artifacts'

# Ensure directories exist
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

# === LOGIC: LINK REGISTRY ===
def load_rsys_links():
    """Load the 16-link registry from JSON"""
    try:
        with open(LINKS_JSON_PATH, 'r') as f:
            return json.load(f)
    except Exception as e:
        # Fallback if file missing
        return {"links": []}

def save_rsys_links(data):
    """Save the updated registry back to JSON"""
    with open(LINKS_JSON_PATH, 'w') as f:
        json.dump(data, f, indent=2)

def update_link_coordinates(link_id, coord_type, path, rank):
    """Adds a new coordinate to a specific link in the neat pile"""
    data = load_rsys_links()
    for link in data['links']:
        if link['link_id'] == link_id:
            # Ensure the target key exists in coordinates
            if coord_type not in link['coordinates']:
                link['coordinates'][coord_type] = []
            
            # Append the new 'bull' (string + rank)
            new_entry = {"path": path, "rank": int(rank) if rank.isdigit() else None}
            link['coordinates'][coord_type].append(new_entry)
            save_rsys_links(data)
            return True
    return False

# === LOGIC: ARTIFACT CAPTURE ===
def capture_local_artifact(content, atom_type, link_id, tags):
    """Saves a standalone JSON artifact to the filesystem"""
    timestamp = datetime.now()
    file_id = f"{atom_type.lower()}-{timestamp.strftime('%Y%m%d-%H%M%S')}"
    
    artifact = {
        "id": file_id,
        "type": atom_type,
        "link_id": link_id,
        "createdAt": timestamp.isoformat(),
        "payload": {
            "content": content,
            "tags": [t.strip() for t in tags.split(',')] if tags else []
        }
    }
    
    file_path = os.path.join(ARTIFACTS_DIR, f"{file_id}.json")
    with open(file_path, 'w') as f:
        json.dump(artifact, f, indent=2)
    return file_id

# === GUI SETUP ===
sg.theme('DarkGrey13')

# Prep Data for UI
registry = load_rsys_links()
LINK_IDS = [l['link_id'] for l in registry['links']]
COORD_TYPES = ['local_dirs', 'git_repos', 'google_drive', 'notion', 'external_web']
ATOM_TYPES = ['Observation', 'Insight', 'Task', 'Note', 'Reference']

layout = [
    [sg.Text('CONTENT FACTOR: LINK MASTER', font='Courier 18 bold', expand_x=True, justification='center')],
    [sg.Text('Universal Inventory & Asset Capture', font='Courier 10', expand_x=True, justification='center')],
    [sg.HorizontalSeparator()],

    # 1. LINK SELECTION & UPDATE
    [sg.Text('1. MANAGE CORES', font='Courier 11 bold', text_color='#007acc')],
    [sg.Text('SELECT LINK:', size=(12,1)), sg.Combo(LINK_IDS, key='-LINK-ID-', size=(20,1), enable_events=True),
     sg.Text('RANK:', size=(5,1)), sg.Input('1', key='-RANK-', size=(5,1))],
    
    [sg.Text('ADD COORD:', size=(12,1)), sg.Input(key='-COORD-PATH-', size=(40,1), placeholder_text='URL or Path'),
     sg.Combo(COORD_TYPES, key='-COORD-TYPE-', default_value='notion', size=(12,1))],
    
    [sg.Button('UPDATE REGISTRY', size=(15,1), button_color=('white', '#007acc')), sg.Push(), 
     sg.Text('Status:', font='Courier 9'), sg.Text('Idle', key='-REG-STATUS-', text_color='yellow')],

    [sg.HorizontalSeparator()],

    # 2. ATOM CAPTURE
    [sg.Text('2. CAPTURE ATOM', font='Courier 11 bold', text_color='#2e7d32')],
    [sg.Multiline(size=(70, 6), key='-CONTENT-', font='Courier 11', placeholder_text='Enter observation or note here...')],
    
    [sg.Text('TYPE:', size=(12,1)), sg.Combo(ATOM_TYPES, key='-ATOM-TYPE-', default_value='Observation', size=(20,1)),
     sg.Text('TAGS:', size=(6,1)), sg.Input(key='-TAGS-', size=(26,1))],

    [sg.Button('CAPTURE ATOM', size=(15,1), button_color=('white', '#2e7d32')), sg.Push(),
     sg.Button('CLEAR', size=(10,1))],
    
    [sg.Text('', key='-STATUS-', size=(70,1), font='Courier 10 italic', text_color='cyan')],
]

window = sg.Window('Content Factor v2.0', layout, finalize=True)

# === EVENT LOOP ===
while True:
    event, values = window.read()

    if event == sg.WIN_CLOSED:
        break

    # Action: Update the Registry (The Neat Pile)
    if event == 'UPDATE REGISTRY':
        link_id = values['-LINK-ID-']
        path = values['-COORD-PATH-'].strip()
        c_type = values['-COORD-TYPE-']
        rank = values['-RANK-']

        if not link_id or not path:
            window['-REG-STATUS-'].update('⚠ ID/Path Required')
            continue

        if update_link_coordinates(link_id, c_type, path, rank):
            window['-REG-STATUS-'].update(f'✓ {link_id} Updated')
            window['-COORD-PATH-'].update('')
        else:
            window['-REG-STATUS-'].update('❌ Update Failed')

    # Action: Capture Standalone Atom
    if event == 'CAPTURE ATOM':
        content = values['-CONTENT-'].strip()
        if not content:
            window['-STATUS-'].update('⚠ Content cannot be empty')
            continue

        link_id = values['-LINK-ID-'] or 'GLOBAL'
        atom_type = values['-ATOM-TYPE-']
        tags = values['-TAGS-']

        file_id = capture_local_artifact(content, atom_type, link_id, tags)
        window['-STATUS-'].update(f'✓ Captured {file_id}.json')
        window['-CONTENT-'].update('')
        window['-TAGS-'].update('')

    if event == 'CLEAR':
        for key in ['-CONTENT-', '-TAGS-', '-COORD-PATH-']:
            window[key].update('')
        window['-STATUS-'].update('Cleared.')

window.close()
