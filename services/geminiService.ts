import { GoogleGenAI } from "@google/genai";
import { GeneratedResult } from "../types";

const FLUTTER_SYSTEM_INSTRUCTION = `
Bạn là một chuyên gia lập trình Flutter Senior Developer và UI/UX Designer.
Nhiệm vụ của bạn: Khi người dùng mô tả một tính năng hoặc giao diện, hãy tạo ra mã nguồn Flutter (Dart) hoàn chỉnh, hiện đại và sạch sẽ.

Yêu cầu kỹ thuật:
1. Sử dụng Material 3 và tuân thủ các nguyên tắc thiết kế hiện đại (border radius lớn, padding hợp lý, màu sắc hài hòa).
2. Sử dụng các widget phổ biến như ListView, GridView, Stack, Container với BoxDecoration.
3. Code phải được tổ chức tốt: Chia nhỏ các thành phần thành các Widget riêng biệt nếu cần để dễ quản lý.
4. Luôn sử dụng dữ liệu giả (mock data) để giao diện trông đầy đủ (ví dụ: danh sách sản phẩm, ảnh từ Unsplash: 'https://picsum.photos/id/[id]/[width]/[height]').
5. Cung cấp cả phần ThemeData nếu người dùng yêu cầu tông màu cụ thể.

Định dạng phản hồi BẮT BUỘC:
1. Giải thích ngắn gọn về ý tưởng thiết kế (2-3 câu).
2. Dấu phân cách "---CODE_START---"
3. Toàn bộ code trong một khối duy nhất.
4. Dấu phân cách "---CODE_END---"
`;

export const generateFlutterCode = async (prompt: string): Promise<GeneratedResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: FLUTTER_SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for consistent code
      },
    });

    const text = response.text || '';
    
    // Parse the custom format
    const startMarker = "---CODE_START---";
    const endMarker = "---CODE_END---";
    
    const startIndex = text.indexOf(startMarker);
    const endIndex = text.indexOf(endMarker);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const explanation = text.substring(0, startIndex).trim();
      // Clean up markdown code blocks if the model adds them inside the markers
      let code = text.substring(startIndex + startMarker.length, endIndex).trim();
      code = code.replace(/^```dart/, '').replace(/^```/, '').replace(/```$/, '').trim();
      
      return { explanation, code };
    } else {
      // Fallback if formatting fails, assume typical markdown response
      return {
        explanation: "Generated Code:",
        code: text
      };
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate Flutter code. Please check your API key or try again.");
  }
};
