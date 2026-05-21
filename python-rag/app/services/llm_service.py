import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use a fast and capable model
model = genai.GenerativeModel("gemini-2.5-flash")


def generate_answer(query: str, results: list) -> str:
    """
    Generate a natural-language explanation based on retrieved code symbols.
    Includes graceful fallback when Gemini quota is exceeded.
    """

    if not results:
        return "I could not find any relevant code for your question."

    # Build context from retrieved symbols
    context_parts = []

    for result in results:
        context_parts.append(
            f"""
Symbol: {result.get('name')}
Type: {result.get('type')}
File: {result.get('filePath')}
Lines: {result.get('startLine')}-{result.get('endLine')}

Content:
{result.get('text')}
"""
        )

    context = "\n\n".join(context_parts)

    # Limit context size to avoid very large prompts
    if len(context) > 20000:
        context = context[:20000] + "\n\n[Context truncated]"

    prompt = f"""
You are an expert software engineering assistant.

Answer the user's question using ONLY the provided code context.

User Question:
{query}

Code Context:
{context}

Instructions:
1. Give a concise and accurate answer.
2. Mention relevant file paths and function names.
3. Explain what the code does.
4. If the answer is uncertain, say so.
5. Format the answer in readable Markdown.
"""

    try:
        response = model.generate_content(prompt)

        # Safely extract text
        if hasattr(response, "text") and response.text:
            return response.text.strip()

        return "The model returned an empty response."

    except Exception as e:
        error_text = str(e)

        # Handle Gemini quota exceeded
        if (
            "RESOURCE_EXHAUSTED" in error_text
            or "429" in error_text
            or "quota exceeded" in error_text.lower()
        ):
            return (
                "⚠️ Gemini API quota exceeded.\n\n"
                "The retrieval pipeline worked successfully and relevant code "
                "was found, but the language model has temporarily hit the "
                "free-tier request limit.\n\n"
                "Please wait about one minute and try again."
            )

        # Handle missing API key
        if "API key" in error_text or "api_key" in error_text.lower():
            return (
                "⚠️ GEMINI_API_KEY is missing or invalid. "
                "Please check your Python `.env` file."
            )

        # Generic fallback
        return f"⚠️ LLM Error:\n\n{error_text}"