
import { GoogleGenAI } from "@google/genai";
import { SearchFilters, ComparisonResult } from "../types.ts";

export const searchProducts = async (filters: SearchFilters): Promise<ComparisonResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Find and compare the top 3 best products in India for:
    - Product: ${filters.productName}
    ${filters.brand ? `- Preferred Brand: ${filters.brand}` : ''}
    - Budget: ${filters.budgetRange}
    - Required Delivery: ${filters.deliveryOption}
    - User Pincode: ${filters.pincode}
    
    CRITICAL REQUIREMENTS:
    1. Search Amazon.in, Flipkart.com, and Myntra.com for actual live listings.
    2. Rank them by value, reliability, and delivery speed to ${filters.pincode}.
    3. Start your response with a Markdown Table.
       Columns: Platform | Product Name | Current Price | User Rating | Delivery Speed | Verdict
    4. Follow with an "Analysis" section detailing why these are the best choices.
    5. Ensure prices are in INR (₹).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Lower temperature for more factual price/data consistency
      },
    });

    const text = response.text || "No intelligence data retrieved for this sector.";
    return {
      summary: text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Scout Error:", error);
    throw new Error("Target retrieval failed. Retailer nodes might be temporarily unreachable.");
  }
};
