import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client: OpenAI;

  constructor() {
    // Groq use karna ho to baseURL change karo
    this.client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1', // OpenAI ke liye remove karo
    });
  }

  async evaluateSubmission(params: {
    title: string;
    instructions: string;
    totalMarks: number;
    markingMode: string;
    submissionText: string;
  }): Promise<{ studentName: string; rollNumber: string; score: number; remarks: string }> {
    const { title, instructions, totalMarks, markingMode, submissionText } = params;

    const prompt = `You are an academic evaluator. Evaluate the student submission below.

ASSIGNMENT TOPIC: ${title}
ASSIGNMENT INSTRUCTIONS:
${instructions}

TOTAL MARKS: ${totalMarks}
MARKING MODE: ${markingMode === 'strict' 
  ? 'STRICT — penalize off-topic, short, or poorly structured answers'
  : 'LOOSE — reward effort and partial understanding, be lenient on structure'}

IMPORTANT: If the student submission is NOT related to the assigned topic "${title}", assign a score of 0 and clearly state in remarks that the submission is off-topic and does not match the required assignment.

STUDENT SUBMISSION:
${submissionText.substring(0, 4000)}

Respond ONLY with a valid JSON object (no markdown, no backticks):
{
  "studentName": "extracted from submission or Unknown",
  "rollNumber": "extracted from submission or N/A",
  "score": <number between 0 and ${totalMarks}>,
  "remarks": "2-3 specific, constructive sentences about the submission"
}`;

    const response = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Groq model — OpenAI ke liye: gpt-4o-mini
      max_tokens: 500,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.choices[0].message.content || '{}';
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());

    return {
      studentName: parsed.studentName || 'Unknown',
      rollNumber: parsed.rollNumber || 'N/A',
      score: Math.min(Math.max(Math.round(parsed.score || 0), 0), totalMarks),
      remarks: parsed.remarks || 'Could not evaluate.',
    };
  }
}