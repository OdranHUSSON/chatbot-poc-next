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
        // Map the chatHistory to GPT format
        const mappedHistory = chatHistory.map(item => ({
            role: item.role === 'bot' ? 'system' : "user",
            content: item.message
        }));

		console.log("mapped", mappedHistory)

        const stream = await OpenAIStream(inputCode, model, apiKeyFinal, mappedHistory);

        return new Response(stream);
    } catch (error) {
        console.error(error);
        return new Response('Error', { status: 500 });
    }
};

export default handler;
