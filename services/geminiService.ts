import { GoogleGenAI } from "@google/genai";
import { TEACHING_TOPICS_GROUP_1, TEACHING_TOPICS_GROUP_2 } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const allTopics = [
  "Chuyên đề bồi dưỡng:",
  ...TEACHING_TOPICS_GROUP_1.map(t => `  ${t.id ? t.id + '.' : '-'} ${t.name}`),
  "",
  "Nội dung học phần:",
  ...TEACHING_TOPICS_GROUP_2.map(t => `  ${t.id}. ${t.name}`)
].join('\n');

const systemInstruction = `Bạn là "Trợ lý AI cho Giảng viên Cao đẳng, Đại học", một sản phẩm được phát triển bởi Trần Tuấn Thành (trantuanthanh.net).
Nhiệm vụ của bạn là cung cấp các câu trả lời sâu sắc, các ý tưởng sáng tạo và lời khuyên thiết thực liên quan đến công tác giảng dạy, phát triển chương trình, quản lý sinh viên và phát triển chuyên môn, được thiết kế riêng cho các giảng viên tại Việt Nam.
Bạn có thể nhận được văn bản, hình ảnh, hoặc các đường link (URL). Hãy phân tích tất cả các thông tin đầu vào để đưa ra câu trả lời phù hợp nhất.
Mọi câu trả lời của bạn phải bám sát bối cảnh giáo dục đại học của Việt Nam và dựa trên các chủ đề cốt lõi sau đây:
${allTopics}

Khi trả lời, bạn PHẢI tham khảo các nguồn uy tín, các văn bản pháp luật về giáo dục của Việt Nam mới nhất (ví dụ: Luật Giáo dục đại học).
QUAN TRỌNG: Cuối mỗi câu trả lời, bạn PHẢI trích dẫn các nguồn đã tham khảo dưới dạng một danh sách có tiêu đề "Nguồn tham khảo:". Mỗi nguồn PHẢI KÈM THEO MỘT HYPERLINK (URL) trực tiếp đến nguồn đó.
LUÔN NHẤN MẠNH: Trong các câu trả lời, hãy luôn thể hiện rõ vai trò của mình là "Trợ lý AI cho Giảng viên Cao đẳng, Đại học", một sản phẩm được phát triển bởi "Trần Tuấn Thành (trantuanthanh.net)".
Hãy luôn tỏ ra chuyên nghiệp, hữu ích và đưa ra các đề xuất có tính ứng dụng cao. Trả lời bằng tiếng Việt, sử dụng định dạng Markdown cho câu trả lời.`;


export interface FilePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export const generateResponse = async (prompt: string, file: FilePart | null, useForeignSources: boolean): Promise<string> => {
  try {
    let finalPrompt = prompt;
    if (useForeignSources) {
      finalPrompt += "\n\n(Lưu ý: Vui lòng bổ sung các nguồn tham khảo quốc tế uy tín và phù hợp trong câu trả lời.)";
    }

    const contents: any = file 
      ? { parts: [{ text: finalPrompt }, file] } 
      : finalPrompt;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 0.95,
        }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return "Rất tiếc, đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.";
  }
};

export const generateOutline = async (topic: string, requirements: string): Promise<string[]> => {
  try {
    const prompt = `Dựa trên chủ đề "${topic}" và các yêu cầu/đề bài sau đây: "${requirements}", hãy tạo một dàn bài chi tiết và logic cho một bài luận học thuật.
    Chỉ trả về dàn bài dưới dạng một danh sách các mục, mỗi mục trên một dòng. Không thêm lời dẫn, tiêu đề "Dàn bài", hay bất kỳ định dạng nào khác.
    Ví dụ:
    Mở bài
    Chương 1: Cơ sở lý luận
    1.1. Khái niệm
    1.2. Lịch sử
    Chương 2: Thực trạng
    2.1. Phân tích A
    2.2. Phân tích B
    Chương 3: Giải pháp
    Kết luận`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.5 }
    });

    return response.text.trim().split('\n').filter(line => line.trim() !== '');
  } catch (error) {
    console.error("Outline generation failed:", error);
    return ["Đã xảy ra lỗi khi tạo dàn bài. Vui lòng thử lại."];
  }
};


export async function* generateReport(topic: string, requirements: string, outline: string[], pages: number, useForeignSources: boolean): AsyncGenerator<string, void, unknown> {
  const model = 'gemini-2.5-flash';
  
  try {
    let fullReport = `# ${topic}\n\n## Mục lục\n`;
    outline.forEach(item => {
        fullReport += `- ${item.replace(/^[-*]\s*/, '')}\n`;
    });
    fullReport += '\n---\n';
    
    yield fullReport;

    // Step 1: Generate content for each outline item
    yield "Giai đoạn 1/2: Viết nội dung chi tiết cho từng phần...";
    for (let i = 0; i < outline.length; i++) {
        const section = outline[i];
        yield `Đang viết phần ${i + 1}/${outline.length}: "${section}"...`;

        const sourcesInstruction = useForeignSources 
            ? "Hãy trích dẫn cả nguồn trong nước và quốc tế uy tín." 
            : "Hãy trích dẫn các nguồn uy tín của Việt Nam.";

        const sectionPrompt = `Bạn đang viết một phần trong bài luận học thuật về chủ đề: "${topic}" với yêu cầu cụ thể như sau: "${requirements}".
        Hãy viết nội dung chi tiết, sâu sắc cho phần sau: "${section}".
        Nội dung cần mang tính học thuật, phân tích và có dẫn chứng rõ ràng, bám sát yêu cầu đã cho. ${sourcesInstruction}
        Đây là phần ${i+1} trong tổng số ${outline.length} phần của bài luận dài khoảng ${pages} trang.
        Trả lời bằng tiếng Việt, sử dụng định dạng Markdown. KHÔNG lặp lại tiêu đề của phần trong nội dung trả về.`;

        const sectionResponse = await ai.models.generateContent({ model, contents: sectionPrompt });
        const sectionContent = `\n## ${section}\n\n${sectionResponse.text.trim()}\n`;
        fullReport += sectionContent;
        yield fullReport;
    }

    // Step 2: Generate references
    yield "Giai đoạn 2/2: Tổng hợp và định dạng tài liệu tham khảo...";
    const referencePrompt = `Dựa trên toàn bộ nội dung của bài luận sau đây, hãy tạo một danh sách tài liệu tham khảo đầy đủ và chi tiết.
    Định dạng theo chuẩn APA. Mỗi nguồn PHẢI có một hyperlink (URL) để truy cập.
    ${useForeignSources ? "Danh sách cần bao gồm cả nguồn trong nước và quốc tế." : "Tập trung vào các nguồn của Việt Nam."}
    Nội dung bài luận:\n\n${fullReport}`;
    
    const referenceResponse = await ai.models.generateContent({ model, contents: referencePrompt });
    fullReport += `\n---\n\n## Nguồn tham khảo\n\n${referenceResponse.text.trim()}`;
    yield fullReport;

  } catch (error) {
    console.error("Report generation failed:", error);
    yield "Đã xảy ra lỗi trong quá trình tạo báo cáo. Vui lòng thử lại.";
  }
}