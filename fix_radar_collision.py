import json
import math
import random

def polar_to_cartesian(distance, angle):
    """Convertit coordonnées polaires en cartésiennes"""
    rad = math.radians(angle)
    x = distance * math.cos(rad)
    y = distance * math.sin(rad)
    return x, y

def cartesian_distance(x1, y1, x2, y2):
    """Calcule la distance euclidienne entre deux points"""
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

def get_section_angle_range(section, num_sections):
    """Retourne la plage d'angles pour une section donnée"""
    section_angle = 360 / num_sections
    start_angle = (section - 1) * section_angle
    end_angle = start_angle + section_angle
    return start_angle, end_angle

def position_to_angle(position, start_angle, end_angle):
    """Convertit une position (0-100) en angle dans la plage de la section"""
    angle_range = end_angle - start_angle
    return start_angle + (position / 100.0) * angle_range

def calculate_positions_with_collision_avoidance(technologies, min_distance, num_sections):
    """
    Recalcule les positions x,y des technologies en évitant les collisions
    Avec ajustement automatique de la distance radiale si nécessaire
    """
    positioned_techs = []
    
    # Trier par section puis par distance
    sorted_techs = sorted(technologies, key=lambda t: (t['section'], t['distance']))
    
    for tech in sorted_techs:
        max_attempts = 200
        best_position = None
        best_min_dist = 0
        
        section = tech['section']
        base_distance = tech['distance']
        position = tech.get('position', random.randint(0, 100))
        
        # Obtenir la plage d'angles pour cette section
        start_angle, end_angle = get_section_angle_range(section, num_sections)
        
        position_found = False
        
        # Essayer d'abord avec la distance demandée, puis avec des variations
        for distance_offset in [0, 3, -3, 5, -5, 8, -8, 10, -10]:
            if position_found:
                break
                
            test_distance = base_distance + distance_offset
            
            # Ne pas descendre en dessous de 15 ou monter au-dessus de 95
            if test_distance < 15 or test_distance > 95:
                continue
            
            for attempt in range(max_attempts // 5):
                # Essayer différentes positions angulaires dans la section
                if attempt == 0:
                    test_position = position
                elif attempt < 20:
                    # Positions systématiques espacées
                    test_position = (attempt * 5) % 100
                else:
                    # Positions aléatoires
                    test_position = random.randint(0, 100)
                
                # Convertir en angle
                angle = position_to_angle(test_position, start_angle, end_angle)
                
                # Convertir en coordonnées cartésiennes
                x, y = polar_to_cartesian(test_distance, angle)
                
                # Vérifier la distance avec tous les points déjà placés
                collision = False
                min_dist_to_others = float('inf')
                
                for placed_tech in positioned_techs:
                    dist = cartesian_distance(x, y, placed_tech['x'], placed_tech['y'])
                    min_dist_to_others = min(min_dist_to_others, dist)
                    
                    if dist < min_distance:
                        collision = True
                        break
                
                if not collision:
                    # Position valide trouvée
                    tech['x'] = x
                    tech['y'] = y
                    tech['distance'] = test_distance  # Mettre à jour la distance si modifiée
                    tech['final_position'] = test_position
                    tech['final_angle'] = angle
                    positioned_techs.append(tech)
                    if distance_offset != 0:
                        print(f"✓ {tech['name']}: section {section}, distance {base_distance}→{test_distance}, position {test_position:.1f}, angle {angle:.1f}°")
                    else:
                        print(f"✓ {tech['name']}: section {section}, distance {test_distance}, position {test_position:.1f}, angle {angle:.1f}°")
                    position_found = True
                    break
                elif min_dist_to_others > best_min_dist:
                    # Garder la meilleure position trouvée
                    best_min_dist = min_dist_to_others
                    best_position = (x, y, test_position, angle, test_distance)
        
        if not position_found:
            # Aucune position sans collision trouvée, utiliser la meilleure
            if best_position:
                tech['x'], tech['y'], tech['final_position'], tech['final_angle'], tech['distance'] = best_position
                positioned_techs.append(tech)
                print(f"⚠ {tech['name']}: section {section}, distance {base_distance}→{tech['distance']}, position {tech['final_position']:.1f}, angle {tech['final_angle']:.1f}° (dist min={best_min_dist:.1f})")
            else:
                # En dernier recours, utiliser la position demandée
                angle = position_to_angle(position, start_angle, end_angle)
                x, y = polar_to_cartesian(base_distance, angle)
                tech['x'] = x
                tech['y'] = y
                tech['final_position'] = position
                tech['final_angle'] = angle
                positioned_techs.append(tech)
                print(f"✗ {tech['name']}: section {section}, distance {base_distance}, position {position}, angle {angle:.1f}° (COLLISION FORCÉE)")
    
    return positioned_techs

def process_radar_config(config):
    """
    Traite la configuration du radar et recalcule les positions
    """
    technologies = config['technologies']
    num_sections = len(config['sections'])
    min_distance = config.get('min_distance_between_points', 10)
    
    print(f"\n=== Configuration ===")
    print(f"Nombre de sections: {num_sections}")
    print(f"Nombre de technologies: {len(technologies)}")
    print(f"Distance minimale entre points: {min_distance}")
    print(f"\n=== Calcul des positions ===\n")
    
    # Déterminer le ring pour chaque technologie
    rings = config['rings']
    ring_names = list(rings.keys())
    
    for tech in technologies:
        dist = tech['distance']
        for ring_name, (min_d, max_d) in rings.items():
            if min_d <= dist <= max_d:
                tech['ring'] = ring_name
                break
    
    # Calculer les positions avec évitement de collision
    positioned_techs = calculate_positions_with_collision_avoidance(
        technologies, min_distance, num_sections
    )
    
    # Vérifier les distances finales
    print(f"\n=== Vérification des distances ===\n")
    violations = []
    for i, tech1 in enumerate(positioned_techs):
        for tech2 in positioned_techs[i+1:]:
            dist = cartesian_distance(tech1['x'], tech1['y'], tech2['x'], tech2['y'])
            if dist < min_distance:
                violations.append((tech1['name'], tech2['name'], dist))
    
    if violations:
        print(f"⚠ {len(violations)} violations de distance trouvées:")
        for t1, t2, dist in violations[:10]:  # Afficher max 10
            print(f"  • {t1} ↔ {t2}: {dist:.1f} (min requis: {min_distance})")
    else:
        print(f"✓ Toutes les distances respectent le minimum de {min_distance}")
    
    # Nettoyer les champs temporaires
    for tech in positioned_techs:
        if 'final_position' in tech:
            del tech['final_position']
        if 'final_angle' in tech:
            del tech['final_angle']
    
    config['technologies'] = positioned_techs
    return config


if __name__ == "__main__":
    # Charger la configuration enrichie
    import sys
    config_file = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/radar_config_enriched.json'
    
    print(f"📂 Chargement de la configuration: {config_file}")
    with open(config_file, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    result = process_radar_config(config)
    
    # Sauvegarder le résultat
    output_file = config_file.replace('.json', '_fixed.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Configuration corrigée sauvegardée dans {output_file}")