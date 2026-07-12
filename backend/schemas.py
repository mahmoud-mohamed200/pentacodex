from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Alias configuration for camelCase frontend integration
class CamelModel(BaseModel):
    class Config:
        populate_by_name = True
        from_attributes = True

class InquiryCreate(CamelModel):
    firstName: str = Field(..., serialization_alias="first_name")
    lastName: str = Field(..., serialization_alias="last_name")
    company: Optional[str] = None
    email: str
    phone: Optional[str] = None
    service: str
    details: str
    budgetEstimate: Optional[str] = Field(None, serialization_alias="budget_estimate")

class InquiryUpdateStatus(CamelModel):
    status: str

class InquiryResponse(CamelModel):
    id: str
    firstName: str = Field(..., serialization_alias="firstName")
    lastName: str = Field(..., serialization_alias="lastName")
    company: Optional[str] = None
    email: str
    phone: Optional[str] = None
    service: str
    details: str
    budgetEstimate: Optional[str] = Field(None, serialization_alias="budgetEstimate")
    status: str
    createdAt: datetime = Field(..., serialization_alias="createdAt")

class BookingCreate(CamelModel):
    clientName: str = Field(..., serialization_alias="client_name")
    clientEmail: str = Field(..., serialization_alias="client_email")
    clientPhone: str = Field(..., serialization_alias="client_phone")
    bookedSlot: str = Field(..., serialization_alias="booked_slot")
    notes: Optional[str] = None

class BookingResponse(CamelModel):
    id: str
    clientName: str = Field(..., serialization_alias="clientName")
    clientEmail: str = Field(..., serialization_alias="clientEmail")
    clientPhone: str = Field(..., serialization_alias="clientPhone")
    bookedSlot: str = Field(..., serialization_alias="bookedSlot")
    notes: Optional[str] = None
    createdAt: datetime = Field(..., serialization_alias="createdAt")

class ChatbotMessage(BaseModel):
    sender: str
    text: str

class ChatbotRequest(CamelModel):
    message: str
    step: str
    history: list[ChatbotMessage] = []

class ChatbotResponse(CamelModel):
    reply: str
    nextStep: str = Field(..., serialization_alias="nextStep")
    options: list[str] = []

class ChatbotSummaryRequest(BaseModel):
    history: list[ChatbotMessage] = []

class ChatbotSummaryResponse(BaseModel):
    summary: str
