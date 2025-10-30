// App.jsx
import React, { useState, useEffect, useRef } from "react";


import {
  Shield,
  ChevronLeft,
  ChevronRight,
  Mic,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  generatePrepContent,
  analyzeAnswerResponse,
  translateQuestionContent,
} from "../api/gemini";

// Constants
const UNIVERSITIES = [
  "Anglia Ruskin University (ARU London)",
  "Aston University (Aston University London)",
  "Coventry University (Coventry University London / CU London)",
  "De Montfort University (DMU London)",
  "Glasgow Caledonian University (GCU London)",
  "Loughborough University (Loughborough University London)",
  "Northumbria University (Northumbria University London Campus)",
  "Nottingham Trent University (NTU London)",
  "Staffordshire University (Staffordshire University London)",
  "Teesside University (Teesside University London)",
  "Ulster University (Ulster University London)",
  "University of the West of Scotland (UWS London)",
  "University of Sunderland (University of Sunderland in London)",
  "University of Wales Trinity Saint David (UWTSD London)",
  "University of Portsmouth (University of Portsmouth London)",
  "York St John University (York St John London Campus)",
  "University of Cambridge",
  "University of Oxford",
  "Imperial College London",
  "University College London (UCL)",
  "King's College London",
  "University of Edinburgh",
  "University of Manchester",
  "University of Bristol",
  "University of Warwick",
  "University of Glasgow",
  "Durham University",
  "University of Sheffield",
  "University of Birmingham",
  "University of Leeds",
  "University of Southampton",
  "University of Nottingham",
  "University of York",
  "Lancaster University",
  "University of Bath",
  "University of Exeter",
  "Newcastle University",
  "Cardiff University",
  "Queen Mary University of London",
  "University of Aberdeen",
  "University of Liverpool",
  "University of Reading",
  "University of Sussex",
  "Royal Holloway, University of London",
  "SOAS University of London",
].sort();

const COURSE_LEVELS = [
  "Foundation",
  "International Year 1",
  "International Year 2",
  "Bachelors",
  "Bachelors with Placement Year",
  "Bachelors Top-Up",
  "Pre-Masters",
  "Masters",
  "Masters with Placement Year",
];

const API_KEY = import.meta.env.VITE_GEMINI_KEY;

// API Helper
// const makeApiCall = async (payload, signal = null) => {
//   if (!API_KEY || API_KEY === "PASTE_YOUR_GOOGLE_AI_API_KEY_HERE") {
//     throw new Error("API Key not configured");
//   }

//   const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

//   try {
//     // console.log("Making API call to:", API_URL);
//     console.log("Payload:", JSON.stringify(payload, null, 2));

//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//       ...(signal && { signal }),
//     });

//     console.log("Response status:", response.status);
//     console.log(
//       "Response headers:",
//       Object.fromEntries(response.headers.entries())
//     );

//     const responseText = await response.text();
//     // console.log("Response text:", responseText);

//     if (!response.ok) {
//       let errorData;
//       try {
//         errorData = JSON.parse(responseText);
//       } catch (e) {
//         errorData = { message: responseText };
//       }

//       const errorDetails = {
//         status: response.status,
//         statusText: response.statusText,
//         url: API_URL,
//         errorData: errorData,
//         timestamp: new Date().toISOString(),
//       };

//       console.error("API Error Details:", errorDetails);
//       throw new Error(JSON.stringify(errorDetails, null, 2));
//     }

//     const result = JSON.parse(responseText);
//     return result.candidates?.[0]?.content?.parts?.[0]?.text;
//   } catch (error) {
//     console.error("Fetch error:", error);

//     if (error.name === "AbortError") {
//       return null;
//     }

//     // Create detailed error info
//     const detailedError = {
//       name: error.name,
//       message: error.message,
//       stack: error.stack,
//       timestamp: new Date().toISOString(),
//       apiKey: API_KEY ? `${API_KEY.substring(0, 10)}...` : "Not set",
//     };

//     console.error("Detailed error:", detailedError);
//     throw new Error(JSON.stringify(detailedError, null, 2));
//   }
// };

// Main App Component
function PrepTool() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    university: "",
    courseLevel: "",
    course: "",
    prevQualification: "",
    fundingSource: "Family Savings",
    sponsorOccupation: "",
    careerGoals: "",
    studyGap: "",
  });

  const [prepContent, setPrepContent] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("guidance");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [translatedContent, setTranslatedContent] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    message: "",
    isConfirm: false,
    onConfirm: null,
  });
  const [errorLog, setErrorLog] = useState(null);

  const recognitionRef = useRef(null);

  // const finalTranscriptRef = useRef(""); // 🆕 stores complete speech text

  const timerRef = useRef(null);
  const translationControllerRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      console.log("🎙️ Speech recognition initialized", SpeechRecognition);

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscriptPart = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptPart += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        console.log(finalTranscriptPart);
        setTranscript((prev) => prev + finalTranscriptPart);
      };

      recognition.onnomatch = () => {
        console.warn("⚠️ No speech recognized — please speak clearly");
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= 120) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generatePrep = async () => {
    if (
      !formData.prevQualification ||
      !formData.sponsorOccupation ||
      !formData.careerGoals
    ) {
      showModal("Please fill out all required fields");
      return;
    }

    setIsGenerating(true);
    setErrorLog(null);

    try {
//       const prompt = `You are a UK university admissions tutor. Generate interview preparation materials as a JSON object with "keyTalkingPoints" (HTML string) and "questions" (array of 27 objects with question, guidance, modelAnswer).

// Student Profile:
// - University: "${formData.university}"
// - Course Level: "${formData.courseLevel}"
// - Course: "${formData.course}"
// - Previous Qualification: "${formData.prevQualification}"
// - Funding: "${formData.fundingSource}"
// - Sponsor: "${formData.sponsorOccupation}"
// - Career Goals: "${formData.careerGoals}"
// - Gaps: "${formData.studyGap || "None"}"

// Create personalized content covering: course choice, funding, UK choice, accommodation, career goals, ties to home, gaps explanation, cultural expectations, and more. Make model answers 150 words max, first-person, and specific to this student.

// IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks. Format:
// {
//   "keyTalkingPoints": "<div class='ai-content-card'><h2>Your Credibility Narrative</h2><ul><li>Point 1</li></ul></div>",
//   "questions": [
//     {"question": "...", "guidance": "...", "modelAnswer": "..."}
//   ]
// }`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      console.log("Starting API call...");
      // const result = await callGemini(payload);
      const result = await generatePrepContent(formData);

      console.log("API call completed, result:", result);

      if (result) {
        try {
          // Extract JSON from response
          let jsonString = result.trim();

          // Remove markdown code blocks if present
          jsonString = jsonString
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "");

          // Find JSON object
          const firstBrace = jsonString.indexOf("{");
          const lastBrace = jsonString.lastIndexOf("}");

          if (firstBrace !== -1 && lastBrace > firstBrace) {
            jsonString = jsonString.substring(firstBrace, lastBrace + 1);
          }

          const parsed = JSON.parse(jsonString);

          // Validate structure
          if (!parsed.keyTalkingPoints || !Array.isArray(parsed.questions)) {
            throw new Error("Invalid response structure");
          }

          setPrepContent(parsed);
          setCurrentQuestionIndex(0);
          setStep(3);
        } catch (e) {
          console.error(
            "Failed to parse AI response:",
            e,
            "Raw response:",
            result
          );
          const parseError = {
            error: "JSON Parse Error",
            message: e.message,
            rawResponse: result?.substring(0, 500),
          };
          setErrorLog(JSON.stringify(parseError, null, 2));
          showModal(
            "The AI returned content in an unexpected format. Check error log below."
          );
        }
      }
    } catch (error) {
      console.error("Generation error:", error);
      setErrorLog(error.message);
      showModal(`Error occurred. Check the error log displayed on screen.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) return;

    setIsRecording(true);
    setTranscript("");
    setElapsedSeconds(0);
    setFeedback(null);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;

    setIsRecording(false);
    setElapsedSeconds(0);
    recognitionRef.current.stop();
  };

  const analyzeAnswer = async () => {
    if (!transcript.trim()) {
      showModal("Please record an answer first");
      return;
    }

    setIsAnalyzing(true);

    try {
      const question = prepContent.questions[currentQuestionIndex].question;

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

      // const payload = {
      //   contents: [{ parts: [{ text: prompt }] }],
      // };

      const rawFeedback = await analyzeAnswerResponse(formData, question, transcript);


      if (rawFeedback) {
        const scoreMatch = rawFeedback.match(
          /<strong>Score:<\/strong>\s*(\d{1,2})/
        );
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

        const newEntry = {
          timestamp: new Date().toISOString(),
          question,
          transcript,
          feedback: rawFeedback,
          score,
          ...formData,
        };

        setHistory((prev) => [newEntry, ...prev]);
        setFeedback(newEntry);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      showModal(`Error analyzing answer: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const translateContent = async (lang) => {
    if (lang === "en") {
      setTranslatedContent(null);
      setCurrentLang("en");
      return;
    }
  
    const cacheKey = `${lang}-${currentQuestionIndex}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.log("✅ Loaded translation from cache:", cacheKey);
      setTranslatedContent(JSON.parse(cached));
      setCurrentLang(lang);
      return;
    }
  
    setIsTranslating(true);
    try {
      const q = prepContent.questions[currentQuestionIndex];
      const translated = await translateQuestionContent(q, lang);
  
      if (translated) {
        // 🧠 Save translation to localStorage for quick reload
        localStorage.setItem(cacheKey, JSON.stringify(translated));
  
        // 💬 Update UI state
        setTranslatedContent(translated);
        setCurrentLang(lang);
      }
    } catch (err) {
      console.error("💥 Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  };
  

  const showModal = (message, isConfirm = false, onConfirm = null) => {
    setModal({ show: true, message, isConfirm, onConfirm });
  };

  const hideModal = () => {
    setModal({ show: false, message: "", isConfirm: false, onConfirm: null });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const currentQ = prepContent?.questions[currentQuestionIndex];
  const displayContent = currentLang === "en" ? currentQ : translatedContent;

  return (
    <div className=" flex flex-col w-full min-h-screen  ">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-40 shadow-sm border-b border-slate-200">
        <nav className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-slate-800">
                UK Pre-CAS Prep by EEC
              </span>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full px-4 sm:px-8 py-12 flex justify-center ">
        {/* Step 1: Course Details */}
        {step === 1 && (
          <section className="w-full mb-16 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
              <span className="block text-primary mt-2">
                AI-Powered UK Pre-CAS Interview Prep
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Get hyper-personalized Pre-CAS interview preparation. Anytime,
              Anywhere.
            </p>

            <div className="mt-10 max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-left text-slate-800 mb-6">
                Step 1: Your Course Details
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                    Choose UK University
                  </label>
                  <select
                    value={formData.university}
                    onChange={(e) =>
                      handleInputChange("university", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="">-- Select a University --</option>
                    {UNIVERSITIES.map((uni) => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                    Choose Course Level
                  </label>
                  <select
                    value={formData.courseLevel}
                    onChange={(e) =>
                      handleInputChange("courseLevel", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="">-- Select a Course Level --</option>
                    {COURSE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                    Write Exact Course Name
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) =>
                      handleInputChange("course", e.target.value)
                    }
                    placeholder="e.g., MSc Data Science"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={() => {
                    if (
                      !formData.university ||
                      !formData.courseLevel ||
                      !formData.course
                    ) {
                      showModal("Please complete all fields");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.02]"
                >
                  Continue to Personalize
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <section className="w-full mb-16 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Complete Your Profile
            </h1>
            {/* Back Button */}
            <div className="flex justify-start max-w-xl mx-auto">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm font-semibold 
               text-white bg-indigo-600 hover:bg-indigo-700 
               px-4 py-2.5 rounded-lg shadow-md 
               transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            <div className="mt-5 max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-left text-slate-800 mb-6">
                Step 2: Your Personal Profile
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                    Previous Qualification & Grade
                  </label>
                  <input
                    type="text"
                    value={formData.prevQualification}
                    onChange={(e) =>
                      handleInputChange("prevQualification", e.target.value)
                    }
                    placeholder="e.g., Bachelor of Engineering, 3.8 GPA"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                    Primary Funding Source
                  </label>
                  <select
                    value={formData.fundingSource}
                    onChange={(e) =>
                      handleInputChange("fundingSource", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option>Family Savings</option>
                    <option>Education Loan</option>
                    <option>Scholarship</option>
                    <option>Sponsorship (Company)</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                    Sponsor's Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.sponsorOccupation}
                    onChange={(e) =>
                      handleInputChange("sponsorOccupation", e.target.value)
                    }
                    placeholder="e.g., Business Owner, Doctor, Engineer"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                    Future Career Goals
                  </label>
                  <textarea
                    value={formData.careerGoals}
                    onChange={(e) =>
                      handleInputChange("careerGoals", e.target.value)
                    }
                    rows="3"
                    placeholder="Briefly describe your career plans"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                    Gaps in Education/Work (if any)
                  </label>
                  <textarea
                    value={formData.studyGap}
                    onChange={(e) =>
                      handleInputChange("studyGap", e.target.value)
                    }
                    rows="2"
                    placeholder="Briefly explain any gaps. If none, leave blank."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={generatePrep}
                  disabled={isGenerating}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.02] disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {isGenerating
                    ? "Generating..."
                    : "Start Ultra-Personalized Prep"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Interview Practice - Continued in next section */}
        {step === 3 && prepContent && (
          <section className="mb-16">
            {/* Back Button */}
            <div className="flex justify-start max-w-xl mx-auto">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm font-semibold 
               text-white bg-indigo-600 hover:bg-indigo-700 
               px-4 py-2.5 rounded-lg shadow-md 
               transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Key Talking Points */}
              <div
                className="mb-12"
                dangerouslySetInnerHTML={{
                  __html: prepContent.keyTalkingPoints,
                }}
              />

              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    showModal(
                      "Start a new prep session? Current questions will be cleared.",
                      true,
                      () => {
                        setPrepContent(null);
                        setStep(1);
                        hideModal();
                      }
                    );
                  }}
                  className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  Start New Prep
                </button>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
                {/* Question Navigation */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-indigo-600">
                    Question {currentQuestionIndex + 1} of{" "}
                    {prepContent.questions.length}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex((prev) => prev - 1);
                        setActiveTab("guidance");
                        setCurrentLang("en");
                        setTranslatedContent(null);
                        setFeedback(null);
                      }}
                      disabled={currentQuestionIndex === 0}
                      className="p-2 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex((prev) => prev + 1);
                        setActiveTab("guidance");
                        setCurrentLang("en");
                        setTranslatedContent(null);
                        setFeedback(null);
                      }}
                      disabled={
                        currentQuestionIndex ===
                        prepContent.questions.length - 1
                      }
                      className="p-2 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
                  {displayContent?.question || currentQ?.question}
                </p>

                {/* Language Controls */}
                <div className="flex justify-end items-center gap-2 mb-4">
                  {isTranslating && (
                    <span className="text-sm text-slate-500">
                      Translating...
                    </span>
                  )}
                  <div className="flex gap-2">
                    {["en", "hi", "gu"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => translateContent(lang)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          currentLang === lang
                            ? "bg-indigo-50 text-indigo-600 border border-indigo-300 font-semibold"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {lang === "en"
                          ? "English"
                          : lang === "hi"
                          ? "हिन्दी"
                          : "ગુજરાતી"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 mb-6">
                  <nav className="-mb-px flex space-x-4">
                    <button
                      onClick={() => setActiveTab("guidance")}
                      className={`cursor-pointer px-6 py-3 border-b-3 transition-all ${
                        activeTab === "guidance"
                          ? "border-indigo-600 text-indigo-600 font-semibold"
                          : "border-transparent text-slate-600 hover:text-indigo-600"
                      }`}
                    >
                      Model Answer & Guidance
                    </button>
                    <button
                      onClick={() => setActiveTab("practice")}
                      className={`cursor-pointer px-6 py-3 border-b-3 transition-all ${
                        activeTab === "practice"
                          ? "border-indigo-600 text-indigo-600 font-semibold"
                          : "border-transparent text-slate-600 hover:text-indigo-600"
                      }`}
                    >
                      Practice Your Answer
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "guidance" && (
                  <div
                    className="prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: displayContent?.guidance
                        ? `<h4>Guidance</h4>${displayContent.guidance}<h4>Model Answer</h4>${displayContent.modelAnswer}`
                        : `<h4>Guidance</h4>${currentQ?.guidance}<h4>Model Answer</h4>${currentQ?.modelAnswer}`,
                    }}
                  />
                )}

                {activeTab === "practice" && (
                  <div>
                    {/* Recording Interface */}
                    {!isRecording && !transcript && (
                      <div className="text-center py-4">
                        <button
                          onClick={startRecording}
                          disabled={!recognitionRef.current}
                          className="relative bg-red-600 text-white font-semibold py-4 px-8 rounded-full hover:bg-red-700 transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto gap-3"
                        >
                          <Mic className="h-6 w-6" />
                          <span>Start Recording</span>
                        </button>
                      </div>
                    )}

                    {/* Live Recording */}
                    {isRecording && (
                      <div className="text-center py-4">
                        <button
                          onClick={stopRecording}
                          className="relative bg-red-600 text-white font-semibold py-4 px-8 rounded-full hover:bg-red-700 transition-all flex items-center justify-center mx-auto gap-3 animate-pulse"
                        >
                          <Mic className="h-6 w-6" />
                          <span>Stop Recording</span>
                        </button>
                        <p className="mt-4 text-4xl font-bold font-mono text-red-500">
                          {formatTime(elapsedSeconds)}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          {elapsedSeconds < 60
                            ? "Speak for 60-120 seconds"
                            : "Excellent! You can stop when ready."}
                        </p>
                        <div className="mt-4 w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-left">
                          {transcript || "Start speaking..."}
                        </div>
                      </div>
                    )}

                    {/* Edit Transcript */}
                    {!isRecording && transcript && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Review and edit your answer:
                        </label>
                        <textarea
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          rows="5"
                          className="w-full p-4 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          onClick={analyzeAnswer}
                          disabled={isAnalyzing}
                          className="mt-4 w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                          {isAnalyzing ? "Analyzing..." : "Analyze My Answer"}
                        </button>
                      </div>
                    )}

                    {/* Feedback */}
                    {feedback && (
                      <div className="mt-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-800">
                              Your Feedback
                            </h4>
                            <p className="text-sm text-slate-500">
                              {new Date(feedback.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center ml-4 flex-shrink-0">
                            <div
                              className={`w-24 h-24 rounded-full flex items-center justify-center ${
                                feedback.score >= 8
                                  ? "bg-green-100"
                                  : feedback.score >= 5
                                  ? "bg-yellow-100"
                                  : "bg-red-100"
                              }`}
                            >
                              <p
                                className={`text-4xl font-extrabold ${
                                  feedback.score >= 8
                                    ? "text-green-600"
                                    : feedback.score >= 5
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {feedback.score}
                                <span className="text-2xl font-semibold opacity-60">
                                  /10
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="mt-4 prose prose-slate max-w-none prose-sm"
                          dangerouslySetInnerHTML={{
                            __html: feedback.feedback,
                          }}
                        />
                        <h5 className="font-semibold mt-6 mb-2 text-slate-700 text-sm">
                          Your Answer Transcript:
                        </h5>
                        <p className="text-sm p-3 bg-white rounded-md border text-slate-600">
                          {feedback.transcript}
                        </p>
                        <button
                          onClick={() => {
                            setTranscript("");
                            setFeedback(null);
                          }}
                          className="mt-4 w-full bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700"
                        >
                          Record Another Answer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* History Section */}
              <div className="mt-12">
                <div className="flex justify-between items-center border-b-2 border-slate-200 pb-3 mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Practice History
                  </h2>
                  <button
                    onClick={() => {
                      showModal("Clear entire practice history?", true, () => {
                        setHistory([]);
                        hideModal();
                      });
                    }}
                    disabled={history.length === 0}
                    className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear History
                  </button>
                </div>

                {history.length === 0 ? (
                  <p className="text-center text-slate-500 py-8 bg-slate-50 rounded-lg">
                    You haven't practiced any questions yet. Your session
                    history will appear here.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {history.map((item, idx) => (
                      <details
                        key={idx}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200"
                      >
                        <summary className="flex justify-between items-center p-4 list-none cursor-pointer">
                          <div className="flex-grow pr-4">
                            <p className="font-semibold text-slate-700">
                              {item.question}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="ml-4 flex items-center space-x-4 flex-shrink-0">
                            <span
                              className={`text-sm font-bold px-3 py-1 rounded-full ${
                                item.score >= 8
                                  ? "bg-green-100 text-green-800"
                                  : item.score >= 5
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.score}/10
                            </span>
                          </div>
                        </summary>
                        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
                          <div
                            className="prose prose-sm prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: item.feedback }}
                          />
                          <h5 className="font-semibold mt-4 mb-1 text-xs text-slate-600 uppercase">
                            Your Answer:
                          </h5>
                          <p className="text-sm text-slate-600">
                            {item.transcript}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Error Log Display */}
      {errorLog && (
        <div className="fixed bottom-4 right-4 max-w-2xl max-h-96 overflow-auto bg-red-50 border-2 border-red-500 rounded-lg p-4 shadow-2xl z-50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-red-800 font-bold text-lg">Error Log</h3>
            <button
              onClick={() => setErrorLog(null)}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              ✕
            </button>
          </div>
          <pre className="text-xs text-red-900 whitespace-pre-wrap font-mono bg-white p-3 rounded border border-red-300 overflow-x-auto">
            {errorLog}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(errorLog);
              alert("Error log copied to clipboard!");
            }}
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Copy Error Log
          </button>
        </div>
      )}

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center transform transition-all">
            <p className="text-slate-700 text-lg mb-6">{modal.message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  if (modal.onConfirm) modal.onConfirm();
                  else hideModal();
                }}
                className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700"
              >
                {modal.isConfirm ? "Confirm" : "OK"}
              </button>
              {modal.isConfirm && (
                <button
                  onClick={hideModal}
                  className="bg-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-lg hover:bg-slate-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrepTool;
