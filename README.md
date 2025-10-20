Radar_flask/
├─ app.py                  # Script principal Flask
├─ templates/
│  └─ radar.html           # Template du radar
├─ map_dossiers/           # Dossier racine pour les technologies
│  ├─ PHP32586/
│  ├─ Docker6152/
│  └─ Test3,2.5,15.7/
└─ README.md               # Ce fichier

    app.py : lance le serveur Flask et lit les dossiers dans map_dossiers.

    map_dossiers/ : contient tous les dossiers représentant les technologies à afficher sur le radar.

    radar.html : template affichant le radar et les points.

3️⃣ Formats de nommage des dossiers

Le radar supporte deux formats pour les dossiers :
A. Format classique (4 derniers chiffres)

NOM + SDPP

    S : Section (1 à 8)

    D : Distance (0–9 dizaines → 0–40)

    PP : Position (00–99, converti en 1–20 pour affichage)

Exemples :

    PHP32586 → Nom affiché : PHP3, Section 2, Distance 50→40, Position 86→20

    Docker6152 → Nom affiché : Docker, Section 6, Distance 10, Position 52→11

    ⚠️ Les 4 derniers caractères doivent être des chiffres. La section doit être entre 1 et 8.

B. Format flexible (virgules ou points)

NOM,section,distance,position
ou
NOM.section.distance.position

    NOM : Nom affiché

    section : Section (1 à 8)

    distance : Distance réelle du centre (0–40)

    position : Position angulaire ou placement précis (nombre décimal accepté)

Exemples :

    Test3,2.5,15.7 → Nom = Test, Section = 3, Distance = 2.5, Position = 15.7

    API4.7.12 → Nom = API, Section = 4, Distance = 7, Position = 12

    Frontend1,0,1 → Nom = Frontend, Section = 1, Distance = 0, Position = 1

    ⚠️ Tu peux utiliser des virgules ou des points comme séparateurs, mais pas les mélanger.

4️⃣ Catégories du radar (Sections)
Section	Catégorie
1	Objets OT
2	Monitoring
3	Language Backend
4	Cyber Secu
5	BD et ORM
6	Cloud et intégration
7	Language Frontend
8	Sondes et relevés
5️⃣ Étapes pour ajouter un nouveau point sur le radar

    Créer le dossier dans map_dossiers/
    Exemple pour Windows :

mkdir "map_dossiers\Test3,2.5,15.7"

Exemple pour Linux/macOS :

mkdir -p "map_dossiers/Test3,2.5,15.7"

Ajouter des fichiers (optionnel)
Le radar lira tous les fichiers contenus dans le dossier et pourra afficher leur contenu.

Vérifier le nom du dossier

    Format classique : NOM + 4 chiffres

    Format flexible : NOM,section,distance,position

Redémarrer le serveur Flask

    python app.py

    Ouvrir le radar

        Naviguer vers http://localhost:5000/radar

        Vérifier que le point apparaît à la section, distance et position souhaitées.

6️⃣ Bonnes pratiques

    Ne pas utiliser de caractères spéciaux dans le nom des dossiers.

    Limiter la distance à 0–40 et la section à 1–8.

    Pour plusieurs points dans la même section, créer plusieurs dossiers avec des noms différents et des coordonnées différentes.

    Les points en format flexible permettent un placement très précis avec des décimales.

7️⃣ Exemples de dossiers prêts à l’emploi

map_dossiers/
├─ PHP32586
├─ Docker6152
├─ Test3,2.5,15.7
├─ API4.7.12
└─ Frontend1,0,1

Ces dossiers permettent de tester le radar rapidement avec différents points et formats.
8️⃣ Support

Pour toute question ou problème, tu peux contacter le développeur ou ouvrir une issue sur le dépôt GitHub.
