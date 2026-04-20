import os
import firebase_admin
from firebase_admin import credentials, firestore

def get_firestore_client():
    if not firebase_admin._apps:
        # Tenta pegar o path da credencial pela variável de ambiente
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        
        # Se não tiver variável de ambiente, tenta pegar o arquivo JSON hardcoded que vimos no app principal
        if not cred_path:
            # Caminho relativo se for executado a partir do NUCALAPP ou root
            possible_path = "../../otto-ai-triagem/otto-ecosystem-firebase-adminsdk-fbsvc-e4b80ff2e8.json"
            if os.path.exists(possible_path):
                cred_path = possible_path
            else:
                # Tenta buscar localmente na pasta root
                fallback_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "otto-ai-triagem", "otto-ecosystem-firebase-adminsdk-fbsvc-e4b80ff2e8.json")
                if os.path.exists(fallback_path):
                    cred_path = fallback_path
                else:
                    raise Exception("Chave do Firebase não encontrada. Defina GOOGLE_APPLICATION_CREDENTIALS.")

        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        
    return firestore.client()
