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
    if (!apiKey) {
      res.status(400).json({ error: 'API key is missing' });
      return;
    }

    const configuration = new Configuration({
      apiKey: apiKey,
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

    res.status(200).json({ completion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching GPT' });
  }
}
