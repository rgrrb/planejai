// src/services/aiService.ts
import type { SimulationRecord } from '@/data/simulation'

interface GeminiResponse {
  candidates: { content: { parts: { text: string }[] } }[]
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: { content: string }
  suggestions: { items: string[] }
  extraIncome: { items: string[] }
  investment: { items: string[] }
  motivation: { content: string }
}

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-3.6-flash'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

const callGeminiAPI = async (prompt: string) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI(prompt)
  const json = response.candidates[0].content.parts[0].text
  return JSON.parse(json) as InsightData
}

export const sendChatMessage = async (
  simulation: SimulationRecord,
  history: ChatMessage[],
  newMessage: string,
) => {
  const contextPrompt = `
You are a friendly personal finance educator chatting with a user about their financial goal.

Context of the user's simulation:
- Goal: ${simulation.goalName} (${simulation.goalAmount} in ${simulation.goalDeadline} months)
- Income: ${simulation.income}
- Fixed Expenses: ${simulation.expenses}
- Debts: ${simulation.debts}

AI Diagnosis generated previously:
- Status: ${simulation.insight?.feasibility.status}
- Diagnosis: ${simulation.insight?.diagnosis.content}
- Suggestions: ${simulation.insight?.suggestions.items.join('; ')}

Chat History:
${history.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n')}

User Question: ${newMessage}

Respond concisely, clearly, and encouragingly in Portuguese (pt-BR). Limit response to 2-3 short paragraphs maximum.
  `

  const response = await callGeminiAPI(contextPrompt)
  return response.candidates[0].content.parts[0].text
}
