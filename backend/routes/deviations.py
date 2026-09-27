from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form
)
from sqlalchemy.orm import Session

from database import get_db
from models import Deviation
from schemas import DeviationCreate, DeviationResponse
from services.pdf_extractor import extract_text_from_pdf
from services.groq_service import analyze_deviation
from ai.deviation_graph import deviation_graph

router = APIRouter(
    prefix="/api/deviations",
    tags=["Deviations"]
)


# Save deviation
@router.post("/", response_model=DeviationResponse)
def create_deviation(
    deviation: DeviationCreate,
    db: Session = Depends(get_db)
):

    new_deviation = Deviation(
        **deviation.model_dump()
    )

    db.add(new_deviation)
    db.commit()
    db.refresh(new_deviation)

    return new_deviation


# Get all deviations
@router.get("/")
def get_deviations(
    db: Session = Depends(get_db)
):

    return db.query(Deviation).all()


# Get one deviation
@router.get("/{deviation_id}")
def get_deviation(
    deviation_id: int,
    db: Session = Depends(get_db)
):

    deviation = db.query(Deviation).filter(
        Deviation.id == deviation_id
    ).first()

    if not deviation:
        raise HTTPException(
            status_code=404,
            detail="Deviation not found"
        )

    return deviation



# Update deviation
@router.put("/{deviation_id}")
def update_deviation(
    deviation_id: int,
    data: DeviationCreate,
    db: Session = Depends(get_db)
):

    deviation = db.query(Deviation).filter(
        Deviation.id == deviation_id
    ).first()

    if not deviation:
        raise HTTPException(
            status_code=404,
            detail="Deviation not found"
        )

    for key, value in data.model_dump().items():
        setattr(deviation, key, value)

    db.commit()
    db.refresh(deviation)

    return deviation


# delete deviation

@router.delete("/{deviation_id}")
def delete_deviation(
    deviation_id: int,
    db: Session = Depends(get_db)
):

    deviation = db.query(Deviation).filter(
        Deviation.id == deviation_id
    ).first()

    if not deviation:
        raise HTTPException(
            status_code=404,
            detail="Deviation not found"
        )

    db.delete(deviation)
    db.commit()

    return {
        "message": "Deviation deleted successfully"
    }




@router.post("/analyze")
async def analyze_deviation_input(
    text: str = Form(None),
    file: UploadFile = File(None)
):


    if not text and not file:
        raise HTTPException(
            status_code=400,
            detail="Please provide either text or a PDF file"
        )

    if text and file:
        raise HTTPException(
            status_code=400,
            detail="Please provide either text OR a PDF file, not both"
        )


    
   # Get text from input
    try:

        # User provided PDF
        if file:

            if not file.filename.lower().endswith(".pdf"):
                raise HTTPException(
                    status_code=400,
                    detail="Only PDF files are supported"
                )

            file_bytes = await file.read()

            if not file_bytes:
                raise HTTPException(
                    status_code=400,
                    detail="Uploaded PDF is empty"
                )

            extracted_text = extract_text_from_pdf(
                file_bytes
            )

            if not extracted_text:
                raise HTTPException(
                    status_code=400,
                    detail="No text could be extracted from PDF"
                )

            source = "pdf"
            filename = file.filename


        # User provided text
        else:

            if not text.strip():
                raise HTTPException(
                    status_code=400,
                    detail="Text cannot be empty"
                )

            extracted_text = text.strip()

            source = "text"
            filename = None


      
        # # Send text to AI
        # result = analyze_deviation(
        #     extracted_text
        # )

        result = deviation_graph.invoke({
            "text": extracted_text,
            "result": {}
        })


     


        return {
            "success": True,
            "source": source,
            "filename": filename,
            "extracted_text": extracted_text,
            "result": result
        }


    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )