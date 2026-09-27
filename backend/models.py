from sqlalchemy import Column, Integer, String, Text
from database import Base


class Deviation(Base):

    __tablename__ = "deviations"

    id = Column(Integer, primary_key=True, index=True)

    site = Column(String)
    date_of_occurrence = Column(String)

    title = Column(String)
    source = Column(String)

    related_product = Column(String)
    batch_lot_number = Column(String)

    detailed_description = Column(Text)

    initial_impact = Column(String)
    initial_severity = Column(String)
    severity_reason = Column(Text)