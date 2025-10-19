import os
import json
from flask import Flask, render_template, url_for

app = Flask(__name__)

# Configuration pour le préfixe /radar
app.config['APPLICATION_ROOT'] = '/radar'

class InteractiveRadar:
    def __init__(self, root_path="map_dossiers"):
        self.root_path = root_path
        self.sections = {
            1: "Objets OT",
            2: "Monitoring",
            3: "Language Backend",
            4: "Cyber Secu",
            5: "BD et ORM",
            6: "Cloud et intégration",
            7: "Language Frontend",
            8: "Sondes et relevés"
        }
        self.rings = {
            "Adopt": (0, 10),
            "Trial": (10, 20),
            "Assess": (20, 30),
            "Hold": (30, 40)
        }
        self.ring_colors = {
            "Adopt": "#93c47d",
            "Trial": "#76a5af",
            "Assess": "#f6b26b",
            "Hold": "#e06666"
        }
        self.technologies = []
    
    def parse_folder_name(self, folder_name):
        digits = ""
        name = folder_name
        for i in range(len(folder_name)-1, -1, -1):
            if folder_name[i].isdigit():
                digits = folder_name[i] + digits
            else:
                name = folder_name[:i+1]
                break
        if len(digits) < 3:
            return None
        try:
            section = int(digits[0])
            distance = int(digits[1:3])
            position = int(digits[3:]) if len(digits) > 3 else 10
            if section < 1 or section > 8: 
                return None
            if distance < 0 or distance > 40: 
                return None
            if position < 1 or position > 20: 
                position = 10
            return {
                "name": name, 
                "section": section, 
                "distance": distance, 
                "position": position
            }
        except:
            return None
    
    def get_ring_name(self, distance):
        for ring_name, (min_d, max_d) in self.rings.items():
            if min_d <= distance < max_d:
                return ring_name
        return "Hold"
    
    def read_folder_content(self, folder_path):
        files = []
        try:
            for item in os.listdir(folder_path):
                item_path = os.path.join(folder_path, item)
                if os.path.isfile(item_path):
                    try:
                        with open(item_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                    except:
                        try:
                            with open(item_path, 'r', encoding='latin-1') as f:
                                content = f.read()
                        except:
                            content = "[Impossible de lire ce fichier]"
                    files.append({"name": item, "content": content})
        except Exception as e:
            print(f"Erreur lecture dossier {folder_path}: {e}")
        return files
    
    def scan_folders(self):
        self.technologies = []
        if not os.path.exists(self.root_path):
            print(f"⚠️  Le dossier '{self.root_path}' n'existe pas !")
            return
        
        for item in os.listdir(self.root_path):
            item_path = os.path.join(self.root_path, item)
            if os.path.isdir(item_path) and not item.startswith('.'):
                tech_info = self.parse_folder_name(item)
                if tech_info:
                    tech_info["ring"] = self.get_ring_name(tech_info["distance"])
                    tech_info["folder"] = item
                    tech_info["files"] = self.read_folder_content(item_path)
                    self.technologies.append(tech_info)

@app.route("/")
def index():
    # Créer une nouvelle instance à chaque requête
    radar = InteractiveRadar()
    radar.scan_folders()
    
    return render_template(
        "radar.html",
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors)
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
