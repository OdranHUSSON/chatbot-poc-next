import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (inputCode: string) => {
  const data = (inputCode: string) => {
    return endent`${inputCode}`;
  };

  if (inputCode) {
    return data(inputCode);
  }
};

const filterMessages = (historyMessages, tokenLimit) => {
  // Keep the first 2 messages
  let filteredMessages = historyMessages.slice(0, 2);

  // Reverse the rest of the messages to start checking from the latest
  let restOfMessages = historyMessages.slice(2).reverse();

  // Initialize a variable to keep track of the total tokens
  let totalTokens = 0;

  for (let message of restOfMessages) {
    let messageTokens = encode(message.content).length;
    if (totalTokens + messageTokens <= tokenLimit) {
      totalTokens += messageTokens;
      filteredMessages.unshift(message);
    } else {
      break;
    }
  }

  return filteredMessages;
};

export const OpenAIStream = async (
  inputCode: string,
  model: string,
  key: string | undefined,
  historyMessages: { role: 'system' | 'user', content: string }[] = [],
) => {
  const prompt = createPrompt(inputCode);

  // Append the latest message (prompt) to the existing history.
  historyMessages.push({ role: 'system', content: prompt });

  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key || process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      messages: historyMessages,
      temperature: 0,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    throw new Error(
      `OpenAI API returned an error: ${
        decoder.decode(result?.value) || statusText
      }`,
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};
