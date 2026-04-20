from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class ResultBase(BaseModel):
    patient_id: str
    doctor_id: Optional[str] = None
    calc_type: str
    score: float
    raw_answers: Dict[str, Any]
    hub_version: Optional[str] = "1.3.0"

class ResultCreate(ResultBase):
    pass

class ResultOut(ResultBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
