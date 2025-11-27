import os
import json
import math
from flask import Flask, render_template, url_for

app = Flask(__name__)

# Configuration pour le préfixe /radar
app.config['APPLICATION_ROOT'] = '/radar'


class InteractiveRadar:
    def __init__(self, root_path="map_dossiers", radar_type="veille"):
        self.root_path = root_path
        self.radar_type = radar_type
        
        if radar_type == "veille":
            # Configuration pour la veille technologique (8 sections)
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



            if radar_type == "radar_IA_veille":
            # Configuration pour la veille technologique (8 sections)
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
        else:  # radar_type == "application"
            # Configuration pour les applications (7 sections)
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

    def parse_folder_name(self, folder_name):
        """
        Format attendu : NOM=section,distance_verticale,position_horizontale
        """
        if "=" not in folder_name:
            print(f"⚠️ Ignoré '{folder_name}': format incorrect (utilisez NOM=section,distance,position)")
            return None
        
        name, coord_str = folder_name.split("=", 1)
        name = name.strip()
        
        parts = coord_str.split(",")
        
        if len(parts) < 3:
            print(f"⚠️ Ignoré '{folder_name}': coordonnées insuffisantes")
            return None
        
        try:
            section = int(parts[0].strip())
            distance_verticale = float(parts[1].strip())
            position_horizontale = float(parts[2].strip())
        except ValueError as e:
            print(f"⚠️ Coordonnées invalides pour '{folder_name}': {e}")
            return None
        
        # Validation section selon le type de radar
        max_sections = 8 if self.radar_type == "veille" else 7
        if not (1 <= section <= max_sections):
            print(f"⚠️ Section hors limites (1-{max_sections}) dans '{folder_name}': section={section}")
            return None
        
        distance_verticale = max(0, min(distance_verticale, 100))
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
        return list(self.rings.keys())[-1]

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
        Adaptation pour 7 ou 8 sections
        """
        distance_units = (distance / 100.0) * 40.0
        
        # Calcul de l'angle selon le nombre de sections
        num_sections = 8 if self.radar_type == "veille" else 7
        section_angle = 360 / num_sections
        
        # Pour 7 sections: 360/7 ≈ 51.43°
        # Pour 8 sections: 360/8 = 45°
        angle_start_js = (section - 1) * section_angle - 90
        angle_deg_js = angle_start_js + (position_h / 100.0) * section_angle
        
        angle_rad = angle_deg_js * math.pi / 180
        
        x = distance_units * math.cos(angle_rad)
        y = distance_units * math.sin(angle_rad)
        
        return x, y


@app.route("/")
def index():
    radar = InteractiveRadar(radar_type="veille")
    radar.scan_folders()

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
    radar = InteractiveRadar(root_path="map_dossiers_VeilleIA", radar_type="radar_IA_veille")
    radar.scan_folders()
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
def application_2():
    radar = InteractiveRadar(root_path="map_dossiers_1Reve", radar_type="application")
    radar.scan_folders()
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
def application_3():
    radar = InteractiveRadar(root_path="map_dossiers_1Dream2Pianos", radar_type="application")
    radar.scan_folders()
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
def application_4():
    radar = InteractiveRadar(root_path="map_dossiers_Austral", radar_type="application")
    radar.scan_folders()
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