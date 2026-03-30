from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime

class ResultBase(BaseModel):
    patient_id: str
    calc_type: str
    score: float
    raw_answers: Dict[str, Any]

class ResultCreate(ResultBase):
    pass

class ResultOut(ResultBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
