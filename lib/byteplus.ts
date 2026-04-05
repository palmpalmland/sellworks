import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.ARK_API_KEY,
  baseURL: process.env.ARK_BASE_URL,
});

export async function generateEcommerceCopy(params: {
  title: string;
  description: string;
  platform: string;
}) {
  const { title, description, platform } = params;

  const prompt = `
你是一个专业的电商内容助手。

请基于以下信息，为 ${platform} 生成商品文案：

产品名称：${title}
产品描述：${description}

请输出：
1. 商品标题
2. 3条卖点
3. 一段简短商品描述

要求：
- 表达自然
- 更像真实电商文案
- 不要太空
- 直接输出结果
`;

  const response = await client.responses.create({
    model: process.env.ARK_MODEL || "",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: prompt,
          },
        ],
      },
    ],
  });

  const text =
    response.output_text ||
    response.output
      ?.map((item: any) => {
        if (!item?.content) return "";
        return item.content.map((c: any) => c.text || "").join("");
      })
      .join("\n") ||
    "No result returned.";

  return text;
}