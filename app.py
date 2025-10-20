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
        """
        Parse le nom du dossier pour gérer deux formats :
        1. Classique 4 derniers chiffres : NOM + SDPP
        2. Nouveau format avec coordonnées : NOMx1,x2,... (virgules ou points)
           - NOM = nom affiché
           - x1 = section (1-8)
           - x2 = distance (0..40)
           - x3 = position/angle (0..40 ou autre selon ton radar)
           Exemple: Test3,2.5,15.7
        """
        name = folder_name
        coords = []

        # Si on trouve une virgule ou un point, on parse les coordonnées
        if ',' in folder_name or '.' in folder_name:
            # Séparer le nom et les chiffres
            parts = folder_name.replace('.', ',').split(',')
            name = parts[0]
            try:
                coords = [float(p) for p in parts[1:]]
            except ValueError:
                print(f"⚠️ Ignoré '{folder_name}': coordonnées invalides")
                return None

            # Au moins section et distance
            if len(coords) < 2:
                print(f"⚠️ Ignoré '{folder_name}': coordonnées insuffisantes")
                return None

            section = int(coords[0])
            distance = float(coords[1])
            position = float(coords[2]) if len(coords) > 2 else 1

            # Validation section
            if section < 1 or section > 8:
                print(f"⚠️ Ignoré '{folder_name}': section doit être entre 1 et 8")
                return None

            # Limiter distance
            if distance < 0:
                distance = 0
            if distance > 40:
                distance = 40

            return {
                "name": name,
                "section": section,
                "distance": distance,
                "position": position
            }

        else:
            # Ancien format : 4 derniers chiffres
            digits = ""
            for i in range(len(folder_name) - 1, -1, -1):
                if folder_name[i].isdigit():
                    digits = folder_name[i] + digits
                else:
                    name = folder_name[:i+1]
                    break

            if len(digits) != 4:
                print(f"⚠️ Ignoré '{folder_name}': doit avoir 4 chiffres (ex: PHP32586)")
                return None

            try:
                section = int(digits[0])
                distance = int(digits[1]) * 10
                position_raw = int(digits[2:4])
                if section < 1 or section > 8:
                    print(f"⚠️ Ignoré '{folder_name}': section doit être entre 1 et 8")
                    return None
                if distance > 40:
                    distance = 40
                position = int((position_raw / 99) * 19) + 1
                if position < 1:
                    position = 1
                if position > 20:
                    position = 20
                return {
                    "name": name,
                    "section": section,
                    "distance": distance,
                    "position": position
                }
            except Exception as e:
                print(f"⚠️ Erreur parsing '{folder_name}': {e}")
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
                    print(f"✓ {tech_info['name']} → Section {tech_info['section']}, "
                          f"Distance {tech_info['distance']}, Position {tech_info['position']}")

@app.route("/")
def index():
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
