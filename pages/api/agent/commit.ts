/* eslint-disable import/no-anonymous-default-export */
// pages/api/git.ts
import path from 'path';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/io';
import fs from 'fs/promises';
import { requestLLM } from '../completionAPI';
import { getOneMessage, getMessages, createMessage, updateMessage, deleteMessage } from '@/controller/message';
import { commitChanges, addFiles } from '../git';

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const { command, message, repo, directory } = req.body;
  const socketIO = res.socket.server.io;
  
  const chatHistory = await getMessages();
  let message = { type : 'bot', message: "Generating a commit message using our context" }
  await createMessage(message, socketIO);

  const commitMessage = await requestLLM("Using the previous chat context, Generate a nice commit message with one emoji at the beginning", '', chatHistory)
  
  message = { type : 'bot', message: "commitMessage"}
  await createMessage(message, socketIO);

  message = { type : 'bot', message: "Trying to execute git commit now wish me luck"}
  await createMessage(message, socketIO);

  commit
  
  
};
