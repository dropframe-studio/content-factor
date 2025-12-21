import PySimpleGUI as sg
import sqlite3
from datetime import datetime
import os

# === DATABASE SETUP ===
DB_PATH = 'content_factory_atoms.db'

def init_database():
    """Initialize the atoms database"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS atoms
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  content TEXT NOT NULL,
                  atom_type TEXT,
                  project TEXT,
                  tags TEXT,
                  created_at TEXT,
                  status TEXT DEFAULT 'captured')''')
    conn.commit()
    conn.close()

def capture_atom(content, atom_type, project, tags):
    """Store an atom in the database"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""INSERT INTO atoms 
                 (content, atom_type, project, tags, created_at) 
                 VALUES (?, ?, ?, ?, ?)""",
              (content, atom_type, project, tags, datetime.now().isoformat()))
    conn.commit()
    atom_id = c.lastrowid
    conn.close()
    return atom_id

def get_recent_atoms(limit=10):
    """Retrieve recent atoms"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""SELECT id, content, atom_type, project, created_at 
                 FROM atoms 
                 ORDER BY created_at DESC 
                 LIMIT ?""", (limit,))
    rows = c.fetchall()
    conn.close()
    return rows

def get_atom_count():
    """Get total atom count"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM atoms")
    count = c.fetchone()[0]
    conn.close()
    return count

# === GUI SETUP ===
sg.theme('DarkGrey13')

# Atom type presets
ATOM_TYPES = ['Observation', 'Idea', 'Quote', 'Task', 'Insight', 'Note', 'Reference']
PROJECT_PRESETS = ['VSM School', 'Radiant Seven', 'Content Factory', 'Clearline7', 'Personal']

# Layout
layout = [
    [sg.Text('CONTENT FACTORY', font='Courier 18 bold', justification='center', expand_x=True)],
    [sg.Text('Asset Capture Tool', font='Courier 10', justification='center', expand_x=True)],
    [sg.HorizontalSeparator()],
    
    # Content input
    [sg.Text('ATOM CONTENT:', font='Courier 10 bold')],
    [sg.Multiline(size=(70, 8), key='-CONTENT-', focus=True, 
                  font='Courier 11', autoscroll=True)],
    
    # Metadata
    [sg.Text('TYPE:', size=(8,1)), 
     sg.Combo(ATOM_TYPES, key='-TYPE-', size=(20,1), default_value='Note'),
     sg.Text('PROJECT:', size=(10,1)), 
     sg.Combo(PROJECT_PRESETS, key='-PROJECT-', size=(20,1))],
    
    [sg.Text('TAGS:', size=(8,1)), 
     sg.Input(key='-TAGS-', size=(54,1), tooltip='Comma-separated tags')],
    
    [sg.HorizontalSeparator()],
    
    # Actions
    [sg.Button('CAPTURE', size=(12,1), bind_return_key=True, button_color=('white', '#2e7d32')),
     sg.Button('VIEW RECENT', size=(12,1)),
     sg.Button('CLEAR', size=(12,1)),
     sg.Push(),
     sg.Text('', key='-COUNTER-', font='Courier 10', size=(20,1))],
    
    [sg.Text('', key='-STATUS-', size=(70,1), font='Courier 10', text_color='yellow')],
    
    [sg.HorizontalSeparator()],
    
    # Recent atoms display
    [sg.Text('RECENT CAPTURES:', font='Courier 10 bold')],
    [sg.Multiline(size=(70, 10), key='-RECENT-', disabled=True, 
                  font='Courier 9', autoscroll=True, background_color='#1e1e1e')]
]

# Create window
window = sg.Window('Content Factory Atom Capture', layout, 
                   finalize=True, resizable=True)

# Initialize database
init_database()

# Update counter
def update_counter():
    count = get_atom_count()
    window['-COUNTER-'].update(f'Total Atoms: {count}')

update_counter()

# === EVENT LOOP ===
while True:
    event, values = window.read()
    
    if event == sg.WIN_CLOSED:
        break
    
    if event == 'CAPTURE':
        content = values['-CONTENT-'].strip()
        
        if not content:
            window['-STATUS-'].update('⚠ Content cannot be empty')
            continue
        
        atom_type = values['-TYPE-']
        project = values['-PROJECT-']
        tags = values['-TAGS-'].strip()
        
        # Capture the atom
        atom_id = capture_atom(content, atom_type, project, tags)
        
        # Update status
        window['-STATUS-'].update(f'✓ Atom #{atom_id} captured at {datetime.now().strftime("%H:%M:%S")}')
        
        # Clear inputs
        window['-CONTENT-'].update('')
        window['-TAGS-'].update('')
        window['-CONTENT-'].set_focus()
        
        # Update counter
        update_counter()
    
    if event == 'VIEW RECENT':
        atoms = get_recent_atoms(10)
        
        if not atoms:
            window['-RECENT-'].update('No atoms captured yet.')
        else:
            recent_text = []
            for atom in atoms:
                atom_id, content, atom_type, project, created = atom
                timestamp = datetime.fromisoformat(created).strftime('%Y-%m-%d %H:%M')
                
                # Truncate content for display
                display_content = content[:80] + '...' if len(content) > 80 else content
                
                recent_text.append(f"[{atom_id}] {timestamp} | {atom_type or 'Note'} | {project or 'N/A'}")
                recent_text.append(f"    {display_content}")
                recent_text.append("")
            
            window['-RECENT-'].update('\n'.join(recent_text))
        
        window['-STATUS-'].update(f'Showing last {len(atoms)} atoms')
    
    if event == 'CLEAR':
        window['-CONTENT-'].update('')
        window['-TAGS-'].update('')
        window['-CONTENT-'].set_focus()
        window['-STATUS-'].update('Inputs cleared')

window.close()
