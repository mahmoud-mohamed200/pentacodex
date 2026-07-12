import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8002";

// Zod validation schemas
const inquirySchema = z.object({
  firstName: z.string().min(1, "First name is required").max(80),
  lastName: z.string().min(1, "Last name is required").max(80),
  company: z.string().max(120).optional(),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(40).optional(),
  service: z.string().min(1, "Service type is required"),
  details: z.string().min(1, "Project details are required").max(2000),
  budgetEstimate: z.string().optional(),
});

const bookingSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  clientEmail: z.string().email("Invalid email address"),
  clientPhone: z.string().min(5, "Phone number is required"),
  bookedSlot: z.string().min(1, "Time slot is required"),
  notes: z.string().optional(),
});

export const submitInquiryAction = createServerFn({ method: "POST" })
  .validator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to submit inquiry to Python backend.");
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (e: any) {
      console.error("Action error saving inquiry:", e);
      return { success: false, error: e.message || "Failed to submit inquiry" };
    }
  });

export const bookDiscoveryCallAction = createServerFn({ method: "POST" })
  .validator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to book slot on Python backend.");
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (e: any) {
      console.error("Action error booking call:", e);
      return { success: false, error: e.message || "Failed to book slot" };
    }
  });

export const getBookingsAction = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/bookings`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings from Python backend.");
      }
      return await response.json();
    } catch (e: any) {
      console.error("Action error getting bookings:", e);
      throw e;
    }
  });

export const getInquiriesAction = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/inquiries`);
      if (!response.ok) {
        throw new Error("Failed to fetch inquiries from Python backend.");
      }
      return await response.json();
    } catch (e: any) {
      console.error("Action error getting inquiries:", e);
      throw e;
    }
  });

export const updateInquiryStatusAction = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/inquiries/${data.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: data.status }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to update status on Python backend.");
      }

      return { success: true };
    } catch (e: any) {
      console.error("Action error updating inquiry status:", e);
      return { success: false, error: e.message };
    }
  });

export const interactChatbotAction = createServerFn({ method: "POST" })
  .validator((data: { message: string; step: string; history: any[] }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to interact with Python chatbot.");
      }

      return await response.json();
    } catch (e: any) {
      console.error("Action error interacting with chatbot:", e);
      throw e;
    }
  });

export const getChatbotSummaryAction = createServerFn({ method: "POST" })
  .validator((data: { history: any[] }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/chatbot/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate chatbot conversation summary.");
      }

      return await response.json();
    } catch (e: any) {
      console.error("Action error generating summary:", e);
      throw e;
    }
  });
