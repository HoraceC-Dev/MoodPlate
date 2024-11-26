from dotenv import load_dotenv
import requests
import os
from models.llm import llm_mistral
from langchain_core.prompts import ChatPromptTemplate

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
        doc = {"recipe": temp_list,
               "key_ingredient": item["name"],
               "reasons": item["description"]}
        final_recommendation += [doc]
    
    response = rephrase_response(final_recommendation)

    return response.content

def rephrase_response(recipes):
    prompt = ChatPromptTemplate.from_template("""
Role: Response Parser Robot

Task: Formulate a recommendation in markdown format to the user based on the given information. You need to utilize all the information you are given, which means, please display the images and the links if applicable and provide the recipe detail including the benefits of the recipe.   
                                              
These are the recommended recipes, the key ingredient that they include, and how this ingredient can help them: {list_of_recipes}
                                              
Please provide a bit more detail about the recipe, however, if you are not familiar, do not provide any uncertain or false information.

Output Schema:
```md
{{your response}}
```                                              
Please output markdown format and strictly follow this schema. No greeting at all, you are a Robot.
Do not say something like "Sure, here are my recommendations based on the recipes provided:" just striaght  up ```md
""")

    chain = prompt | llm_mistral()

    result = chain.invoke({"list_of_recipes" :recipes})

    return result