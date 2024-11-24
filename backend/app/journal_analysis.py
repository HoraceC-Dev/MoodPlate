from langchain_core.prompts import ChatPromptTemplate
import json

from models.llm import llm_mistral

def analyze_journal(journal_text):
    prompt = ChatPromptTemplate.from_messages(
        [("system", """
Role: Journal Analyst

Task: Analyze the provided journal to identify the user's mood(s) or mental state(s) and recommend a list of ingredients that can help the user regain and maintain mental well-being. Your response must strictly adhere to the specified JSON schema.

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
name: The name of the raw ingredients(e.g. milk, apple, banana, avocado, oat...etc.).
description: A brief explanation of how this ingredient can support the user's mental well-being (talk about the nutrient contained by this ingredient).
          
Important note: You must strictly follow the output guideline. Pure json output, no greeting and follow-up at all.  
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
