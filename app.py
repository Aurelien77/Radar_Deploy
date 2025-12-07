import os
import json
import math
from flask import Flask, render_template, abort

app = Flask(__name__)
app.config['APPLICATION_ROOT'] = '/radar'


class InteractiveRadar:
    def __init__(self, json_config_path=None, radar_type="veille"):
        self.json_config_path = json_config_path
        self.radar_type = radar_type
        
        # ✨ CHANGEMENT : Sections et anneaux vides par défaut
        # Ils seront TOUJOURS chargés depuis le JSON en priorité
        self.sections = {}
        self.rings = {}
        self.ring_colors = {}
        
        self.technologies = []
        self.anti_collision_enabled = True
        self.min_distance_between_points = 5.0

    def set_default_config(self):
        """
        Définit la configuration par défaut UNIQUEMENT si le JSON ne la fournit pas.
        Cette méthode est appelée APRÈS la lecture du JSON.
        """
        # Si les sections ne sont pas définies dans le JSON, utiliser les valeurs par défaut
        if not self.sections:
            if self.radar_type == "veille":
                self.sections = {
                    1: "ORM",
                    2: "Cyber Sécurité",
                    3: "CI / CD",
                    4: "Language Backend",
                    5: "Bases de données",
                    6: "Cloud / intégration",
                    7: "Monitoring",
                    8: "Language Frontend"
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
        
        # Si les anneaux ne sont pas définis dans le JSON, utiliser les valeurs par défaut
        if not self.rings:
            if self.radar_type in ["veille", "veilleIA"]:
                self.rings = {
                    "A Adopter": (0, 50),
                    "A Evaluer": (51, 75),
                    "Dépassé": (76, 100)
                }
            else:  # application
                self.rings = {
                    "Infrastructure": (0, 33),
                    "Backend": (34, 66),
                    "Frontend": (67, 100)
                }
            print("ℹ️  Anneaux par défaut utilisés (non définis dans le JSON)")
        
        # Si les couleurs ne sont pas définies dans le JSON, utiliser les valeurs par défaut
        if not self.ring_colors:
            if self.radar_type in ["veille", "veilleIA"]:
                self.ring_colors = {
                    "A Adopter": "#93c47d",
                    "A Evaluer": "#f6b26b",
                    "Dépassé": "#e06666"
                }
            else:  # application
                self.ring_colors = {
                    "Infrastructure": "#667eea",
                    "Backend": "#764ba2",
                    "Frontend": "#f093fb"
                }
            print("ℹ️  Couleurs par défaut utilisées (non définies dans le JSON)")

    def get_ring_name(self, distance):
        """Retourne le nom du ring selon la distance"""
        for ring_name, (min_d, max_d) in self.rings.items():
            if min_d <= distance <= max_d:
                return ring_name
        return list(self.rings.keys())[-1]

    def read_linked_content(self, link_path):
        """Lit le contenu d'un fichier ou dossier lié (si existant)"""
        files = []
        
        if not os.path.exists(link_path):
            return []
        
        if os.path.isfile(link_path):
            try:
                with open(link_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except:
                try:
                    with open(link_path, 'r', encoding='latin-1') as f:
                        content = f.read()
                except:
                    content = "[Impossible de lire ce fichier]"
            
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
                            except:
                                content = "[Impossible de lire ce fichier]"
                        files.append({"name": item, "content": content})
            except Exception as e:
                files.append({"name": "Erreur", "content": f"Erreur lecture dossier: {e}"})
        
        return files

    def detect_collision(self, x, y, existing_points):
        """Vérifie si un point est trop proche d'un autre"""
        for point in existing_points:
            distance = math.sqrt((x - point['x'])**2 + (y - point['y'])**2)
            if distance < self.min_distance_between_points:
                return True
        return False

    def adjust_position_to_avoid_collision(self, section, distance, position, existing_points, max_attempts=50):
        """Ajuste la position d'un point pour éviter les collisions"""
        original_position = position
        attempt = 0
        
        while attempt < max_attempts:
            x, y = self.polar_to_cartesian(section, distance, position)
            
            if not self.detect_collision(x, y, existing_points):
                if attempt > 0:
                    print(f"      ⚠️  Position ajustée : {original_position:.1f} → {position:.1f} (après {attempt} tentatives)")
                return position, x, y
            
            # Essayer différentes positions autour de la position originale
            if attempt < 10:
                position = original_position + (attempt * 2) if attempt % 2 == 0 else original_position - (attempt * 2)
            elif attempt < 30:
                position = original_position + (attempt * 5) if attempt % 2 == 0 else original_position - (attempt * 5)
            else:
                import random
                position = random.uniform(0, 100)
            
            position = max(0, min(position, 100))
            attempt += 1
        
        print(f"      ⚠️  Impossible d'éviter collision après {max_attempts} tentatives, position conservée")
        x, y = self.polar_to_cartesian(section, distance, original_position)
        return original_position, x, y

    def load_from_json(self):
        """Charge les technologies depuis le fichier JSON"""
        self.technologies = []
        
        if not self.json_config_path or not os.path.exists(self.json_config_path):
            print(f"⚠️  Le fichier JSON '{self.json_config_path}' n'existe pas !")
            return

        print(f"\n🔍 Chargement depuis JSON : {self.json_config_path}")
        print("=" * 80)
        
        try:
            with open(self.json_config_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # ✨ PRIORITÉ 1 : Charger les sections depuis le JSON
            if "sections" in data:
                print("✨ Sections personnalisées chargées depuis le JSON")
                self.sections = {}
                for key, value in data["sections"].items():
                    self.sections[int(key)] = value
                print(f"   → {len(self.sections)} sections : {', '.join(self.sections.values())}")
            
            # ✨ PRIORITÉ 2 : Charger les anneaux depuis le JSON
            if "rings" in data:
                print("✨ Anneaux personnalisés chargés depuis le JSON")
                self.rings = {}
                for ring_name, limits in data["rings"].items():
                    # Support de deux formats : [min, max] ou (min, max)
                    if isinstance(limits, (list, tuple)) and len(limits) == 2:
                        self.rings[ring_name] = (limits[0], limits[1])
                print(f"   → {len(self.rings)} anneaux : {', '.join(self.rings.keys())}")
            
            # ✨ PRIORITÉ 3 : Charger les couleurs depuis le JSON
            if "ring_colors" in data:
                print("✨ Couleurs personnalisées chargées depuis le JSON")
                self.ring_colors = data["ring_colors"]
                print(f"   → Couleurs définies pour : {', '.join(self.ring_colors.keys())}")
            
            # ✨ Appliquer les valeurs par défaut UNIQUEMENT si non définies dans le JSON
            self.set_default_config()
            
            # ✨ Option anti-collision
            if "anti_collision" in data:
                self.anti_collision_enabled = data["anti_collision"]
                print(f"✨ Anti-collision : {'✅ Activé' if self.anti_collision_enabled else '❌ Désactivé'}")
            
            if "min_distance_between_points" in data:
                self.min_distance_between_points = data["min_distance_between_points"]
                print(f"   → Distance minimale : {self.min_distance_between_points} unités")
            
            print("=" * 80)
            
            existing_points = []
            
            for tech_data in data.get("technologies", []):
                name = tech_data.get("name")
                section = tech_data.get("section")
                distance = tech_data.get("distance")
                position = tech_data.get("position")
                links = tech_data.get("links", [])
                description = tech_data.get("description", "")
                
                # Validation des valeurs
                max_sections = len(self.sections)
                if not (1 <= section <= max_sections):
                    print(f"⚠️ Section invalide pour '{name}': {section} (max: {max_sections})")
                    continue
                
                # Normalisation des valeurs entre 0 et 100
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
                
                # Lecture des fichiers liés
                files = []
                if links:
                    for link in links:
                        linked_files = self.read_linked_content(link)
                        files.extend(linked_files)
                
                # Description inline
                if description and not files:
                    files.append({
                        "name": f"{name}_description.txt",
                        "content": description
                    })
                
                # Message par défaut
                if not files:
                    files.append({
                        "name": "info.txt",
                        "content": f"Technologie: {name}\nSection: {self.sections[section]}\nRing: {ring}"
                    })
                
                tech_info = {
                    "name": name,
                    "section": section,
                    "distance": distance,
                    "position": position,
                    "ring": ring,
                    "x": x,
                    "y": y,
                    "files": files,
                    "links": links
                }
                
                self.technologies.append(tech_info)
                existing_points.append({'x': x, 'y': y})
                
                print(f"✓ {name:30s} | Sec: {section} | Dist: {distance:5.1f} | Pos: {position:5.1f} | Ring: {ring}")
            
            print("=" * 80)
            print(f"✅ Total: {len(self.technologies)} technologies chargées")
            if self.anti_collision_enabled:
                print(f"🛡️  Anti-collision activé (distance min: {self.min_distance_between_points} unités)")
            print()
            
        except json.JSONDecodeError as e:
            print(f"❌ Erreur JSON: {e}")
        except Exception as e:
            print(f"❌ Erreur: {e}")
            import traceback
            traceback.print_exc()

    def polar_to_cartesian(self, section, distance, position_h):
        """Convertit section + distance + position_h en coordonnées x,y"""
        distance_units = (distance / 100.0) * 40.0
        
        num_sections = len(self.sections)
        section_angle = 360 / num_sections
        
        angle_start_js = (section - 1) * section_angle - 90
        angle_deg_js = angle_start_js + (position_h / 100.0) * section_angle
        
        angle_rad = angle_deg_js * math.pi / 180
        
        x = distance_units * math.cos(angle_rad)
        y = distance_units * math.sin(angle_rad)
        
        return x, y


def get_all_radars():
    """Récupère tous les radars disponibles depuis le dossier JsonMap"""
    radars = []
    json_dir = "JsonMap"
    
    if not os.path.exists(json_dir):
        return radars
    
    for filename in os.listdir(json_dir):
        if not filename.endswith('.json'):
            continue

        name_without_ext = filename[:-5]
        
        if '=' in name_without_ext:
            prefix, suffix = name_without_ext.split('=', 1)
            prefix = prefix.strip()
            suffix = suffix.strip().lower()
        else:
            prefix = name_without_ext
            suffix = ""

        if suffix.endswith('application') or suffix == 'application':
            radar_type = 'application'
        elif suffix.endswith('veilleia') or suffix == 'veilleia':
            radar_type = 'veilleIA'
        elif suffix.endswith('veille') or suffix == 'veille':
            radar_type = 'veille'
        else:
            if name_without_ext.lower().endswith('application'):
                radar_type = 'application'
            elif name_without_ext.lower().endswith('veilleia'):
                radar_type = 'veilleIA'
            elif name_without_ext.lower().endswith('veille'):
                radar_type = 'veille'
            else:
                radar_type = 'veille'

        if prefix:
            display_name = prefix.capitalize()
        else:
            if suffix:
                display_name = name_without_ext[:-len(suffix)].rstrip('= ').capitalize()
            else:
                display_name = name_without_ext.capitalize()

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
    """Redirige vers la première veille disponible ou affiche un radar par défaut"""
    radars = get_all_radars()
    
    veille_radar = next((r for r in radars if r['type'] == 'veille'), None)
    if veille_radar:
        return radar_page(veille_radar['name'])
    
    veilleia_radar = next((r for r in radars if r['type'] == 'veilleIA'), None)
    if veilleia_radar:
        return radar_page(veilleia_radar['name'])
    
    if radars:
        return radar_page(radars[0]['name'])
    
    abort(404, description="Aucun radar disponible. Créez un fichier JSON dans le dossier JsonMap/")


@app.route("/<radar_name>")
def radar_page(radar_name):
    """Route dynamique qui gère tous les radars"""
    
    json_path = f"JsonMap/{radar_name}.json"
    
    if not os.path.exists(json_path):
        abort(404, description=f"Radar '{radar_name}' non trouvé")
    
    if '=' in radar_name:
        prefix, suffix = radar_name.split('=', 1)
        suffix_lower = suffix.lower()
        
        if suffix_lower.endswith('application') or suffix_lower == 'application':
            radar_type = 'application'
            display_name = prefix.capitalize()
        elif suffix_lower.endswith('veilleia') or suffix_lower == 'veilleia':
            radar_type = 'veilleIA'
            display_name = prefix.capitalize()
        elif suffix_lower.endswith('veille') or suffix_lower == 'veille':
            radar_type = 'veille'
            display_name = prefix.capitalize()
        else:
            radar_type = 'veille'
            display_name = prefix.capitalize()
    else:
        if radar_name.lower().endswith('application'):
            radar_type = 'application'
            display_name = radar_name[:-11].capitalize()
        elif radar_name.lower().endswith('veilleia'):
            radar_type = 'veilleIA'
            display_name = radar_name[:-8].capitalize()
        elif radar_name.lower().endswith('veille'):
            radar_type = 'veille'
            display_name = radar_name[:-6].capitalize()
        else:
            radar_type = 'veille'
            display_name = radar_name.capitalize()
    
    radar = InteractiveRadar(
        json_config_path=json_path,
        radar_type=radar_type
    )
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


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)