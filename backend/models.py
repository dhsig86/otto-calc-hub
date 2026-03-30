from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from sqlalchemy.sql import func
from database import Base

class Result(Base):
    __tablename__ = "otto_results"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, index=True)
    calc_type = Column(String, index=True)
    score = Column(Float)
    raw_answers = Column(JSON) # Coluna chave de flexibilidade
    created_at = Column(DateTime(timezone=True), server_default=func.now())
