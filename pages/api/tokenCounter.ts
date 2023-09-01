import {
    encode,
    encodeChat,
    decode,
    isWithinTokenLimit,
    encodeGenerator,
    decodeGenerator,
    decodeAsyncGenerator,
  } from 'gpt-tokenizer'
  
  const text = 'Hello, world!' // get this from api 
  const tokenLimit = 10 // constant
  
  const tokens = encode(text)
  
  const decodedText = decode(tokens)
  const withinTokenLimit = isWithinTokenLimit(text, tokenLimit)
  
  // Example chat:
  const chat = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'assistant', content: 'gpt-tokenizer is awesome.' },
  ]
  
  // Encode chat into tokens
  const chatTokens = encodeChat(chat)
  
  // Check if chat is within the token limit
  const chatWithinTokenLimit = isWithinTokenLimit(chat, tokenLimit)
  
  // Encode text using generator
  for (const tokenChunk of encodeGenerator(text)) {
    console.log(tokenChunk)
  }
  
  // Decode tokens using generator
  for (const textChunk of decodeGenerator(tokens)) {
    console.log(textChunk)
  }
  
  // Decode tokens using async generator
  // (assuming `asyncTokens` is an AsyncIterableIterator<number>)
  for await (const textChunk of decodeAsyncGenerator(asyncTokens)) {
    console.log(textChunk)
  }