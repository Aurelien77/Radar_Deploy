import sys
import os

# Ajouter le chemin du projet au PYTHONPATH
sys.path.insert(0, os.path.dirname(__file__))

from app import app as application  # app est ton Flask instance
