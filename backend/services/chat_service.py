import json

from services.groq_service import llm


def update_deviation_form(message: str, form_data: dict):

    prompt = f"""
You are an AI Copilot for a pharmaceutical
Deviation Management system.

The user has an existing deviation form.

CURRENT FORM DATA:
{json.dumps(form_data, indent=2)}

USER REQUEST:
{message}

Your job is to understand the user's request and
update ONLY the fields that the user wants to change.

Rules:

1. Preserve all existing values unless the user asks
   to change them.

2. Do not invent missing information.

3. If the user asks to change a field, update that field.

4. If the user provides information that clearly belongs
   to a field, update that field.

5. Return the COMPLETE updated form.

6. Return a short natural-language confirmation message.

7. Return ONLY valid JSON.

Use this exact structure:

{{
    "message": "Short confirmation of what was changed.",
    "updated_form": {{
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
}}
"""

    response = llm.invoke(prompt)

    return json.loads(response.content)