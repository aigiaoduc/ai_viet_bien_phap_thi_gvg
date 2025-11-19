import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const getApiKey = () => {
  const key = localStorage.getItem('user_api_key');
  if (!key) {
    // Instead of throwing immediately, we might want to handle this in the UI
    // But throwing here ensures requests fail explicitly if modal is bypassed
    throw new Error("MISSING_API_KEY");
  }
  return key;
};

// Helper to get AI instance
const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

/**
 * Generates content using the Gemini API.
 * @param prompt The user's prompt.
 * @param systemInstruction The system instruction to guide the model.
 * @returns The generated text.
 */
export const generateContent = async (prompt: string, systemInstruction: string): Promise<string> => {
  try {
    const ai = getAI();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.95,
      },
    });
    
    if (!response.text) throw new Error("Empty response from AI");
    return response.text;
  } catch (error) {
    if ((error as Error).message === "MISSING_API_KEY") {
        throw error; // Re-throw to be caught by UI
    }
    console.error("Gemini API call failed:", error);
    throw new Error("Lỗi kết nối AI. Vui lòng kiểm tra API Key hoặc thử lại sau.");
  }
};

/**
 * Generates content suggestions (bullet points) using the Gemini API.
 * @param prompt The user's prompt.
 * @param systemInstruction The system instruction to guide the model.
 * @returns A string containing bulleted suggestions.
 */
export const generateSuggestions = async (prompt: string, systemInstruction: string): Promise<string> => {
  try {
    const ai = getAI();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.6,
      },
    });
    if (!response.text) throw new Error("Empty response from AI");
    return response.text;
  } catch (error) {
     if ((error as Error).message === "MISSING_API_KEY") {
        throw error;
    }
    console.error("Gemini API call for suggestions failed:", error);
    throw new Error("Không thể tạo gợi ý. Vui lòng kiểm tra API Key.");
  }
};


/**
 * Generates chart data in JSON format using the Gemini API.
 * @param prompt The user's data input.
 * @returns A JSON string representing the chart data.
 */
export const generateChartData = async (prompt: string): Promise<string> => {
  try {
    const ai = getAI();
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Chuyển đổi dữ liệu sau thành một mảng JSON cho biểu đồ so sánh: "${prompt}". JSON phải có dạng [{"name": "Tên cột", "value": số}]. Chỉ trả về JSON, không thêm bất kỳ văn bản giải thích hay định dạng markdown nào.`,
        config: {
            systemInstruction: "Bạn là một công cụ chuyển đổi dữ liệu thô thành định dạng JSON hợp lệ.",
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: {
                            type: Type.STRING,
                            description: "Nhãn của cột dữ liệu (ví dụ: 'Trước khi áp dụng')."
                        },
                        value: {
                            type: Type.NUMBER,
                            description: "Giá trị số tương ứng."
                        }
                    },
                    required: ["name", "value"]
                }
            }
        },
    });
    if (!response.text) throw new Error("Empty response from AI");
    return response.text.trim();
  } catch (error) {
    if ((error as Error).message === "MISSING_API_KEY") {
        throw error;
    }
    console.error("Gemini API call for chart data failed:", error);
    throw new Error("Lỗi tạo dữ liệu biểu đồ.");
  }
};