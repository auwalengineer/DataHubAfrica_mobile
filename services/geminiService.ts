
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialAdvice = async (transactions: any[], balance: number) => {
  const prompt = `
    Context: A Nigerian user of a Fintech app called DataHub Africa.
    Current Wallet Balance: ₦${(balance / 100).toLocaleString()}
    Recent Transactions: ${JSON.stringify(transactions.slice(0, 5))}
    
    Task: Provide a very brief (2-sentence max) helpful financial tip or insight about their spending habits or how they can save on data/bills in Nigeria. Keep it friendly and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep track of your recurring bills to manage your budget better!";
  }
};

export const validateTransactionWithAI = async (amount: number, category: string, metadata: any) => {
  const prompt = `
    Evaluate this transaction for a Nigerian Fintech user:
    Amount: ₦${(amount / 100).toLocaleString()}
    Category: ${category}
    Details: ${JSON.stringify(metadata)}
    
    Is this a typical transaction? Respond with a brief encouraging message or a quick tip about this specific service (e.g., MTN data packs or Electricity tokens).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Processing your transaction securely...";
  }
};
