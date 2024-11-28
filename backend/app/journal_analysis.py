from langchain_core.prompts import ChatPromptTemplate
import json

from app.models.llm import llm_mistral

def analyze_journal(journal_text):
    prompt = ChatPromptTemplate.from_messages(
        [("system", """
Role: Journal Analyst

Task: Analyze the provided journal to identify the user's need and mental state(s) and recommend a list of ingredients that can help the user regain and maintain well-being. Your response must strictly adhere to the specified JSON schema.

Output Schema:
json
{{
    "moods": List[str], 
    "ingredients": List[ 
        {{
            "name": str, 
            "description": str
        }}
    ]
}}

Description of Output Schema
          
mood:
Type: List[str]
Description: A list of emotions or mental states identified in the user's journal (e.g., "stressed," "anxious," "happy").
          
ingredients:
Type: List[Dict[str, str]]
Description: A list where each item is a dictionary containing:
name: The name of the raw ingredients(e.g. Spinach, Kale, Broccoli, Sweet potatoes, Carrots, Bell peppers, Cauliflower, Zucchini, Garlic, Onions, Apples, Bananas, Blueberries, Strawberries, Oranges, Avocados, Grapes, Pineapple, Lemons, Mangoes, Grains and Legumes, Brown rice, Quinoa, Oats, Lentils, Chickpeas, Black beans, Barley, Bulgur, Farro, Millet, Proteins, Eggs, Chicken breast, Salmon, Tuna, Tofu, Tempeh, Greek yogurt, Nuts (almonds, walnuts), Seeds (chia, flax, sunflower), Lean beef, Olive oil, Coconut oil, Avocado, Nuts (almonds, cashews, pistachios), Seeds (pumpkin, sesame, chia), Dark chocolate (70% cocoa or higher), Fatty fish (salmon, mackerel), Nut butter (almond butter, peanut butter), Spices and Herbs, Turmeric, Ginger, Cinnamon, Cumin, Paprika, Parsley, Cilantro, Basil, Oregano, Rosemary, Low-fat milk, Cheese (in moderation), Kefir, Almond milk, Soy milk, Honey, Green tea, Matcha powder, Apple cider vinegar, Seaweed, Kimchi, Sauerkraut, Miso)
description: A brief explanation of how this ingredient can support the user's mental well-being (talk about the nutrient contained by this ingredient).
          
Important note: You must strictly follow the output guideline. Pure json output, no greeting and follow-up at all. 
For ingredients, please think step by step, thoroughly explore the space. 
The following are some common ingredients and don't consider them as your first options if there are better alternatives: 
Spinach
Blueberries
Dark Chocolate
banana
          
"""),
("human", "{journal}")
        ]
    )

    chain = prompt | llm_mistral()

    result = chain.invoke({"journal" :journal_text})

    json_string_content = result.content

    json_output = json.loads(json_string_content)

    return {
        "moods": json_output["moods"],
        "ingredients" :json_output["ingredients"]
    }
