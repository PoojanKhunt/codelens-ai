import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


def generate_answer(query: str, results: list, history: list = []) -> str:
    if not results:
        return "I could not find any relevant code for your question."

    # Build conversation history context
    history_text = ""
    if history:
        for msg in history[-4:]:
            role = "User" if msg["role"] == "user" else "Assistant"
            history_text += f"{role}: {msg['content'][:300]}\n"

    # Build context from retrieved symbols
    context_parts = []
    for result in results:
        context_parts.append(
            f"""Symbol: {result.get('name')}
Type: {result.get('type')}
File: {result.get('filePath')}
Lines: {result.get('startLine')}-{result.get('endLine')}

Content:
{result.get('text')}"""
        )

    context = "\n\n".join(context_parts)

    if len(context) > 20000:
        context = context[:20000] + "\n\n[Context truncated]"

    prompt = f"""You are an expert software engineering assistant.

Previous conversation:
{history_text}

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
        if hasattr(response, "text") and response.text:
            return response.text.strip()
        return "The model returned an empty response."

    except Exception as e:
        error_text = str(e)

        if (
            "RESOURCE_EXHAUSTED" in error_text
            or "429" in error_text
            or "quota exceeded" in error_text.lower()
        ):
            return (
                "⚠️ Gemini API quota exceeded.\n\n"
                "Please wait about one minute and try again."
            )

        if "API key" in error_text or "api_key" in error_text.lower():
            return (
                "⚠️ GEMINI_API_KEY is missing or invalid. "
                "Please check your Python `.env` file."
            )

        return f"⚠️ LLM Error:\n\n{error_text}"