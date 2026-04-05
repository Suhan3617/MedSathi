// AlgoMed2/Backend/controllers/aiController.js
const getGeminiResponse = require('../utils/gemini');
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Ensure you have this import for the symptom checker

// Ensure API key is available
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// generateSOAPNotes 
const generateSOAPNotes = async (req, res, next) => {
    try {
        // 1. ADDED VITALS TO THE DESTRUCTURING
        const { text, vitals, patientAge, patientGender } = req.body;

        if (!text) {
            res.status(400);
            throw new Error('No text provided for analysis');
        }

        // 2. FORMAT VITALS FOR THE PROMPT
        const vitalsString = vitals 
            ? `BP: ${vitals.bp || 'N/A'}, Temp: ${vitals.temp || 'N/A'}, Weight: ${vitals.weight || 'N/A'}, Pulse: ${vitals.pulse || 'N/A'}`
            : 'No vitals provided.';

        // 3. UPDATED PROMPT WITH STRICT GUARDRAILS
        const prompt = `
        You are an expert medical scribe assistant for an AI-integrated telemedicine portal. 
        Analyze the following raw doctor's notes and vitals to generate a structured SOAP format.
        
        Patient Context: ${patientAge || 'Unknown'} years old, ${patientGender || 'Unknown'}.
        Vitals Recorded: ${vitalsString}
        
        Raw Notes:
        "${text}"

        Output Instructions:
        1. Return ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json.
        2. The JSON structure must strictly be:
        {
            "subjective": "Patient's complaints, history, and symptoms...",
            "objective": "Summarize the Vitals Recorded here. Do NOT invent physical exam findings.",
            "assessment": "Likely diagnosis or differential diagnoses based strictly on the provided text.",
            "plan": "Treatment plan, medications, follow-up based on context.",
            "suggestedICD10": ["Code - Description", ...],
            "redFlags": ["Any critical warnings based on vitals or text..."]
        }
        3. CRITICAL RULE: Do NOT hallucinate or make up medical symptoms, test results, or physical exams that are not present in the "Raw Notes" or "Vitals Recorded". 
        4. If a section lacks enough information, explicitly output: "Insufficient data provided."
        `;

        const rawResponse = await getGeminiResponse(prompt);
        
        // Clean up response if it contains markdown code blocks
        const jsonString = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        let structuredData;
        try {
            structuredData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("JSON Parsing Error from Gemini:", jsonString);
            // Fallback if AI fails to return strict JSON
            structuredData = {
                subjective: rawResponse,
                objective: "",
                assessment: "",
                plan: "",
                suggestedICD10: [],
                redFlags: ["Error parsing AI response format"]
            };
        }

        res.status(200).json({
            success: true,
            data: structuredData
        });

    } catch (error) {
        next(error);
    }
};


// checkSymptoms (AI Triage Chatbot for Patients)
const checkSymptoms = async (req, res, next) => {
    try {
        const { messages } = req.body; 
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ success: false, message: 'Chat history is required' });
        }

        // 🔥 FAIL-SAFE MODEL: "gemini-pro"
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const promptRules = `You are an empathetic medical triage AI assistant for AlgoMed. 
        RULES:
        1. Ask ONLY ONE short follow-up question at a time.
        2. Do NOT diagnose or prescribe medicines.
        3. After 3-4 questions, output ONLY a JSON object: {"isComplete": true, "triageLevel": "Low" | "Medium" | "High", "recommendedSpecialist": "Specialty Name", "summary": "Brief summary"}
        
        CRITICAL: The "recommendedSpecialist" MUST BE exactly one of the following from this list (choose the most relevant):
        - General Physician
        - Cardiologist
        - Dermatologist
        - Pediatrician
        - Neurologist
        - Psychiatrist
        
        If unsure, default to "General Physician".
        `;

        // Format history
        let formattedHistory = messages.slice(0, -1).map(msg => ({
            role: msg.role === 'ai' || msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift(); 
        }

        const chat = model.startChat({ history: formattedHistory });
        
        // Inject rules directly into the latest message
        const latestMessage = promptRules + messages[messages.length - 1].content;
        
        const result = await chat.sendMessage(latestMessage);
        let responseText = result.response.text().trim();

        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        res.status(200).json({ success: true, text: responseText });

    } catch (error) {
        console.error("Gemini Symptom Checker Error:", error);
        res.status(500).json({ success: false, message: "AI Assistant is currently unavailable. Please try again." });
    }
};


module.exports = { 
    generateSOAPNotes,
    checkSymptoms 
};