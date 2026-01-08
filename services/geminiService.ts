
import { GoogleGenAI } from "@google/genai";
import { SearchFilters, ComparisonResult } from "../types";

export const searchProducts = async (filters: SearchFilters): Promise<ComparisonResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Find the top 3 best products based on the following criteria for a user in India:
    - Product: ${filters.productName}
    ${filters.brand ? `- Brand: ${filters.brand}` : ''}
    - Budget Range: ${filters.budgetRange}
    - Delivery Preference: ${filters.deliveryOption}
    - User Pincode: ${filters.pincode}
    
    You MUST search for actual live listings across Amazon.in, Flipkart.com, and Myntra.com.
    
    Focus on:
    1. Lowest price within the budget.
    2. Highest number of positive reviews.
    3. Availability of the requested delivery speed (${filters.deliveryOption}) for the given pincode (${filters.pincode}).
    
    CRITICAL: Your response must start with a Markdown Table comparing the 3 products. 
    Columns: Platform, Product Name, Price, Rating, Delivery Time, Key Pros/Cons.
    Follow the table with a brief "Analysis" section explaining why these options were chosen.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      summary: response.text || "No results found.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Search failed:", error);
    throw new Error("Failed to fetch product data. Please try again later.");
  }
};
