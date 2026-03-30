from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import engine, get_db

# Cria automaticamente os arquivos .db em disco caso não existam no servidor
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OTTO CALC-HUB API", 
    description="Serviço REST de Retenção de Escores Clínicos", 
    version="1.0.0"
)

# Liberação de CORS permitindo que Node/React Front-end faça requisições
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/results", response_model=schemas.ResultOut)
def create_result(result: schemas.ResultCreate, db: Session = Depends(get_db)):
    """Recebe o JSON de qualquer calculadora do hub e vincula a um perfil pseudonimizado"""
    db_result = models.Result(**result.model_dump())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

@app.get("/api/results/{calc_type}", response_model=List[schemas.ResultOut])
def get_results_by_calc(calc_type: str, limit: int = 100, db: Session = Depends(get_db)):
    """Recupera listagem filtrada para montagem e estudos observacionais do backoffice"""
    results = db.query(models.Result).filter(models.Result.calc_type == calc_type)\
              .order_by(models.Result.created_at.desc()).limit(limit).all()
    if not results:
        return []
    return results

@app.get("/")
def health_check():
    return {"status": "OTTO Server is fully operational"}
