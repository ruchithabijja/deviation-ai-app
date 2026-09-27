from pydantic import BaseModel
from typing import Optional


class DeviationCreate(BaseModel):
    site: str
    date_of_occurrence: Optional[str] = None
    title: str
    source: Optional[str] = None
    related_product: Optional[str] = None
    batch_lot_number: Optional[str] = None
    detailed_description: str

    initial_impact: Optional[str] = None
    initial_severity: Optional[str] = None
    severity_reason: Optional[str] = None


class DeviationResponse(DeviationCreate):
    id: int