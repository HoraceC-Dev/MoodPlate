# tests/test_main.py

import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from app.main import app

# Fixtures
@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def mock_db(monkeypatch):
    mock = MagicMock()
    monkeypatch.setattr("app.main.db", mock)
    return mock

# Test Cases

# POST /journals
def test_create_journal_success(client, mock_db):
    payload = {
        "id": 1,
        "name": "Daily Thoughts",
        "content": "Today I learned about testing in FastAPI.",
        "recommendation": "Keep up the good work!"
    }
    response = client.post("/journals", json=payload)
    if response.status_code != 200:
        print("Response JSON:", response.json())
        print("Response Text:", response.text)
    
    assert response.status_code == 200



# PUT /journals/{journal_id}
def test_update_journal_success(client, mock_db):
    new_journal = {
        "id": 1,
        "name": "Updated Journal",
        "content": "Updated content.",
        "recommendation": "New recommendation."
    }
    response = client.post("/journals/update", json=new_journal)
    
    if response.status_code != 200:
        print("Response JSON:", response.json())
        print("Response Text:", response.text)
    
    assert response.status_code == 200


def test_update_journal_not_found(client, mock_db):
    journal_id = 999
    new_journal = {
        "name": "Non-existent Journal",
        "content": "No content.",
        "recommendation": "No recommendation."
    }
    response = client.put(f"/journals/{journal_id}", json=new_journal)
    assert response.status_code == 404
    assert response.json() == {"detail": "Journal not found."}

# DELETE /journals/{journal_id}
def test_delete_journal_success(client, mock_db):
    journal_id = 1
    response = client.delete(f"/journals/{journal_id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Journal deleted successfully"}

def test_delete_journal_not_found(client, mock_db):
    journal_id = 999
    response = client.delete(f"/journals/{journal_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Journal not found."}

# GET /recipe_recommendation/{journal_id}
def test_check_recipe_success(client, mock_db):
    journal_id = 1
    recipes = ["Spaghetti Bolognese", "Vegetarian Lasagna", "Pesto Pasta"]
    response = client.get(f"/recipe_recommendation/{journal_id}")
    assert response.status_code == 200
    assert response.json() == {"recommendation": recipes}

def test_check_recipe_no_recommendations(client, mock_db):
    journal_id = 999
    mock_db.get_recipe.return_value = []
    response = client.get(f"/recipe_recommendation/{journal_id}")
    assert response.status_code == 200
    assert response.json() == {"recommendation": []}
    mock_db.get_recipe.assert_called_once_with(journal_id)

# POST /recipe_recommendation
def test_generate_recommendation_success(client, mock_db, capsys):
    input_data = {
        "journalId": 1,
        "preferences": {
            "diet": "vegetarian",
            "cuisine": "Italian"
        }
    }
    response = client.post("/recipe_recommendation", json=input_data)
    assert response.status_code == 200
    assert response.json() == {"recommendation": "testing"}
    # Capture print statements
    captured = capsys.readouterr()
    assert captured.out == f"<class 'dict'>\n{input_data['preferences']}\n"

def test_generate_recommendation_invalid_data(client):
    input_data = {
        "journalId": 1
        # Missing 'preferences'
    }
    response = client.post("/recipe_recommendation", json=input_data)
    assert response.status_code == 422
    assert "preferences" in response.text
