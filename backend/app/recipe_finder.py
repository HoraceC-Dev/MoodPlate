from dotenv import load_dotenv
import requests
import os

def get_recipes(recommendation, user_preferences):
    """
    Fetch recipes based on user preferences using Spoonacular API.
    :param preferences: Dictionary containing extracted insights.
    :return: List of recommended recipes.
    """
    load_dotenv()
    SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")
    BASE_URL = "https://api.spoonacular.com/recipes"

    endpoint = f"{BASE_URL}/complexSearch"
    
    final_recommendation = []
    for item in recommendation["ingredients"]:
        print(item["name"])
        params = {
            "apiKey": SPOONACULAR_API_KEY,
            "includeIngredients": item["name"],
            "cuisine": user_preferences["favoriteFood"],
            "diet": user_preferences["dietaryRestrictions"],
            "number": 1,
            "sort": "popularity" if user_preferences["cuisineType"] == None else user_preferences["cuisineType"] 
        }
        filtered_params = {key: value for key, value in params.items() if value is not None}
        response = requests.get(endpoint, params=filtered_params)
        temp_list = response.json().get("results", [])
        final_recommendation += temp_list 
    
    return final_recommendation