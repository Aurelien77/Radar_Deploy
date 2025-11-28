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
        
        if radar_type == "veille":
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
            self.rings = {
                "A Adopter": (0, 50),
                "A Evaluer": (51, 75),
                "Dépassé": (76, 100)
            }
            self.ring_colors = {
                "A Adopter": "#93c47d",
                "A Evaluer": "#f6b26b",
                "Dépassé": "#e06666"
            }
        elif radar_type == "veilleIA":
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
            self.rings = {
                "A Adopter": (0, 50),
                "A Evaluer": (51, 75),
                "Dépassé": (76, 100)
            }
            self.ring_colors = {
                "A Adopter": "#93c47d",
                "A Evaluer": "#f6b26b",
                "Dépassé": "#e06666"
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
            self.rings = {
                "Infrastructure": (0, 33),
                "Backend": (34, 66),
                "Frontend": (67, 100)
            }
            self.ring_colors = {
                "Infrastructure": "#667eea",
                "Backend": "#764ba2",
                "Frontend": "#f093fb"
            }
        
        self.technologies = []

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
            
            for tech_data in data.get("technologies", []):
                name = tech_data.get("name")
                section = tech_data.get("section")
                distance = tech_data.get("distance")
                position = tech_data.get("position")
                links = tech_data.get("links", [])
                description = tech_data.get("description", "")
                
                # Validation des valeurs
                max_sections = 8 if self.radar_type in ["veille", "veilleIA"] else 7
                if not (1 <= section <= max_sections):
                    print(f"⚠️ Section invalide pour '{name}': {section}")
                    continue
                
                # Normalisation des valeurs entre 0 et 100
                distance = max(0, min(distance, 100))
                position = max(0, min(position, 100))
                
                # Calcul des coordonnées cartésiennes
                x, y = self.polar_to_cartesian(section, distance, position)
                ring = self.get_ring_name(distance)
                
                # Lecture des fichiers liés (si présents)
                files = []
                if links:
                    for link in links:
                        linked_files = self.read_linked_content(link)
                        files.extend(linked_files)
                
                # Si description directe fournie dans le JSON, l'ajouter
                if description and not files:
                    files.append({
                        "name": f"{name}_description.txt",
                        "content": description
                    })
                
                # Si aucun contenu, ajouter un message par défaut
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
                
                print(f"\n📁 Chargé: '{name}'")
                print(f"   ✓ Section {section} ({self.sections[section]})")
                print(f"   ✓ Distance: {distance}% → Ring: {ring}")
                print(f"   ✓ Position H: {position}%")
                print(f"   ✓ Coordonnées (x,y): ({x:.2f}, {y:.2f})")
                print(f"   ✓ Fichiers/Descriptions: {len(files)}")
            
            print("\n" + "=" * 80)
            print(f"✅ Total: {len(self.technologies)} technologies chargées\n")
            
        except json.JSONDecodeError as e:
            print(f"❌ Erreur JSON: {e}")
        except Exception as e:
            print(f"❌ Erreur: {e}")

    def polar_to_cartesian(self, section, distance, position_h):
        """Convertit section + distance + position_h en coordonnées x,y"""
        # Distance en unités (0-40)
        distance_units = (distance / 100.0) * 40.0
        
        # Nombre de sections selon le type de radar
        num_sections = 8 if self.radar_type in ["veille", "veilleIA"] else 7
        section_angle = 360 / num_sections
        
        # Angle de départ de la section (aligné avec le système JS)
        angle_start_js = (section - 1) * section_angle - 90
        
        # Angle final en ajoutant la position horizontale
        angle_deg_js = angle_start_js + (position_h / 100.0) * section_angle
        
        # Conversion en radians
        angle_rad = angle_deg_js * math.pi / 180
        
        # Coordonnées cartésiennes
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

        # Enlever l'extension
        name_without_ext = filename[:-5]  # ex: "MonProjet=veilleIA"
        
        # Si on a un '=', séparer en prefix (display name) et suffix (type)
        if '=' in name_without_ext:
            prefix, suffix = name_without_ext.split('=', 1)
            prefix = prefix.strip()
            suffix = suffix.strip().lower()
        else:
            prefix = name_without_ext
            suffix = ""  # pas de suffixe explicite

        # Déterminer le type de radar à partir du suffix (ou fallback si absent)
        if suffix.endswith('application') or suffix == 'application':
            radar_type = 'application'
        elif suffix.endswith('veilleia') or suffix == 'veilleia':
            radar_type = 'veilleIA'
        elif suffix.endswith('veille') or suffix == 'veille':
            radar_type = 'veille'
        else:
            # Si aucun suffixe ou suffixe inconnu, on peut essayer d'inférer à partir du nom
            # (ancien comportement : regarder la fin du nom complet)
            if name_without_ext.lower().endswith('application'):
                radar_type = 'application'
            elif name_without_ext.lower().endswith('veilleia'):
                radar_type = 'veilleIA'
            elif name_without_ext.lower().endswith('veille'):
                radar_type = 'veille'
            else:
                radar_type = 'veille'  # valeur par défaut

        # Affichage (display_name): si on a un prefix non vide on l'utilise,
        # sinon on prend name_without_ext sans suffix
        if prefix:
            display_name = prefix.capitalize()
        else:
            # Aucun préfixe : on enlève le suffix si présent, sinon on prend le name_without_ext
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
    
    return radars



# ============================================================================
# ROUTE DYNAMIQUE UNIQUE
# ============================================================================

@app.route("/")
def index():
    """Redirige vers la première veille disponible ou affiche un radar par défaut"""
    radars = get_all_radars()
    
    # Chercher la première veille
    veille_radar = next((r for r in radars if r['type'] == 'veille'), None)
    
    if veille_radar:
        return radar_page(veille_radar['name'])
    
    # Sinon, créer un radar par défaut
    return radar_page('veille')


@app.route("/<radar_name>")
def radar_page(radar_name):
    """Route dynamique qui gère tous les radars - UN SEUL TEMPLATE UNIVERSEL"""
    
    # Construire le chemin du fichier JSON
    json_path = f"JsonMap/{radar_name}.json"
    
    # Vérifier si le fichier existe
    if not os.path.exists(json_path):
        abort(404, description=f"Radar '{radar_name}' non trouvé")
    
    # Déterminer le type de radar à partir du nom
    if radar_name.endswith('application'):
        radar_type = 'application'
        display_name = radar_name[:-11].capitalize()  # Enlever 'application'
    elif radar_name.endswith('veilleia'):
        radar_type = 'veilleIA'
        display_name = radar_name[:-8].capitalize()  # Enlever 'veilleIA'
    elif radar_name.endswith('veille'):
        radar_type = 'veille'
        display_name = radar_name[:-6].capitalize()  # Enlever 'veille'
    else:
        # Par défaut
        radar_type = 'veille'
        display_name = radar_name.capitalize()
    
    # Créer le radar
    radar = InteractiveRadar(
        json_config_path=json_path,
        radar_type=radar_type
    )
    radar.load_from_json()
    
    # Récupérer tous les radars disponibles pour la navigation
    all_radars = get_all_radars()
    
    # ✨ UN SEUL TEMPLATE POUR TOUT : radar_universal.html
    return render_template(
        'radar_universal.html',
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name = display_name[:-1],
        current_page=radar_name,
        radar_type=radar_type,
        all_radars=all_radars
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)