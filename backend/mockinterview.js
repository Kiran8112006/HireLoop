import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const MODEL = 'gemini-2.5-flash';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Initialize API with error handling
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
  console.error('Failed to initialize GoogleGenerativeAI:', error.message);
  throw error;
}

/**
 * Retry helper function for API calls
 */
async function retryWithBackoff(fn, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === retries - 1;
      console.error(`Attempt ${attempt + 1}/${retries} failed: ${error.message}`);
      
      if (isLastAttempt) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt);
      console.log(`Retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Generate mock interview questions based on job role, experience level, and skills
 * @param {string} jobRole - Job title/role (e.g., "Frontend Developer")
 * @param {string} experienceLevel - Experience level (e.g., "Fresher", "2 years", "Senior")
 * @param {Array<string>} skills - Optional array of skills (e.g., ["React", "Node.js"])
 * @returns {Promise<Array>} Array of 5-7 interview questions
 */
async function generateMockQuestions(jobRole, experienceLevel, skills = []) {
  if (!jobRole || !experienceLevel) {
    throw new Error('jobRole and experienceLevel are required');
  }

  const skillsText = skills.length > 0 ? `Key skills: ${skills.join(', ')}.` : '';

  const prompt = `Generate exactly 5-7 interview questions for a "${jobRole}" position at ${experienceLevel} level.
${skillsText}

Create a mix of: Technical questions (2-3), Behavioral questions (1-2), and Problem-solving questions (1-2).

Return ONLY a valid JSON array of strings. Example:
["Question 1?", "Question 2?", "Question 3?"]

DO NOT include any other text or markdown. ONLY the JSON array.`;

  return retryWithBackoff(async () => {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
        topK: 40,
        topP: 0.95,
      },
    });

    if (!result || !result.response) {
      throw new Error('Invalid response from Gemini API');
    }

    const content = result.response.text().trim();
    console.log('Raw API response:', content.substring(0, 200));

    let questions = [];

    // Try JSON parsing first
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in response');
      }

      if (!Array.isArray(questions)) {
        throw new Error('Parsed response is not an array');
      }

      // Filter out empty questions
      questions = questions.filter(q => typeof q === 'string' && q.trim().length > 0);

      if (questions.length === 0) {
        throw new Error('No valid questions extracted');
      }

      return questions;
    } catch (parseError) {
      console.warn('JSON parsing failed, using fallback extraction:', parseError.message);
      
      // Fallback: extract questions from text
      questions = content
        .split('\n')
        .filter(line => line.trim().length > 0)
        .filter(line => !line.toLowerCase().includes('json') && !line.includes('[') && !line.includes(']'))
        .map(line => line.replace(/^\d+\.\s*/, '').replace(/^["']|["']$/g, '').trim())
        .filter(q => q.length > 10); // Filter out very short lines

      if (questions.length === 0) {
        throw new Error(`Failed to extract questions from response: ${content.substring(0, 100)}`);
      }

      return questions;
    }
  });
}

/**
 * Evaluate user's answer to an interview question
 * @param {string} question - The interview question
 * @param {string} userAnswer - User's answer to the question
 * @returns {Promise<Object>} Feedback object with score, strengths, improvements, and suggested answer
 */
async function evaluateAnswer(question, userAnswer) {
  if (!question || !userAnswer) {
    throw new Error('question and userAnswer are required');
  }

  const evaluationPrompt = `Evaluate this interview answer strictly. Identify if it's irrelevant to the question.

Question: "${question}"
Answer: "${userAnswer}"

Return ONLY a valid JSON object (no other text):
{
  "score": <0-10 number>,
  "isIrrelevant": <true if answer doesn't address the question, false otherwise>,
  "strengths": ["point1", "point2"],
  "improvements": ["point1", "point2"],
  "suggestedAnswer": "2-3 sentence model answer"
}

Scoring: 0-2 (poor/irrelevant), 3-4 (barely relevant), 5-6 (adequate), 7-8 (good), 9-10 (excellent).`;

  return retryWithBackoff(async () => {
    const model = genAI.getGenerativeModel({ model: MODEL });
    let feedback = null;

    // First evaluation pass
    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: evaluationPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 600,
        topK: 40,
        topP: 0.95,
      },
    });

    if (!result || !result.response) {
      throw new Error('Invalid response from Gemini API');
    }

    const content = result.response.text().trim();
    console.log('Raw evaluation response:', content.substring(0, 200));

    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }

      feedback = JSON.parse(jsonMatch[0]);

      // Validate and fix score
      const score = Number(feedback.score);
      if (isNaN(score) || score < 0 || score > 10) {
        feedback.score = 5;
      } else {
        feedback.score = Math.round(score);
      }

      // Check if answer is irrelevant
      const isIrrelevant = feedback.isIrrelevant === true || feedback.score < 3;

      // If irrelevant, generate a proper answer
      if (isIrrelevant) {
        console.log('Answer is irrelevant. Generating proper answer...');
        const properAnswerPrompt = `Generate a professional, concise interview answer to this question:

Question: "${question}"

Return ONLY a valid JSON object (no other text):
{
  "suggestedAnswer": "A 3-4 sentence professional answer that directly addresses the question"
}`;

        const answerResult = await model.generateContent({
          contents: [
            {
              parts: [{ text: properAnswerPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400,
            topK: 40,
            topP: 0.95,
          },
        });

        if (answerResult && answerResult.response) {
          const answerContent = answerResult.response.text().trim();
          const answerMatch = answerContent.match(/\{[\s\S]*\}/);
          if (answerMatch) {
            const answerObj = JSON.parse(answerMatch[0]);
            if (answerObj.suggestedAnswer) {
              feedback.suggestedAnswer = answerObj.suggestedAnswer.trim();
            }
          }
        }
      }

      // Validate arrays
      feedback.strengths = Array.isArray(feedback.strengths) 
        ? feedback.strengths.filter(s => typeof s === 'string' && s.length > 0)
        : isIrrelevant ? ['None - answer does not address the question'] : ['Response provided'];

      feedback.improvements = Array.isArray(feedback.improvements)
        ? feedback.improvements.filter(i => typeof i === 'string' && i.length > 0)
        : isIrrelevant 
          ? ['Answer the actual question asked', 'Provide relevant details and examples', 'Demonstrate understanding of the topic']
          : ['Add more specific details and examples'];

      // Ensure suggested answer exists
      feedback.suggestedAnswer = typeof feedback.suggestedAnswer === 'string'
        ? feedback.suggestedAnswer.trim()
        : 'A comprehensive answer would address the key points directly with specific examples.';

      return feedback;
    } catch (parseError) {
      console.warn('JSON parsing failed, returning fallback:', parseError.message);
      
      return {
        score: 3,
        strengths: ['Response was attempted'],
        improvements: ['Answer should directly address the question', 'Provide relevant examples', 'Demonstrate understanding of the topic'],
        suggestedAnswer: 'Please provide an answer that directly addresses the question with relevant details and examples.',
      };
    }
  });
}

// Export functions
export { generateMockQuestions, evaluateAnswer };
export default {
  generateMockQuestions,
  evaluateAnswer,
};
