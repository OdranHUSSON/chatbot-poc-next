/* eslint-disable import/no-anonymous-default-export */
// pages/api/git.ts
import path from 'path';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/io';
import simpleGit, { SimpleGit } from 'simple-git';
import fs from 'fs/promises';
import { requestLLM } from '../completionAPI';
import { getOneMessage, getMessages, createMessage, updateMessage, deleteMessage } from '@/controller/message';

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const { command, message, repo, directory } = req.body;
  
  const chatHistory = await getMessages();

  
};
