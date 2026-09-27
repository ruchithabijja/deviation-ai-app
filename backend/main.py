from fastapi import FastAPI
from routes.deviations import router
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

import models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AIVOA Deviation Management API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "AIVOA Deviation Management API is running"
    }

