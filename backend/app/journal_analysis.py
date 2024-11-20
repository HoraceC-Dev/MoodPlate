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

    print({
        "moods": json_output["moods"],
        "ingredients" :json_output["ingredients"]
    })

    return {
        "moods": json_output["moods"],
        "ingredients" :json_output["ingredients"]
    }

def testing():
    content = """
Date: November 19, 2024

Today was one of those long, grueling days. I’ve been in the library since 8 AM, drowning in textbooks and lecture notes. The midterm results came out this afternoon, and I got a 50%. It feels like a punch in the gut. I honestly thought I was doing better—maybe all this effort wasn’t enough? Or maybe I just don’t get it.

Everyone else seems to be moving forward, and here I am, stuck in this endless cycle of studying and falling short. I skipped lunch because I was too anxious about the results and barely drank any water. By the time I grabbed a coffee in the evening, my head was pounding, and I felt like a zombie.

It’s so frustrating. I know I’ve been putting in the hours, but it doesn’t feel like it’s paying off. How do people stay so calm under pressure? I just feel exhausted, overwhelmed, and like I’m running out of steam.
"""
    analyze_journal(content)
