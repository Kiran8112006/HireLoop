import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractText, getDocumentProxy } from "unpdf";
import express from "express";
import multer from "multer";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    const resumeBuffer = req.file.buffer;

    // 1. Extract Text from PDF
    const pdfProxy = await getDocumentProxy(new Uint8Array(resumeBuffer));
    const { text: resumeText } = await extractText(pdfProxy, { mergePages: true });

    // 2. Initialize Gemini Model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Craft the Prompt
    const prompt = `You are an expert HR recruiter with 15+ years of experience in technical and professional hiring. Your task is to thoroughly analyze this resume and provide an honest, accurate assessment.

=== JOB REQUIREMENTS ===
Position: ${jobTitle}
Description: ${jobDescription}

=== CANDIDATE RESUME ===
${resumeText}

=== ANALYSIS INSTRUCTIONS ===

Carefully read the entire resume and compare it against the job requirements. Be CRITICAL and REALISTIC in your assessment.

Scoring Guidelines (job_fit_score):
- 90-100: Perfect match - exceeds all requirements, strong relevant experience
- 80-89: Excellent match - meets all key requirements with proven experience
- 70-79: Good match - meets most requirements, some experience gaps
- 60-69: Moderate match - meets basic requirements, significant gaps exist
- 50-59: Weak match - meets few requirements, major experience gaps
- Below 50: Poor match - does not meet most requirements

For Skills: Extract ALL technical and professional skills mentioned. Include:
- Programming languages, frameworks, tools
- Software, platforms, methodologies
- Certifications, languages, domain expertise
- List at least 8-15 skills if available

For Experience: Calculate total years by:
1. Identifying all work positions with dates
2. Accounting for overlapping positions
3. Including relevant internships/projects
4. Be precise (e.g., 2.5 years, not 2 or 3)

For Strengths: Identify 3-5 specific strengths that align with the job:
- Relevant technical skills that match job requirements
- Demonstrated achievements with metrics
- Leadership, problem-solving, or domain expertise
- Education from reputable institutions
- Certifications or awards
BE SPECIFIC - mention actual technologies, achievements, or qualifications

For Weaknesses: Identify 2-4 realistic gaps or concerns:
- Missing required skills from job description
- Lack of experience in key areas
- Short tenure at companies (job hopping)
- Incomplete education or certifications
- Technology stack mismatches
BE HONEST - if there are red flags, mention them

For Summary: Write a concise 15-20 word professional summary highlighting the candidate's primary expertise and career level.

=== OUTPUT FORMAT ===
Return ONLY valid JSON (no markdown, no code blocks, no explanations):

{
  "name": "Full Name from Resume",
  "email": "email@example.com or Not found",
  "phone": "+1234567890 or Not found",
  "skills": ["skill1", "skill2", "skill3", "..."],
  "years_experience": 3.5,
  "job_fit_score": 75,
  "strengths": [
    "5+ years Python/Django experience matching backend requirements",
    "Led team of 8 developers, delivered projects 20% under budget",
    "Strong AWS/Docker skills aligned with DevOps needs"
  ],
  "weaknesses": [
    "No experience with React (required for frontend tasks)",
    "Limited exposure to microservices architecture",
    "Short 8-month tenure at last company raises retention concerns"
  ],
  "summary": "Senior Backend Developer with 5 years Python/AWS experience in fintech"
}

CRITICAL: Return ONLY the JSON object. No additional text before or after.`;

    // 4. Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Cleanup the response in case Gemini adds Markdown code blocks
    const cleanJson = text.replace(/```json|```/g, "").trim();

    res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("ATS Error:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});


export default router;
// ===== ATS FEATURE (NEW) =====

function extractKeywords(jd) {
  const stopwords = ["the","and","is","in","to","for","with","a","an"];

  return [...new Set(
    jd
      .toLowerCase()
      .replace(/\.js/g, "")
      .split(/\W+/)
      .filter(word => word.length > 2 && !stopwords.includes(word))
  )];
}

function calculateATSScore(jdKeywords, resumeText) {
  const resume = resumeText.toLowerCase();

  let matched = [];
  let missing = [];

  jdKeywords.forEach(keyword => {
    if (resume.includes(keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const score = Math.round((matched.length / jdKeywords.length) * 100);

  return { score, matched, missing };
}

// Export using ES6 syntax
export { extractKeywords, calculateATSScore };
