import os
import json
import math
from flask import Flask, render_template, url_for

app = Flask(__name__)

# Configuration pour le préfixe /radar
app.config['APPLICATION_ROOT'] = '/radar'


class InteractiveRadar:
    def __init__(self, root_path="map_dossiers"):
        self.root_path = root_path
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
        # CORRIGÉ: 3 anneaux au lieu de 4
        # Basé sur les rayons JavaScript: [20, 30, 40] sur un rayon max de 40
        # 20/40 = 50%, 30/40 = 75%, 40/40 = 100%
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
        self.technologies = []

    def parse_folder_name(self, folder_name):
        """
        Format attendu : NOM=section,distance_verticale,position_horizontale
        Exemples :
           SQL3=2,30,20.5
           Python=3,40,50
           Docker=4,20,75
        
        - section: 1-8 (quartier du radar)
        - distance_verticale: 0-100 (0=centre/Adopt, 100=extérieur/Hold)
        - position_horizontale: 0-100 (position dans le quartier, 0=gauche, 100=droite)
        
        Le nom affiché sera uniquement ce qui est AVANT le =
        """
        
        # Vérifie si on utilise le séparateur =
        if "=" not in folder_name:
            print(f"⚠️ Ignoré '{folder_name}': format incorrect (utilisez NOM=section,distance,position)")
            return None
        
        # Séparer le nom et les coordonnées
        name, coord_str = folder_name.split("=", 1)
        name = name.strip()
        
        # Parser les coordonnées (garder le point comme séparateur décimal)
        parts = coord_str.split(",")
        
        if len(parts) < 3:
            print(f"⚠️ Ignoré '{folder_name}': coordonnées insuffisantes (besoin de 3 valeurs: section,distance,position)")
            return None
        
        try:
            section = int(parts[0].strip())
            distance_verticale = float(parts[1].strip())
            position_horizontale = float(parts[2].strip())
        except ValueError as e:
            print(f"⚠️ Coordonnées invalides pour '{folder_name}': {e}")
            return None
        
        # Validation section (1-8)
        if not (1 <= section <= 8):
            print(f"⚠️ Section hors limites (1-8) dans '{folder_name}': section={section}")
            return None
        
        # Limiter distance_verticale à 0-100
        distance_verticale = max(0, min(distance_verticale, 100))
        
        # Limiter position_horizontale à 0-100
        position_horizontale = max(0, min(position_horizontale, 100))
        
        return {
            "name": name,
            "section": section,
            "distance": distance_verticale,
            "position": position_horizontale
        }

    def get_ring_name(self, distance):
        for ring_name, (min_d, max_d) in self.rings.items():
            if min_d <= distance <= max_d:
                return ring_name
        return "Dépassé"

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

        print(f"\n🔍 Scan du dossier : {self.root_path}")
        print("=" * 80)
        
        for item in os.listdir(self.root_path):
            item_path = os.path.join(self.root_path, item)
            if os.path.isdir(item_path) and not item.startswith('.'):
                print(f"\n📁 Analyse: '{item}'")
                tech_info = self.parse_folder_name(item)
                if tech_info:
                    tech_info["ring"] = self.get_ring_name(tech_info["distance"])
                    tech_info["folder"] = item
                    tech_info["files"] = self.read_folder_content(item_path)
                    # Calculer coordonnées cartésiennes pour le radar
                    tech_info["x"], tech_info["y"] = self.polar_to_cartesian(
                        tech_info["section"],
                        tech_info["distance"],
                        tech_info["position"]
                    )
                    self.technologies.append(tech_info)
                    print(f"   ✓ Nom affiché: '{tech_info['name']}'")
                    print(f"   ✓ Section {tech_info['section']} ({self.sections[tech_info['section']]})")
                    print(f"   ✓ Distance: {tech_info['distance']}% → Ring: {tech_info['ring']}")
                    print(f"   ✓ Position H: {tech_info['position']}%")
                    print(f"   ✓ Coordonnées (x,y): ({tech_info['x']:.2f}, {tech_info['y']:.2f})")
        
        print("\n" + "=" * 80)
        print(f"✅ Total: {len(self.technologies)} technologies chargées\n")

    def polar_to_cartesian(self, section, distance, position_h):
        """
        Convertit section + distance + position_h en coordonnées x,y
        
        IMPORTANT: Utilise le même système d'angles que le JavaScript
        pour garantir la cohérence du positionnement.
        
        position_h: 0 = bord gauche du quartier, 100 = bord droit du quartier
        """
        
        # Conversion Pourcentage -> Unités radar (0-40)
        distance_units = (distance / 100.0) * 40.0
        
        # Système JavaScript : angle_start = (section - 1) * 45 - 90
        # Section 1: -45°, Section 2: 0°, Section 3: 45°, etc.
        angle_start_js = (section - 1) * 45 - 90
        
        # Ajouter l'offset de position (0-100% devient 0-45°)
        angle_deg_js = angle_start_js + (position_h / 100.0) * 45
        
        # Convertir directement en radians (système Canvas)
        angle_rad = angle_deg_js * math.pi / 180
        
        # Calculer les coordonnées cartésiennes
        x = distance_units * math.cos(angle_rad)
        y = distance_units * math.sin(angle_rad)
        
        return x, y


@app.route("/")
def index():
    radar = InteractiveRadar()
    radar.scan_folders()

    return render_template(
        "radar.html",
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name="Veille Technologique",
        current_page="veille"
    )

@app.route("/VeilleIA")
def VeilleIA():
    radar = InteractiveRadar(root_path="map_dossiers_VeilleIA")
    radar.scan_folders()
    return render_template(
        "radar.html",
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name="VeilleIA",
        current_page="VeilleIA"
    )

@app.route("/1Reve")
def application_2():
    radar = InteractiveRadar(root_path="map_dossiers_1Reve")
    radar.scan_folders()
    return render_template(
        "radar.html",
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name="1Reve",
        current_page="1Reve"
    )

@app.route("/1Dream2Pianos")
def application_3():
    radar = InteractiveRadar(root_path="map_dossiers_1Dream2Pianos")
    radar.scan_folders()
    return render_template(
        "radar.html",
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name="1Dream2Pianos",
        current_page="1Dream2Pianos"
    )

@app.route("/Austral")
def application_4():
    radar = InteractiveRadar(root_path="map_dossiers_Austral")
    radar.scan_folders()
    return render_template(
        "radar.html",
        technologies=json.dumps(radar.technologies, ensure_ascii=False),
        sections=json.dumps(radar.sections),
        colors=json.dumps(radar.ring_colors),
        current_page_name="Austral",
        current_page="Austral"
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)