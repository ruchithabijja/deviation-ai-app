from services.groq_service import analyze_deviation


text = """
Batch Number: BATCH-102

Product: Paracetamol API

During manufacturing, the reactor temperature
reached 95°C.

The approved temperature range is 80°C to 90°C.

The deviation was detected by the production operator.

The batch was placed on hold for investigation.
"""


result = analyze_deviation(text)

print(result)