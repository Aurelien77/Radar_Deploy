import os
import json
import math
import random
import traceback
import threading
from datetime import datetime
from flask import Flask, render_template, abort, request, jsonify

# ───────────────────────────────────────────────
# CONFIGURATION
# ───────────────────────────────────────────────

app = Flask(__name__)
app.config['APPLICATION_ROOT'] = '/radar'

COMMENTS_FILE = "comments.json"
lock = threading.Lock()

# Création automatique du fichier commentaires
if not os.path.exists(COMMENTS_FILE):
    with open(COMMENTS_FILE, "w", encoding="utf-8") as f:
        json.dump({}, f)

# ───────────────────────────────────────────────
# CLASSE RADAR
# ───────────────────────────────────────────────

class InteractiveRadar:
    def __init__(self, json_config_path=None, radar_type="veille"):
        self.json_config_path = json_config_path
        self.radar_type = radar_type
        self.sections = {}
        self.rings = {}
        self.ring_colors = {}
        self.technologies = []
        self.anti_collision_enabled = True
        self.min_distance_between_points = 12.0

    def set_default_config(self):
        if not self.sections:
            if self.radar_type == "veille":
                self.sections = {
                    1: "Linters Java",
                    2: "Analyse Statique Java",
                    3: "Formatters Java",
                    4: "Linters TypeScript / Angular",
                    5: "Analyse Qualité Frontend",
                    6: "Formatters Frontend",
                    7: "Sécurité & SAST",
                    8: "CI / Qualité de Code",
                    9: "Tests & Coverage",
                    10: "Build Tools Java",
                    11: "Build Tools Frontend"
                }
            elif self.radar_type == "veilleIA":
                self.sections = {
                    1: "IA Générative (Texte)",
                    2: "IA Générative (Images)",
                    3: "Vision par Ordinateur",
                    4: "NLP / LLM / Chatbots",
                    5: "ML & Data Science",
                    6: "Agents Autonomes",
                    7: "IA Audio / Speech",
                    8: "MLOps & Infrastructure IA"
                }
            else:
                self.sections = {
                    1: "Librairies",
                    2: "Optimisations",
                    3: "API",
                    4: "Performances",
                    5: "Middlewares",
                    6: "Routes",
                    7: "Composants"
                }

        if not self.rings:
            self.rings = {
                "A Adopter": (0, 50),
                "A Evaluer": (51, 75),
                "Dépassé": (76, 100)
            }

        if not self.ring_colors:
            self.ring_colors = {
                "A Adopter": "#93c47d",
                "A Evaluer": "#f6b26b",
                "Dépassé": "#e06666"
            }

    def get_ring_name(self, distance):
        for ring_name, (min_d, max_d) in self.rings.items():
            if min_d <= distance <= max_d:
                return ring_name
        return list(self.rings.keys())[-1]

    def polar_to_cartesian(self, section, distance, position_h):
        distance_units = (distance / 100.0) * 40.0
        num_sections = len(self.sections)
        section_angle = 360 / num_sections
        angle_start = (section - 1) * section_angle - 90
        angle_deg = angle_start + (position_h / 100.0) * section_angle
        angle_rad = angle_deg * math.pi / 180
        x = distance_units * math.cos(angle_rad)
        y = distance_units * math.sin(angle_rad)
        return x, y

    def load_from_json(self):
        self.technologies = []

        if not self.json_config_path or not os.path.exists(self.json_config_path):
            return

        try:
            with open(self.json_config_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            if "sections" in data:
                self.sections = {int(k): v for k, v in data["sections"].items()}

            if "rings" in data:
                self.rings = {k: tuple(v) for k, v in data["rings"].items()}

            if "ring_colors" in data:
                self.ring_colors = data["ring_colors"]

            self.set_default_config()

            for tech_data in data.get("technologies", []):
                name = tech_data.get("name")
                section = int(tech_data.get("section", 1))
                distance = float(tech_data.get("distance", 50))
                position = float(tech_data.get("position", 50))
                ring = self.get_ring_name(distance)
                x, y = self.polar_to_cartesian(section, distance, position)

                tech_info = tech_data.copy()
                tech_info.update({
                    "section": section,
                    "distance": distance,
                    "position": position,
                    "ring": ring,
                    "x": x,
                    "y": y
                })

                self.technologies.append(tech_info)

        except Exception as e:
            print("Erreur chargement radar:", e)

# ───────────────────────────────────────────────
# COMMENTAIRES (JSON = MINI DB)
# ───────────────────────────────────────────────

def read_comments():
    try:
        with open(COMMENTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return {}

def write_comments(data):
    with lock:
        with open(COMMENTS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

            # ───────────────────────────────────────────────
# UTILITAIRE : LISTE DE TOUS LES RADARS
# ───────────────────────────────────────────────

def get_all_radars():
    """Scanne JsonMap/ et retourne la liste de tous les radars disponibles."""
    radars = []
    if not os.path.exists("JsonMap"):
        return radars

    for filename in sorted(os.listdir("JsonMap")):
        if not filename.endswith(".json"):
            continue

        radar_name = filename.replace(".json", "")
        json_path = f"JsonMap/{filename}"

        # Lit le radar_name et radar_type depuis le fichier
        display_name = radar_name.replace("_", " ").title()
        radar_type = "veille"  # valeur par défaut

        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            if "radar_name" in data:
                display_name = data["radar_name"]
            if "radar_type" in data:
                radar_type = data["radar_type"]
        except Exception as e:
            print(f"Erreur lecture {filename} :", e)

        radars.append({
            "name": radar_name,
            "display_name": display_name,
            "url": f"/{radar_name}",
            "type": radar_type
        })

    return radars

@app.route("/add_comment", methods=["POST"])
def add_comment():
    data = request.json
    tech = data.get("technology")

    comment = {
        "nom": data.get("nom", ""),
        "prenom": data.get("prenom", ""),
        "poste": data.get("poste", ""),
        "commentaire": data.get("commentaire", ""),
        "timestamp": datetime.now().isoformat()
    }

    comments = read_comments()
    comments.setdefault(tech, []).append(comment)
    write_comments(comments)

    return jsonify({"status": "ok", "comment": comment})

@app.route("/get_comments/<technology>")
def get_comments(technology):
    comments = read_comments()
    return jsonify(comments.get(technology, []))

@app.route("/delete_comment", methods=["POST"])
def delete_comment():
    data = request.json
    tech = data.get("technology")
    ts = data.get("timestamp")

    comments = read_comments()
    if tech in comments:
        comments[tech] = [c for c in comments[tech] if c["timestamp"] != ts]
        write_comments(comments)

    return jsonify({"status": "ok"})

# ───────────────────────────────────────────────
# ROUTES RADAR
# ───────────────────────────────────────────────

@app.route("/")
def index():
    # Charge le premier radar trouvé dans JsonMap/
    default_radar = None
    if os.path.exists("JsonMap"):
        files = [f.replace(".json", "") for f in os.listdir("JsonMap") if f.endswith(".json")]
        if files:
            default_radar = files[0]

    if default_radar:
        return radar_page(default_radar)  # Réutilise la route existante

    # Sinon, page vide
    return render_template(
        "radar_universal.html",
        technologies=[],
        sections={},
        colors={},
        current_page_name="Radar",
        current_page="",
        radar_type="veille",
        all_radars=[]
    )


@app.route("/<radar_name>")
def radar_page(radar_name):
    json_path = f"JsonMap/{radar_name}.json"
    radar = InteractiveRadar(json_path)
    radar.load_from_json()

    # Récupère les infos d'affichage depuis le JSON chargé
    display_name = radar_name.replace("_", " ").title()
    radar_type = radar.radar_type

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if "radar_name" in data:
            display_name = data["radar_name"]
        if "radar_type" in data:
            radar_type = data["radar_type"]
    except:
        pass

    return render_template(
        "radar_universal.html",
        technologies=radar.technologies,
        sections=radar.sections,
        colors=radar.ring_colors,
        current_page_name=display_name,
        current_page=radar_name,
        radar_type=radar_type,
        all_radars=get_all_radars()   # ← ici, la liste est désormais peuplée
    )
# ───────────────────────────────────────────────
# LANCEMENT
# ───────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True)
