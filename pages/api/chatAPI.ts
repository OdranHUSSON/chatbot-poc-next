import { ChatBody } from '@/types/types';
import { OpenAIStream } from '@/utils/chatStream';
import { encode } from 'gpt-tokenizer';

const filterMessages = (historyMessages, tokenLimit) => {
  let filteredMessages = historyMessages.slice(0, 2);
  let restOfMessages = historyMessages.slice(2).reverse();
  let totalTokens = 0;
  let lastMessageId = null;

  for (let message of restOfMessages) {
    let messageTokens = encode(message.message).length;
    if (totalTokens + messageTokens <= tokenLimit) {
      totalTokens += messageTokens;
      filteredMessages.unshift(message);
    } else {
      lastMessageId = message.id;
      console.log("lastMessage", message)
      break;
    }
  }
  console.log("totalTokens", totalTokens)

  return { filteredMessages, lastMessageId };
};

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

    const tokenLimit = 4096;
    const { filteredMessages, lastMessageId } = filterMessages(chatHistory, tokenLimit);

    const mappedHistory = filteredMessages.map(item => ({
      role: item.role === 'bot' ? 'system' : "user",
      content: item.message
    }));

    mappedHistory.unshift({
      role: "user",
      content: "You're my AI assistant, you can answer in markdown (always output code between markdown tild, no exception)"
    });

    const stream = await OpenAIStream(inputCode, model, apiKeyFinal, mappedHistory);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
