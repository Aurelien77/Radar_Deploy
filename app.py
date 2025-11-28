import os
import json
import math
from flask import Flask, render_template, url_for

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
        elif radar_type == "radar_IA_veille":
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
                description = tech_data.get("description", "")  # Nouvelle propriété optionnelle
                
                # Validation des valeurs
                max_sections = 8 if self.radar_type in ["veille", "radar_IA_veille"] else 7
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
        num_sections = 8 if self.radar_type in ["veille", "radar_IA_veille"] else 7
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


# ============================================================================
# ROUTES
# ============================================================================

@app.route("/")
def index():
    """Page d'accueil - Veille Technologique"""
    radar = InteractiveRadar(
        json_config_path="JsonMap/veille.json",  # ← AJOUT DU CHEMIN JSON
        radar_type="veille"
    )
    radar.load_from_json()  # ← CHARGEMENT DES DONNÉES
    
    return render_template(
        "radar.html",
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name="Veille Technologique",
        current_page="veille",
        radar_type="veille"
    )


@app.route("/VeilleIA")
def VeilleIA():
    """Page Veille IA"""
    radar = InteractiveRadar(
        json_config_path="JsonMap/VeilleIA.json",
        radar_type="radar_IA_veille"
    )
    radar.load_from_json()
    
    return render_template(
        "radar_IA_veille.html",
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name="VeilleIA",
        current_page="VeilleIA",
        radar_type="radar_IA_veille"
    )


@app.route("/1Reve")
def application_1reve():
    """Application 1Reve"""
    radar = InteractiveRadar(
        json_config_path="JsonMap/1reve.json",
        radar_type="application"
    )
    radar.load_from_json()
    
    return render_template(
        "radar_application.html",
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name="1Reve",
        current_page="1Reve",
        radar_type="application"
    )


@app.route("/1Dream2Pianos")
def application_1dream2pianos():
    """Application 1Dream2Pianos"""
    radar = InteractiveRadar(
        json_config_path="JsonMap/1dream2pianos.json",
        radar_type="application"
    )
    radar.load_from_json()
    
    return render_template(
        "radar_application.html",
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name="1Dream2Pianos",
        current_page="1Dream2Pianos",
        radar_type="application"
    )


@app.route("/Austral")
def application_austral():
    """Application Austral"""
    radar = InteractiveRadar(
        json_config_path="JsonMap/austral.json",
        radar_type="application"
    )
    radar.load_from_json()
    
    return render_template(
        "radar_application.html",
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name="Austral",
        current_page="Austral",
        radar_type="application"
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)