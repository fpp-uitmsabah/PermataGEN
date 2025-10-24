import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BusinessCardData, GeneratedImage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const businessCardSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Full name of the person." },
    title: { type: Type.STRING, description: "Job title." },
    company: { type: Type.STRING, description: "Company, university, or institution name." },
    phone: { type: Type.STRING, description: "Phone number." },
    email: { type: Type.STRING, description: "Email address." },
    website: { type: Type.STRING, description: "Personal or company website URL." },
    slogan: { type: Type.STRING, description: "A catchy slogan or a brief professional summary." },
    socials: {
      type: Type.OBJECT,
      description: "Links to social media profiles.",
      properties: {
        linkedin: { type: Type.STRING, description: "URL to LinkedIn profile." },
        twitter: { type: Type.STRING, description: "URL to Twitter/X profile." },
        github: { type: Type.STRING, description: "URL to GitHub profile." },
      }
    }
  },
  required: ["name", "title", "company", "phone", "email", "website"],
};

export const fetchAndAnalyzeFacultyProfile = async (url: string): Promise<BusinessCardData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Visit the following URL and extract the faculty member's professional information. The company should be their university or institution. The slogan can be a brief summary of their research interests or professional bio. Also, find links to their professional social media profiles like LinkedIn, Twitter/X, and GitHub if available. Format the output as JSON according to the provided schema. URL: ${url}`,
      // FIX: `responseMimeType` and `responseSchema` are not allowed when using the `googleSearch` tool.
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const text = response.text.trim();
    const jsonStr = text.startsWith('```json') ? text.replace(/```json\n|```/g, '') : text;
    return JSON.parse(jsonStr) as BusinessCardData;
  } catch (error) {
    console.error("Error fetching and analyzing faculty profile:", error);
    throw new Error("Failed to fetch and analyze faculty profile from URL.");
  }
};


export const generateBusinessCardData = async (prompt: string): Promise<BusinessCardData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate business card details based on this prompt: ${prompt}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: businessCardSchema,
      },
    });

    // The API returns a string, which might be wrapped in markdown. Clean it before parsing.
    const text = response.text.trim();
    const jsonStr = text.startsWith('```json') ? text.replace(/```json\n|```/g, '') : text;
    return JSON.parse(jsonStr) as BusinessCardData;
  // FIX: Added missing opening brace for catch block.
  } catch (error) {
    console.error("Error generating business card data:", error);
    throw new Error("Failed to generate business card data.");
  }
};

export const generateImage = async (prompt: string): Promise<GeneratedImage> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Generate a simple, modern logo for a company. The logo should be based on this description: ${prompt}` }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return {
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        };
      }
    }
    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image.");
  }
};


export const editImage = async (prompt: string, image: { mimeType: string, data: string }): Promise<GeneratedImage> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: image.data,
              mimeType: image.mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return {
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        };
      }
    }
    throw new Error("No edited image data found in response.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image.");
  }
};
