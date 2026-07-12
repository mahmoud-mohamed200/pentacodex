import datetime
import uvicorn
import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from bson import ObjectId
from dotenv import load_dotenv
from openai import OpenAI

import schemas
from mongo import inquiries_collection, bookings_collection

load_dotenv()

# Initialize Groq client (free, fast, OpenAI-compatible API)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
groq_client = None
if GROQ_API_KEY:
    groq_client = OpenAI(
        api_key=GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1"
    )
    print(f"✅ Groq AI client initialized (model: {GROQ_MODEL})")
else:
    print("⚠️  No GROQ_API_KEY found in .env — chatbot will use Ollama fallback or return error.")

app = FastAPI(
    title="Pentacodex Lead & Booking API (MongoDB)",
    description="Python backend API using MongoDB for managing inquiries and discovery call bookings.",
    version="1.0.0"
)

# Configure CORS to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify ["http://localhost:8080", "http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print("FastAPI Validation Error Details:", exc.errors())
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

def serialize_mongo_doc(doc, response_cls):
    """Utility helper to serialize Mongo document by renaming _id to id and casting to string."""
    if not doc:
        return None
    doc_copy = dict(doc)
    doc_copy["id"] = str(doc_copy.pop("_id"))
    return doc_copy

@app.post("/api/contact", response_model=schemas.InquiryResponse, status_code=status.HTTP_201_CREATED)
def create_inquiry(inquiry: schemas.InquiryCreate):
    new_inquiry = {
        "first_name": inquiry.firstName,
        "last_name": inquiry.lastName,
        "company": inquiry.company,
        "email": inquiry.email,
        "phone": inquiry.phone,
        "service": inquiry.service,
        "details": inquiry.details,
        "budget_estimate": inquiry.budgetEstimate,
        "status": "new",
        "created_at": datetime.datetime.utcnow()
    }
    
    result = inquiries_collection.insert_one(new_inquiry)
    created_doc = inquiries_collection.find_one({"_id": result.inserted_id})
    
    return schemas.InquiryResponse(
        id=str(created_doc["_id"]),
        firstName=created_doc["first_name"],
        lastName=created_doc["last_name"],
        company=created_doc["company"],
        email=created_doc["email"],
        phone=created_doc["phone"],
        service=created_doc["service"],
        details=created_doc["details"],
        budgetEstimate=created_doc["budget_estimate"],
        status=created_doc["status"],
        createdAt=created_doc["created_at"]
    )

@app.get("/api/inquiries", response_model=List[schemas.InquiryResponse])
def read_inquiries():
    db_inquiries = list(inquiries_collection.find())
    results = []
    for doc in db_inquiries:
        results.append(schemas.InquiryResponse(
            id=str(doc["_id"]),
            firstName=doc["first_name"],
            lastName=doc["last_name"],
            company=doc["company"],
            email=doc["email"],
            phone=doc["phone"],
            service=doc["service"],
            details=doc["details"],
            budgetEstimate=doc["budget_estimate"],
            status=doc["status"],
            createdAt=doc["created_at"]
        ))
    return results

@app.patch("/api/inquiries/{inquiry_id}/status", response_model=schemas.InquiryResponse)
def update_inquiry_status(inquiry_id: str, payload: schemas.InquiryUpdateStatus):
    try:
        oid = ObjectId(inquiry_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid inquiry ID format")

    db_inquiry = inquiries_collection.find_one({"_id": oid})
    if not db_inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    inquiries_collection.update_one(
        {"_id": oid},
        {"$set": {"status": payload.status}}
    )
    
    updated_doc = inquiries_collection.find_one({"_id": oid})
    
    return schemas.InquiryResponse(
        id=str(updated_doc["_id"]),
        firstName=updated_doc["first_name"],
        lastName=updated_doc["last_name"],
        company=updated_doc["company"],
        email=updated_doc["email"],
        phone=updated_doc["phone"],
        service=updated_doc["service"],
        details=updated_doc["details"],
        budgetEstimate=updated_doc["budget_estimate"],
        status=updated_doc["status"],
        createdAt=updated_doc["created_at"]
    )

@app.post("/api/bookings", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking: schemas.BookingCreate):
    # Check if slot already booked
    existing = bookings_collection.find_one({"booked_slot": booking.bookedSlot})
    if existing:
        raise HTTPException(status_code=400, detail="This slot is already booked.")
        
    new_booking = {
        "client_name": booking.clientName,
        "client_email": booking.clientEmail,
        "client_phone": booking.clientPhone,
        "booked_slot": booking.bookedSlot,
        "notes": booking.notes,
        "created_at": datetime.datetime.utcnow()
    }
    
    result = bookings_collection.insert_one(new_booking)
    created_doc = bookings_collection.find_one({"_id": result.inserted_id})
    
    return schemas.BookingResponse(
        id=str(created_doc["_id"]),
        clientName=created_doc["client_name"],
        clientEmail=created_doc["client_email"],
        clientPhone=created_doc.get("client_phone", ""),
        bookedSlot=created_doc["booked_slot"],
        notes=created_doc.get("notes"),
        createdAt=created_doc["created_at"]
    )

@app.get("/api/bookings", response_model=List[schemas.BookingResponse])
def read_bookings():
    db_bookings = list(bookings_collection.find())
    results = []
    for doc in db_bookings:
        results.append(schemas.BookingResponse(
            id=str(doc["_id"]),
            clientName=doc["client_name"],
            clientEmail=doc["client_email"],
            clientPhone=doc.get("client_phone", ""),
            bookedSlot=doc["booked_slot"],
            notes=doc.get("notes"),
            createdAt=doc["created_at"]
        ))
    return results


# --- Professional System Prompt (shared by all AI providers) ---
PENTACODEX_SYSTEM_PROMPT = """You are a highly professional, intelligent, and consultative Virtual Assistant working for Pentacodex — a premium Software House. Your primary role is to act as a "First-Line Technical Consultant" for potential clients visiting our platform. You speak and write ONLY in English.

## Company Core Services (Knowledge Base):
- **Artificial Intelligence & Computer Vision**: Smart Retail analytics, theft detection, Industrial Safety monitoring, YOLO-based solutions.
- **Enterprise & Internal Systems**: Custom HRMS, CRM, Payroll, and Loans management.
- **Backend Development & High-Performance Infrastructure**.
- **Custom Software Development** from scratch.

## Tone & Personality:
- Professional, welcoming, and business-oriented.
- Empathetic to the client's business pain points.
- Simple and clear. Avoid deep technical jargon (like specific code, frameworks, or GPU models) UNLESS the client is highly technical and initiates that level of detail.
- Transparent: Never pretend to be a human engineer. Acknowledge that you are an AI assistant helping to prepare their requirements for the engineering and sales team.

## Key Directives & Conversation Flow:
1. **Greet & Discover**: Welcome the user and ask an open-ended question about the business challenge they are trying to solve (e.g., "How can I help you technically develop your business today?").
2. **Probe & Clarify**: Ask 1 to 2 targeted questions to understand the scope. Do NOT list all services at once. Instead, tailor your response to their problem (e.g., if they mention retail, mention your Smart Retail/CV solutions; if they mention team management, discuss HRMS).
3. **Focus on Value (ROI)**: When explaining a potential solution, focus on business value (saving time, reducing cost, improving security, automation) rather than just technical features.
4. **Escalate & Call to Action (CTA)**: Once you have a high-level understanding of their need, DO NOT provide final pricing or binding timelines. Instead, summarize their request and encourage them to book a "Discovery Meeting" by explicitly outputting the link `[Book a Discovery Call](book-call)` in your response so they can click it. Ask for their preferred contact method.

## Strict Constraints:
- **English ONLY**: You must respond ONLY in English. Do NOT write in Arabic or any other language under any circumstances, even if the user communicates in Arabic.
- **No Repetition**: Do NOT repeat your previous questions, greetings, or sentences. Do not restate facts the user already confirmed. Check the chat history to see what has already been said, and always progress the conversation dynamically with new questions or value points.
- DO NOT invent prices, project timelines, or guarantee specific technical results. Use phrases like "Cost is determined based on the project scope".
- Keep responses concise and easy to read. Use bullet points for readability.
- If the user asks a question outside the scope of software development, politely redirect them back to your core services.
"""


@app.post("/api/chatbot", response_model=schemas.ChatbotResponse)
def run_chatbot(payload: schemas.ChatbotRequest):
    message = payload.message.strip()
    step = payload.step
    history = payload.history
    
    import requests as http_requests
    
    # Build conversation messages from history (last 20 messages for rich context)
    def build_messages(system_prompt_text):
        messages = [{"role": "system", "content": system_prompt_text}]
        for msg in history[-20:]:
            role = "assistant" if msg.sender == "bot" else "user"
            messages.append({"role": role, "content": msg.text})
        messages.append({"role": "user", "content": message})
        return messages
    
    # ──────────────────────────────────────────────────────────────
    # Mode A (Primary): Groq Cloud API (free, fast)
    # ──────────────────────────────────────────────────────────────
    if groq_client:
        try:
            groq_messages = build_messages(PENTACODEX_SYSTEM_PROMPT)
            
            response = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=groq_messages,
                temperature=0.6,
                max_tokens=500
            )
            reply = response.choices[0].message.content.strip()
            print(f"✅ Groq response OK ({len(reply)} chars)")
            return schemas.ChatbotResponse(reply=reply, nextStep="chat", options=[])
        except Exception as e:
            print(f"❌ Groq error: {e}")
            pass

    # ──────────────────────────────────────────────────────────────
    # Mode B (Fallback): Local Ollama
    # ──────────────────────────────────────────────────────────────
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")
    
    ollama_active = False
    try:
        tags_response = http_requests.get(f"{OLLAMA_URL}/api/tags", timeout=2)
        if tags_response.status_code == 200:
            ollama_active = True
            models = [m["name"] for m in tags_response.json().get("models", [])]
            if models:
                model_match = next((m for m in models if OLLAMA_MODEL in m), models[0])
                OLLAMA_MODEL = model_match
            else:
                ollama_active = False
    except Exception:
        ollama_active = False

    if ollama_active:
        try:
            ollama_messages = build_messages(PENTACODEX_SYSTEM_PROMPT)

            response = http_requests.post(
                f"{OLLAMA_URL}/api/chat",
                json={
                    "model": OLLAMA_MODEL,
                    "messages": ollama_messages,
                    "stream": False,
                    "options": {
                        "temperature": 0.6,
                        "num_predict": 500
                    }
                },
                timeout=60
            )
            
            if response.status_code == 200:
                reply = response.json()["message"]["content"].strip()
                print(f"✅ Ollama response OK ({len(reply)} chars)")
                return schemas.ChatbotResponse(reply=reply, nextStep="chat", options=[])
        except Exception as e:
            print(f"❌ Ollama error: {e}")
            pass
            
    # Fallback: All AI services unreachable
    reply = (
        "I apologize, but my AI services are currently unreachable. "
        "You can reach us directly via the Contact Form or book a Discovery Meeting with our team."
    )
    return schemas.ChatbotResponse(reply=reply, nextStep="chat", options=[])

@app.post("/api/chatbot/summary", response_model=schemas.ChatbotSummaryResponse)
def generate_chatbot_summary(payload: schemas.ChatbotSummaryRequest):
    history = payload.history
    if not history:
        return schemas.ChatbotSummaryResponse(summary="")
        
    summary_prompt = (
        "Based on the following conversation between a software consultant and a client, "
        "generate a brief, professional summary of the client's project requirements in English.\n"
        "Format it as clean markdown bullet points (e.g., Project Concept, Target Platform, Core Features, etc.).\n"
        "Keep it concise (maximum 4-5 bullet points) and focus ONLY on the extracted specifications. Do not include any chat logs or extra greetings.\n\n"
        "Conversation History:\n"
    )
    for msg in history:
        role = "Consultant" if msg.sender == "bot" else "Client"
        summary_prompt += f"{role}: {msg.text}\n"

    # Call Groq
    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that summarizes software requirements concisely in English."},
                    {"role": "user", "content": summary_prompt}
                ],
                temperature=0.3,
                max_tokens=300
            )
            summary = response.choices[0].message.content.strip()
            print("✅ Groq AI summary generated successfully")
            return schemas.ChatbotSummaryResponse(summary=summary)
        except Exception as e:
            print("Failed to generate summary with Groq:", e)
            
    # Fallback to local Ollama if Groq fails
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")
    try:
        import requests
        response = requests.post(
            f"{OLLAMA_URL}/api/chat",
            json={
                "model": OLLAMA_MODEL,
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that summarizes software requirements concisely in English."},
                    {"role": "user", "content": summary_prompt}
                ],
                "stream": False,
                "options": {"temperature": 0.3, "num_predict": 300}
            },
            timeout=15
        )
        if response.status_code == 200:
            summary = response.json()["message"]["content"].strip()
            print("✅ Ollama AI summary generated successfully")
            return schemas.ChatbotSummaryResponse(summary=summary)
    except Exception as e:
        print("Failed to generate summary with Ollama fallback:", e)
        pass
        
    # Manual fallback if both fail
    user_msgs = [m.text for m in history if m.sender == "user"]
    summary = "Project Concept: " + (" / ".join(user_msgs[-3:]) if user_msgs else "No details provided.")
    return schemas.ChatbotSummaryResponse(summary=summary)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
