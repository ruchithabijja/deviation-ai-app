import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq
import json

load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")


if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY is not set in the .env file"
    )


llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
    api_key=GROQ_API_KEY
)


def analyze_deviation(text: str):

    prompt = f"""
You are an AI assistant for a pharmaceutical API
manufacturing company's Deviation Management system.

Analyze the deviation information below.

Extract the available information and return ONLY valid JSON.

Required JSON fields:

{{
    "site": "",
    "date_of_occurrence": "",
    "title": "",
    "source": "",
    "related_product": "",
    "batch_lot_number": "",
    "detailed_description": "",
    "initial_impact": "",
    "initial_severity": "",
    "severity_reason": ""
}}

Rules:

1. Extract information only from the provided text.
2. Do not invent information.
3. If a field is not available, use an empty string.
4. Create a short meaningful title based on the deviation.
5. Assess the potential impact based only on the information provided.
6. Give an initial severity recommendation.
7. Explain the severity recommendation briefly.
8. Return JSON only.
9. Do not use Markdown code fences.

Deviation information:

{text}
"""

    response = llm.invoke(prompt)

    result = response.content

    return json.loads(result)