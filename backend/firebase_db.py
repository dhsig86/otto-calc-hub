import os
import firebase_admin
from firebase_admin import credentials, firestore

def get_firestore_client():
    if not firebase_admin._apps:
        # Tenta pegar o path da credencial pela variável de ambiente
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        
        # Se não tiver variável de ambiente, tenta pegar o arquivo JSON hardcoded que vimos no app principal
        if not cred_path:
            raise Exception("Chave do Firebase não encontrada. Defina GOOGLE_APPLICATION_CREDENTIALS.")

        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        
    return firestore.client()
