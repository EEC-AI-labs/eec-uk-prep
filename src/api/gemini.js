// src/api/gemini.js
// ------------------------------------------------------------
// ✅ Secure Gemini API Helper — uses Vercel's serverless proxy
// ------------------------------------------------------------

const API_URL = "/api/gemini"; // Proxy route (serverless API on Vercel)

/**
 * Base function to call Gemini API via the Vercel proxy
 * @param {string | object} input - Text prompt or full payload
 * @param {AbortSignal} [signal] - Optional abort signal for cancellation
 * @returns {Promise<string>} - Text response from Gemini
 */

export async function callGemini(input, signal = null) {
  console.log("frontend api hitt", input);
  const payload =
    typeof input === "string"
      ? { contents: [{ parts: [{ text: input }] }] }
      : input;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      ...(signal && { signal }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Gemini Proxy Error:", data);
      throw new Error(data?.error?.message || "Gemini proxy request failed");
    }

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("⚠️ Gemini API call aborted");
      return null;
    }
    console.error("💥 Gemini API call failed:", error);
    throw error;
  }
}

// ------------------------------------------------------------
// 🔹 Generate Personalized Interview Prep Content
// ------------------------------------------------------------
export async function generatePrepContent(formData) {
  const prompt = `You are a UK university admissions tutor. Generate interview preparation materials as a JSON object with "keyTalkingPoints" (HTML string) and "questions" (array of 27 objects with question, guidance, modelAnswer).

    Student Profile:
    - University: "${formData.university}"
    - Course Level: "${formData.courseLevel}"
    - Course: "${formData.course}"
    - Previous Qualification: "${formData.prevQualification}"
    - Funding: "${formData.fundingSource}"
    - Sponsor: "${formData.sponsorOccupation}"
    - Career Goals: "${formData.careerGoals}"
    - Gaps: "${formData.studyGap || "None"}"
    
    Create personalized content covering: course choice, funding, UK choice, accommodation, career goals, ties to home, gaps explanation, cultural expectations, and more. Make model answers 150 words max, first-person, and specific to this student.
    
    IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks. Format:
    {
      "keyTalkingPoints": "<div class='ai-content-card'><h2>Your Credibility Narrative</h2><ul><li>Point 1</li></ul></div>",
      "questions": [
        {"question": "...", "guidance": "...", "modelAnswer": "..."}
      ]
    }`;

  return callGemini(prompt);
}

// ------------------------------------------------------------
// 🔹 Analyze Student’s Spoken or Typed Answer
// ------------------------------------------------------------
export async function analyzeAnswerResponse(formData, question, transcript) {
  const prompt = `You are a UKVI Entry Clearance Officer providing feedback to a student applicant.

    University: ${formData.university}
    Course: ${formData.course}
    Question: "${question}"
    Student's Answer: "${transcript}"
    
    Provide feedback in HTML format:
    1. First line must be: <p><strong>Score:</strong> [number 1-10]</p>
    2. Then add detailed feedback with:
       - <div class="feedback-section feedback-positive"><h5>What You Did Well</h5><p>positive points</p></div>
       - <div class="feedback-section feedback-improvement"><h5>Areas for Improvement</h5><p>improvement points</p></div>
    
    Be constructive, specific, and helpful. Use <mark> to highlight key points.`;

  return callGemini(prompt);
}

// ------------------------------------------------------------
// 🔹 Translate Q&A Content (English → Hindi/Gujarati)
// ------------------------------------------------------------
export async function translateQuestionContent(questionSet, lang) {
  const langMap = { hi: "Hindi", gu: "Gujarati" };

  const prompt = `Translate to ${langMap[lang]}. Keep HTML tags. Separate with "|||": ${questionSet.question}|||${questionSet.guidance}|||${questionSet.modelAnswer}`;

  const result = await callGemini(prompt);
  if (!result) return null;

  const parts = result.split("|||");
  if (parts.length === 3) {
    return {
      question: parts[0].trim(),
      guidance: parts[1].trim(),
      modelAnswer: parts[2].trim(),
    };
  }

  return null;
}
