import os
import json
import math
import random
import traceback
from flask import Flask, render_template, abort, request, jsonify
from datetime import datetime
import threading

app = Flask(__name__)
app.config['APPLICATION_ROOT'] = '/radar'

COMMENTS_FILE = "comments.json"
lock = threading.Lock()  # Pour éviter les collisions d'écriture sur comments.json


class InteractiveRadar:
    def __init__(self, json_config_path=None, radar_type="veille"):
        self.json_config_path = json_config_path
        self.radar_type = radar_type

        # Initialisation vide – sera rempli depuis le JSON en priorité
        self.sections = {}
        self.rings = {}
        self.ring_colors = {}

        self.technologies = []
        self.anti_collision_enabled = True
        self.min_distance_between_points = 12.0

    def set_default_config(self):
        """
        Définit les valeurs par défaut UNIQUEMENT si le JSON ne les fournit pas.
        Appelée APRÈS la lecture du JSON.
        """
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
            else:  # application
                self.sections = {
                    1: "Librairies",
                    2: "Optimisations",
                    3: "API",
                    4: "Performances",
                    5: "Middlewares",
                    6: "Routes",
                    7: "Composants"
                }
            print("ℹ️  Sections par défaut utilisées (non définies dans le JSON)")

        if not self.rings:
            if self.radar_type in ["veille", "veilleIA"]:
                self.rings = {
                    "A Adopter": (0, 50),
                    "A Evaluer": (51, 75),
                    "Dépassé": (76, 100)
                }
            else:
                self.rings = {
                    "Infrastructure": (0, 33),
                    "Backend": (34, 66),
                    "Frontend": (67, 100)
                }
            print("ℹ️  Anneaux par défaut utilisés")

        if not self.ring_colors:
            if self.radar_type in ["veille", "veilleIA"]:
                self.ring_colors = {
                    "A Adopter": "#93c47d",
                    "A Evaluer": "#f6b26b",
                    "Dépassé": "#e06666"
                }
            else:
                self.ring_colors = {
                    "Infrastructure": "#667eea",
                    "Backend": "#764ba2",
                    "Frontend": "#f093fb"
                }
            print("ℹ️  Couleurs par défaut utilisées")

    def get_ring_name(self, distance):
        for ring_name, (min_d, max_d) in self.rings.items():
            if min_d <= distance <= max_d:
                return ring_name
        return list(self.rings.keys())[-1] if self.rings else "Inconnu"

    def read_linked_content(self, link_path):
        """Lit le contenu d'un fichier ou dossier lié"""
        files = []

        if not os.path.exists(link_path):
            return files

        if os.path.isfile(link_path):
            try:
                with open(link_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except:
                try:
                    with open(link_path, 'r', encoding='latin-1') as f:
                        content = f.read()
                except Exception as e:
                    content = f"[Impossible de lire le fichier : {e}]"
            files.append({"name": os.path.basename(link_path), "content": content})

        elif os.path.isdir(link_path):
            try:
                for item in os.listdir(link_path):
                    item_path = os.path.join(link_path, item)
                    if os.path.isfile(item_path):
                        try:
                            with open(item_path, 'r', encoding='utf-8') as f:
                                content = f.read()
                        except:
                            try:
                                with open(item_path, 'r', encoding='latin-1') as f:
                                    content = f.read()
                            except Exception as e:
                                content = f"[Erreur lecture {item} : {e}]"
                        files.append({"name": item, "content": content})
            except Exception as e:
                files.append({"name": "Erreur dossier", "content": f"Erreur lecture dossier: {e}"})

        return files

    def detect_collision(self, x, y, existing_points):
        for point in existing_points:
            dist = math.sqrt((x - point['x'])**2 + (y - point['y'])**2)
            if dist < self.min_distance_between_points:
                return True
        return False

    def adjust_position_to_avoid_collision(self, section, distance, position, existing_points, max_attempts=50):
        original_position = position
        attempt = 0

        while attempt < max_attempts:
            x, y = self.polar_to_cartesian(section, distance, position)

            if not self.detect_collision(x, y, existing_points):
                if attempt > 0:
                    print(f"      ⚠️ Position ajustée : {original_position:.1f} → {position:.1f} (après {attempt} tentatives)")
                return position, x, y

            # Tentatives progressives
            if attempt < 10:
                position = original_position + (attempt * 2) if attempt % 2 == 0 else original_position - (attempt * 2)
            elif attempt < 30:
                position = original_position + (attempt * 5) if attempt % 2 == 0 else original_position - (attempt * 5)
            else:
                position = random.uniform(0, 100)

            position = max(0, min(position, 100))
            attempt += 1

        print(f"      ⚠️ Impossible d'éviter collision après {max_attempts} tentatives pour {section}")
        x, y = self.polar_to_cartesian(section, distance, original_position)
        return original_position, x, y

    def load_from_json(self):
        """Charge les technologies depuis le fichier JSON – CONSERVE TOUTES LES CLÉS"""
        self.technologies = []

        if not self.json_config_path or not os.path.exists(self.json_config_path):
            print(f"⚠️ Le fichier JSON '{self.json_config_path}' n'existe pas !")
            return

        print(f"\n🔍 Chargement depuis : {self.json_config_path}")
        print("=" * 80)

        try:
            with open(self.json_config_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Chargement prioritaire des sections / rings / couleurs depuis JSON
            if "sections" in data:
                self.sections = {int(k): v for k, v in data["sections"].items()}
                print(f"✨ Sections chargées depuis JSON : {len(self.sections)}")

            if "rings" in data:
                self.rings = {}
                for ring_name, limits in data["rings"].items():
                    if isinstance(limits, (list, tuple)) and len(limits) == 2:
                        self.rings[ring_name] = (limits[0], limits[1])
                print(f"✨ Anneaux chargés depuis JSON : {len(self.rings)}")

            if "ring_colors" in data:
                self.ring_colors = data["ring_colors"]
                print(f"✨ Couleurs chargées depuis JSON : {len(self.ring_colors)}")

            # Appliquer les valeurs par défaut si manquantes
            self.set_default_config()

            # Options anti-collision
            if "anti_collision" in data:
                self.anti_collision_enabled = data["anti_collision"]
            if "min_distance_between_points" in data:
                self.min_distance_between_points = data["min_distance_between_points"]

            print("=" * 80)

            existing_points = []

            for tech_data in data.get("technologies", []):
                name = tech_data.get("name")
                if not name:
                    continue

                section = int(tech_data.get("section", 0))
                distance = float(tech_data.get("distance", 50))
                position = float(tech_data.get("position", 50))
                links = tech_data.get("links", [])
                description = tech_data.get("description", "")

                if not (1 <= section <= len(self.sections)):
                    print(f"⚠️ Section invalide pour '{name}': {section}")
                    continue

                distance = max(0, min(distance, 100))
                position = max(0, min(position, 100))

                # Anti-collision
                if self.anti_collision_enabled:
                    position, x, y = self.adjust_position_to_avoid_collision(
                        section, distance, position, existing_points
                    )
                else:
                    x, y = self.polar_to_cartesian(section, distance, position)

                ring = self.get_ring_name(distance)

                # Fichiers liés
                files = []
                if links:
                    for link in links:
                        files.extend(self.read_linked_content(link))

                # Description inline si pas de fichiers
                if description and not files:
                    files.append({
                        "name": f"{name}_description.txt",
                        "content": description
                    })

                # Message par défaut si toujours vide
                if not files:
                    files.append({
                        "name": "info.txt",
                        "content": f"Technologie: {name}\nSection: {self.sections.get(section, 'Inconnue')}\nRing: {ring}"
                    })

                # IMPORTANT : copie TOUTES les propriétés originales du JSON
                tech_info = tech_data.copy()

                # Surcharge uniquement les champs calculés / normalisés
                tech_info["section"] = section
                tech_info["distance"] = distance
                tech_info["position"] = position
                tech_info["ring"] = ring
                tech_info["x"] = x
                tech_info["y"] = y
                tech_info["files"] = files
                tech_info["links"] = links

                self.technologies.append(tech_info)
                existing_points.append({'x': x, 'y': y})

                print(f"✓ {name:30s} | Sec: {section} | Dist: {distance:5.1f} | Pos: {position:5.1f} | Ring: {ring}")

            print("=" * 80)
            print(f"✅ Total: {len(self.technologies)} technologies chargées")
            if self.anti_collision_enabled:
                print(f"🛡️ Anti-collision activé (distance min: {self.min_distance_between_points} unités)")
            print()

        except json.JSONDecodeError as e:
            print(f"❌ Erreur JSON : {e}")
        except Exception as e:
            print(f"❌ Erreur lors du chargement : {e}")
            traceback.print_exc()

    def polar_to_cartesian(self, section, distance, position_h):
        distance_units = (distance / 100.0) * 40.0

        num_sections = len(self.sections)
        if num_sections == 0:
            return 0, 0

        section_angle = 360 / num_sections
        angle_start_js = (section - 1) * section_angle - 90
        angle_deg_js = angle_start_js + (position_h / 100.0) * section_angle
        angle_rad = angle_deg_js * math.pi / 180

        x = distance_units * math.cos(angle_rad)
        y = distance_units * math.sin(angle_rad)
        return x, y


def get_all_radars():
    radars = []
    json_dir = "JsonMap"

    if not os.path.exists(json_dir):
        return radars

    for filename in os.listdir(json_dir):
        if not filename.endswith('.json'):
            continue

        name_without_ext = filename[:-5]

        # Détection du type via suffixe ou nom
        if '=' in name_without_ext:
            prefix, suffix = name_without_ext.split('=', 1)
            suffix_lower = suffix.lower()
        else:
            prefix = name_without_ext
            suffix_lower = ""

        if suffix_lower.endswith(('application', 'app')):
            radar_type = 'application'
        elif suffix_lower.endswith(('veilleia', 'ia')):
            radar_type = 'veilleIA'
        elif suffix_lower.endswith('veille'):
            radar_type = 'veille'
        else:
            radar_type = 'veille'  # défaut

        display_name = (prefix or name_without_ext).replace('-', ' ').title()

        radars.append({
            'filename': filename,
            'name': name_without_ext,
            'display_name': display_name,
            'type': radar_type,
            'url': f"/{name_without_ext}"
        })

    radars.sort(key=lambda r: (r['type'], r['display_name']))
    return radars


@app.route("/")
def index():
    radars = get_all_radars()
    if not radars:
        abort(404, "Aucun radar disponible dans JsonMap/")

    # Priorité : veille → veilleIA → premier trouvé
    for typ in ['veille', 'veilleIA', 'application']:
        r = next((r for r in radars if r['type'] == typ), None)
        if r:
            return radar_page(r['name'])

    return radar_page(radars[0]['name'])


@app.route("/<radar_name>")
def radar_page(radar_name):
    json_path = f"JsonMap/{radar_name}.json"

    if not os.path.exists(json_path):
        abort(404, f"Radar '{radar_name}' non trouvé")

    # Détection type et nom d'affichage
    if '=' in radar_name:
        prefix, suffix = radar_name.split('=', 1)
        suffix_lower = suffix.lower()
        display_name = prefix.capitalize()
    else:
        suffix_lower = ""
        display_name = radar_name.capitalize()

    if suffix_lower.endswith(('application', 'app')):
        radar_type = 'application'
    elif suffix_lower.endswith(('veilleia', 'ia')):
        radar_type = 'veilleIA'
    elif suffix_lower.endswith('veille'):
        radar_type = 'veille'
    else:
        radar_type = 'veille'

    radar = InteractiveRadar(json_config_path=json_path, radar_type=radar_type)
    radar.load_from_json()

    all_radars = get_all_radars()

    return render_template(
        'radar_universal.html',
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name=display_name,
        current_page=radar_name,
        radar_type=radar_type,
        all_radars=all_radars
    )


# ───────────────────────────────────────────────
# Gestion des commentaires (inchangée)
# ───────────────────────────────────────────────

def read_comments():
    if not os.path.exists(COMMENTS_FILE):
        return {}
    try:
        with open(COMMENTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return {}


def write_comments(data):
    with lock:
        with open(COMMENTS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)


@app.route("/add_comment", methods=["POST"])
def add_comment():
    data = request.json
    tech_name = data.get("technology")
    if not tech_name:
        return jsonify({"status": "error", "message": "technology requis"}), 400

    comment = {
        "nom": data.get("nom", ""),
        "prenom": data.get("prenom", ""),
        "poste": data.get("poste", ""),
        "commentaire": data.get("commentaire", ""),
        "timestamp": datetime.now().isoformat()
    }

    comments = read_comments()
    if tech_name not in comments:
        comments[tech_name] = []
    comments[tech_name].append(comment)
    write_comments(comments)

    return jsonify({"status": "ok", "comment": comment})


@app.route("/delete_comment", methods=["POST"])
def delete_comment():
    data = request.json
    tech_name = data.get("technology")
    timestamp = data.get("timestamp")

    if not tech_name or not timestamp:
        return jsonify({"status": "error", "message": "technology et timestamp requis"}), 400

    comments = read_comments()
    if tech_name in comments:
        comments[tech_name] = [c for c in comments[tech_name] if c["timestamp"] != timestamp]
        write_comments(comments)

    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)  # debug=True pour recharger les fichiers modifiés