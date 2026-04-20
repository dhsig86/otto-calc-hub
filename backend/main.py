from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from datetime import datetime, timezone

import schemas
from firebase_db import get_firestore_client

app = FastAPI(
    title="OTTO CALC-HUB API (🔥 Firebase Edition)",
    description="Serviço REST de Retenção de Escores Clínicos PROMs transicionado para Firestore NoSQL.",
    version="2.0.0"
)

# CORS: aceita localhost (dev) + domínio Vercel (produção) + variável de ambiente opcional
FRONTEND_URL = os.getenv("FRONTEND_URL", "")
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://otto-calc-hub.vercel.app"
]
if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def format_doc(doc) -> dict:
    data = doc.to_dict()
    data['id'] = doc.id
    return data

@app.post("/api/results", response_model=schemas.ResultOut)
def create_result(result: schemas.ResultCreate):
    """Recebe o JSON de qualquer calculadora do hub e armazena numa Coleção NoSQL no Firebase."""
    db = get_firestore_client()
    doc_ref = db.collection("otto_calc_results").document()
    
    data = result.model_dump()
    data['created_at'] = datetime.now(timezone.utc)
    
    doc_ref.set(data)
    
    # Prepara o objeto para retornar com id string
    return {
        "id": doc_ref.id,
        "created_at": data['created_at'],
        **result.model_dump()
    }

@app.get("/api/results/{calc_type}", response_model=List[schemas.ResultOut])
def get_results_by_calc(calc_type: str, limit: int = 100):
    """Recupera listagem filtrada por instrumento para estudos observacionais diretamente do Firebase."""
    db = get_firestore_client()
    try:
        # Consulta Firebase ordenada por criado_em decrescente
        query = db.collection("otto_calc_results")\
                  .where("calc_type", "==", calc_type)\
                  .order_by("created_at", direction="DESCENDING")\
                  .limit(limit)
                  
        results = [format_doc(doc) for doc in query.stream()]
        return results
    except Exception as e:
        # Fallback na consulta se index composite não estiver criado no firebase
        query_fallback = db.collection("otto_calc_results")\
                           .where("calc_type", "==", calc_type)\
                           .limit(limit)
        results = [format_doc(doc) for doc in query_fallback.stream()]
        return results

@app.get("/")
def health_check():
    return {"status": "OTTO CALC-HUB API operational", "database": "Firebase Firestore", "version": "2.0.0"}
