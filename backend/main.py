from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OTTO CALC-HUB API",
    description="Serviço REST de Retenção de Escores Clínicos PROMs",
    version="1.3.0"
)

# CORS: aceita localhost (dev) + domínio Vercel (produção) + variável de ambiente opcional
FRONTEND_URL = os.getenv("FRONTEND_URL", "")
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://otto-calc-hub.vercel.app",
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

@app.post("/api/results", response_model=schemas.ResultOut)
def create_result(result: schemas.ResultCreate, db: Session = Depends(get_db)):
    """Recebe o JSON de qualquer calculadora do hub e armazena no banco."""
    db_result = models.Result(**result.model_dump())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

@app.get("/api/results/{calc_type}", response_model=List[schemas.ResultOut])
def get_results_by_calc(calc_type: str, limit: int = 100, db: Session = Depends(get_db)):
    """Recupera listagem filtrada por instrumento para estudos observacionais."""
    results = db.query(models.Result).filter(models.Result.calc_type == calc_type)\
              .order_by(models.Result.created_at.desc()).limit(limit).all()
    return results or []

@app.get("/")
def health_check():
    return {"status": "OTTO CALC-HUB API operational", "version": "1.3.0"}
