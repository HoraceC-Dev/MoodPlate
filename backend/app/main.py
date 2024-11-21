from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Simulated database
journals = []

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Journal schema
class Journal(BaseModel):
    id: int
    name: str
    content: str

@app.post("/journals")
async def create_journal(journal: Journal):
    # Simulated database save
    journals.append(journal)
    return {"message": "Journal created successfully", "journal": journal}

@app.get("/journals", response_model=List[Journal])
async def get_journals():
    return journals