
import { GoogleGenAI } from "@google/genai";
import { Employee } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getChatResponse(message: string, employees: Employee[]) {
    const totalExpenditure = employees.reduce((sum, emp) => sum + emp.monthlyIncome, 0);
    const systemInstruction = `
      You are an expert AI assistant for "Salario", a payroll management system.
      Current context:
      - There are ${employees.length} employees.
      - Total monthly expenditure is ₹${totalExpenditure.toLocaleString()}.
      - Company budget is ₹1,00,000 per month.
      
      User features available:
      1. Dashboard: Financial analytics and charts.
      2. Employees: Add, edit, or remove staff.
      3. Payroll: Generate and download PDF payslips.
      
      Help users navigate these features and answer questions about their payroll data.
      Keep answers professional, concise, and helpful. All currency values are in Indian Rupees (₹).
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message,
        config: {
          systemInstruction,
        },
      });

      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();
