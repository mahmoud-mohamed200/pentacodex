with open("backend/main.py", "r") as f:
    lines = f.readlines()

start_idx = 236  
end_idx = 483    

new_content = """                return schemas.ChatbotResponse(reply=reply, nextStep="chat", options=[])
        except Exception as e:
            print("Ollama call failed, trying next provider:", e)
            pass

    # 2. Mode B: Cloud AI-powered Chatbot (via OpenAI if API key present)
    if openai_client:
        try:
            system_prompt = (
                "You are the Pentacodex Assistant, acting as a professional Software Project Manager (PM).\\n"
                "Pentacodex builds custom software (Web apps, mobile apps, AI integrations, ERP/CRM systems).\\n"
                "Engage in an unstructured, highly intelligent scoping discussion with the client about their software idea.\\n"
                "Ask clarifying questions, suggest architectural decisions (e.g. databases, cloud providers, APIs), and guide them.\\n"
                "Act like a PM: be supportive, ask technical/process questions, and suggest solutions.\\n"
                "Keep responses concise (2-4 sentences) and reply in the same language the client uses (Arabic or English).\\n"
                "Do NOT list out future steps or options."
            )
            
            messages_list = [{"role": "system", "content": system_prompt}]
            for msg in history[-8:]:
                role = "assistant" if msg.sender == "bot" else "user"
                messages_list.append({"role": role, "content": msg.text})
            messages_list.append({"role": "user", "content": message})
            
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages_list,
                temperature=0.7,
                max_tokens=180
            )
            reply = response.choices[0].message.content.strip()
            return schemas.ChatbotResponse(reply=reply, nextStep="chat", options=[])
        except Exception as e:
            print("OpenAI error, falling back:", e)
            pass
            
    # Fallback if both AI models fail
    reply = "I apologize, but my AI services are currently unreachable. Please try again in a moment, or contact us directly."
    if any(char in message for char in "أبتثجحخدذرزسشصضطظعغفقكلمنهوي"):
        reply = "أعتذر، ولكن خدمات الذكاء الاصطناعي الخاصة بي غير متاحة حالياً. يرجى المحاولة مرة أخرى بعد قليل، أو التواصل معنا مباشرة."
    
    return schemas.ChatbotResponse(reply=reply, nextStep="chat", options=[])
"""

with open("backend/main.py", "w") as f:
    f.writelines(lines[:start_idx])
    f.write(new_content)
    f.writelines(lines[end_idx+1:])

print("Successfully updated main.py")
