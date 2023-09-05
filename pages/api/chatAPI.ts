import { ChatBody } from '@/types/types';
import { OpenAIStream } from '@/utils/chatStream';
import { encode } from 'gpt-tokenizer';

const filterMessages = (historyMessages, tokenLimit) => {
  let filteredMessages = historyMessages.slice(0, 2);
  let restOfMessages = historyMessages.slice(2).reverse();
  let totalTokens = 0;
  let lastMessageId = null;

  console.log("tokenLimit", tokenLimit)

  for (let message of restOfMessages) {
      let messageTokens = encode(message.message).length;
      if (messageTokens > tokenLimit) {
          console.log("Message too long", message);
          continue;
      }
      if (totalTokens + messageTokens < tokenLimit - 1000) {
          totalTokens += messageTokens;
          filteredMessages.unshift(message);
      } else {
          lastMessageId = message.id;
          console.log("lastMessage", message);
          break;
      }
  }

  console.log("totalTokens", totalTokens);

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

    const template = `
    You are a helpful assistant that can request other assistant to do actions. In order to use this possibilities simply answer using this format :
    \`\`\`
    @agent { command: "command", ParameterName: "ParameterValue" }
    \`\`\`

    Please ensure you output valid JSON, output only the @agent sentence nothing else so the agent can parse it easily.

    Here's the list of available commands :
    { command : "listRepositories" } 
    { command : "selectRepository", "repositoryName" } 
    { command : "listChats" } 

    When no command match simply answer as a LLM.
    `;

    const templateToken = encode(template).length
    const inputCodeTokens = encode(inputCode).length*2;
    const modelLimit = (model == 'gpt-3.5-turbo' ? 4096 : 8192)-1000;
    const tokenLimit = modelLimit - templateToken - inputCodeTokens; 
    const { filteredMessages, lastMessageId } = filterMessages(chatHistory, tokenLimit);

    const mappedHistory = filteredMessages.map(item => ({
      role: item.role === 'bot' ? 'system' : "user",
      content: item.message
    }));

    mappedHistory.unshift({
      role: "system",
      content: template
    });

    const stream = await OpenAIStream(inputCode, model, apiKeyFinal, mappedHistory);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
