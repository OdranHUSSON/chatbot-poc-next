/* eslint-disable import/no-anonymous-default-export */
// pages/api/git.ts
import path from 'path';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/io';
import simpleGit, { SimpleGit } from 'simple-git';
import fs from 'fs/promises';
import { createMessage } from '@/controller/message';
import { requestLLM } from './completionAPI';

interface GitCommandBody {
  command: string;
  message?: string;
  repo?: string;
  directory?: string;
  filename?: string;
  content?: string;
  branch?: string;
}

const createBotMessage = async(message: string, res: NextApiResponseServerIO) => {
  const socketIO = res.socket.server.io;
  let prompt = { type : 'bot', message: message }
  await createMessage(prompt, socketIO);
}

const suggestCommitByGitDiff = async(repo: string, res: NextApiResponseServerIO) => {
    await createBotMessage('[GIT] Generating git diff', res)
    const git: SimpleGit = simpleGit(repo);
    const diff = await git.diff();
    await createBotMessage('[GIT] Generating a commit message ...', res)
    const prompt = 'Generate an explicit commit message from the changes in this git diff, please use one emoji matching the type of changes at the beginning. Diff : ' + diff
    const commitMessage = await requestLLM(prompt, '', []);
    await createBotMessage('[GIT] Commit message : ' + commitMessage, res)

    if(commitMessage) {
        git
        .addConfig('user.email', 'ohusson55@gmail.com')
        .addConfig('user.name', 'Odran HUSSON')
        .exec(() => console.log('Git config set successfully!'));
        await git.add('.');
        const commit = await git.commit(commitMessage);
        await createBotMessage('[GIT] Successfully commited',res)
    } else {
        await createBotMessage('[GIT] No commit message found',res)
    }
}

export const writeFile = async (repoDir: string, directory: string, filename: string, content: string, res: NextApiResponseServerIO) => {
  if (!filename || !content) {
    res.status(400).json({ error: 'Filename and content are required' });
    return;
  }
  const filePath = path.join(repoDir, directory || '', filename);
  try {
    await createBotMessage('[GIT] Attempting to write file at path ```' + filePath + '```',res)
    await fs.writeFile(filePath, content);
    await createBotMessage('[GIT] Success, file updated at path  ```' + filePath + '```', res)
    await suggestCommitByGitDiff(repoDir, res)
    res.json({ success: true, message: 'File written successfully' });
  } catch (error) {
    await createBotMessage('[GIT] Failed to write file ```' + filePath + '\n``` \n Error : \n ```\n' + error.message + '\n```\n', res)
    res.status(500).json({ error: 'Failed to write file', details: error.message });
  }
};

export const readFile = async (repoDir: string, directory: string, filename: string, res: NextApiResponseServerIO) => {
  if (!filename) {
    res.status(400).json({ error: 'Filename is required' });
    return;
  }
  try {
    const fileContent = await fs.readFile(path.join(repoDir, directory || '', filename), 'utf-8');
    res.json({ success: true, content: fileContent });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file', details: error.message });
  }
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {  
  const { command, message, repo, directory, filename, content, branch } = req.body as GitCommandBody;
  const repoDir = path.join(process.env.GIT_REPO_DIR || '', repo || '');

  try {
    switch (command) {
      case 'writeFile':
        await writeFile(repoDir, directory, filename, content, res);
        break;

      case 'readFile':
        await readFile(repoDir, directory, filename, res);
        break;

      default:
        res.status(400).json({ error: 'Invalid command' });
    }
  } catch (error) {
    console.error('Error executing git command:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
