from dotenv import load_dotenv
import requests
import os

def get_recipes(recommendation, meal_type, user_preferences):
    """
    Fetch recipes based on user preferences using Spoonacular API.
    :param preferences: Dictionary containing extracted insights.
    :return: List of recommended recipes.
    """
    load_dotenv()
    SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")
    BASE_URL = "https://api.spoonacular.com/recipes"

    endpoint = f"{BASE_URL}/complexSearch"
    
    ingredients_string = ",".join(recommendation["ingredients"]["name"])

    params = {
        "apiKey": SPOONACULAR_API_KEY,
        "includeIngredients": ingredients_string,
        "type": meal_type,
        "cuisine": user_preferences.get("cuisine"),
        "diet": user_preferences.get("diet"),
        "type": meal_type,
        "number": 5,
        "sort": "popularity"
    }
    filtered_params = {key: value for key, value in params.items() if value is not None}

    # Use `filtered_params` for the API request
    response = requests.get(endpoint, params=filtered_params)

    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        print("Error:", response.json())
        return []