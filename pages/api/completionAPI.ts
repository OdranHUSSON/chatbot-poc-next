import { NextApiRequest, NextApiResponse } from 'next';
import { ChatBody } from '@/types/types';
import { Configuration, OpenAIApi } from 'openai';

type CreateChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt, apiKey, chatHistory } = req.body as ChatBody & { chatHistory: { id: number, message: string, role: 'user' | 'bot' }[] };
  try {
    const completion = await requestLLM(prompt, apiKey, chatHistory);
    res.status(200).json({ completion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching GPT' });
  }
}

export async function requestLLM(prompt, apiKey, chatHistory) {
  let apiKeyFinal;

  if (apiKey) {
      apiKeyFinal = apiKey;
  } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  }

  if (!apiKeyFinal) {
      return new Response('API key not found', { status: 500 });
  }

  const configuration = new Configuration({
    apiKey: apiKeyFinal,
  });

  const mappedHistory = chatHistory.map(item => ({
    role: item.role === 'bot' ? 'system' : "user",
    content: item.message
  }));
  mappedHistory.push({ role: 'system', content: prompt });

  const openai = new OpenAIApi(configuration);

  const chatCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: mappedHistory,
  });

  // Make sure to await the completion before accessing its content
  const completionResponse: CreateChatCompletionResponse = chatCompletion.data;

  const completion = completionResponse.choices[0].message.content;

  return completion
}