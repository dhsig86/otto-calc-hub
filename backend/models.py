from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from sqlalchemy.sql import func
from database import Base

class Result(Base):
    __tablename__ = "otto_results"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, index=True)
    doctor_id = Column(String, index=True, nullable=True)  # CRM ou nome do médico
    calc_type = Column(String, index=True)  # ex: snot22, nose_score, tnm_laringe, refluxo_rsi
    score = Column(Float)
    raw_answers = Column(JSON)  # Respostas individuais de cada item do instrumento
    hub_version = Column(String, default="1.3.0")  # Versão do Hub no momento do cálculo
    created_at = Column(DateTime(timezone=True), server_default=func.now())
