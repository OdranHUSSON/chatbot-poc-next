import { ChatBody } from '@/types/types';
import { OpenAIStream } from '@/utils/chatStream';

export const config = {
    runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
    try {
        const { inputCode, model, apiKey, chatHistory } = (await req.json()) as ChatBody & { chatHistory: { id: number, message: string, role: 'user' | 'bot' }[] };
        let apiKeyFinal;

        if (apiKey) {
            apiKeyFinal = apiKey;
        } else {
            apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        }

        if (!apiKey) {
            return new Response('API key not found', { status: 500 });
        }

		console.log("history", chatHistory)
        
        // Take the 20 latest messages from chatHistory
        const latestChatHistory = chatHistory.slice(-20);

        // Map the latestChatHistory to GPT format
        const mappedHistory = latestChatHistory.map(item => ({
            role: item.role === 'bot' ? 'system' : "user",
            content: item.message
        }));

        mappedHistory.unshift({
            role: "user",
            content: "You're my AI assistant, you can answer in markdown (please always output code between markdown tild) and can also display graphs if I request it (line chart with the following syntax : <Linechart dataset='JSON_ENCODED_DATASET_HERE'>, send components such as Linchart in ONE line and no other message. My front end will read your message and handle the display)"
        });

		console.log("mapped", mappedHistory)

        const stream = await OpenAIStream(inputCode, model, apiKeyFinal, mappedHistory);

        return new Response(stream);
    } catch (error) {
        console.error(error);
        return new Response('Error', { status: 500 });
    }
};

export default handler;
