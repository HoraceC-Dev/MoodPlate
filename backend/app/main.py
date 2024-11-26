from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from database_operation import DB
from journal_analysis import analyze_journal
from recipe_finder import get_recipes
import sys
app = FastAPI()

# Simulated database
journals = []

db = DB()

origins = [
    "http://localhost:3000",
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Journal schema
class Journal(BaseModel):
    id: int
    name: str
    content: str
    recommendation: str

@app.post("/journals")
async def create_journal(journal: dict):
    created_journal = db.create_journal(journal)
    return created_journal

@app.get("/journals", response_model=List[Journal])
async def get_journals():
    return []
    # return db.get_all_journals()  # Assuming you have a method to fetch all journals

@app.post("/journals/update")
async def update_journal(new_journal: dict):
    db.update_journal(new_journal)
    return {"message": "Journal updated successfully"}

@app.delete("/journals/{journal_id}")
async def delete_journal(journal_id: str):
    db.delete_journal(journal_id)
    return {"message": "Journal deleted successfully"}

@app.get("/recipe_recommendation/{journal_id}")
async def check_recipe(journal_id: str):
    recipes = db.get_recipe(journal_id)
    return {"recommendation":recipes}

@app.post("/recipe_recommendation")
async def generate_recommendation(input: dict):
    print(input)
    journal = input["journal"]
    preference = input["preference"]
    mood_analysis = analyze_journal(journal["content"])
    result = get_recipes(mood_analysis, preference)
    journal["recommendation"] = result
    db.update_journal(journal)
    modified_text = result.replace("```md", "")
    final_text = modified_text.replace("```", "")
    print(final_text)
    return {"recommendation": final_text}

@app.get("/interpreter")
def get_interpreter():
    return {"python_executable": sys.executable}


