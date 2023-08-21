/* eslint-disable import/no-anonymous-default-export */
// pages/api/git.ts
import path from 'path';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/io';
import simpleGit, { SimpleGit } from 'simple-git';
import fs from 'fs/promises';
import { createMessage, updateMessage } from '@/controller/message';
import { requestLLM } from './completionAPI';

interface GitCommandBody {
  command: string;
  message?: string;
  repo?: string;
  directory?: string;
  filename?: string;
  content?: string;
  branch?: string;
  chatId?: string;
}

const createBotMessage = async(message: string, res: NextApiResponseServerIO, chatId: string) => {
  const socketIO = res.socket.server.io;
  let prompt = { type : 'bot', message: message }
  await createMessage(prompt, socketIO, chatId);
}

const suggestCommitByGitDiff = async(repo: string, res: NextApiResponseServerIO, chatId: string) => {
    await createBotMessage('[GIT] Generating git diff', res, chatId)
    const git: SimpleGit = simpleGit(repo);
    const diff = await git.diff();
    await createBotMessage('[GIT] Generating a commit message ...', res, chatId)
    console.log(diff)
    const prompt = 'Generate an explicit commit message from the changes in this git diff, please use one emoji matching the type of changes at the beginning. Diff : ' + diff
    const commitMessage = await requestLLM(prompt, '', []);
    await createBotMessage('[GIT] Commit message : ' + commitMessage, res, chatId)

    if(commitMessage) {
        git
        .addConfig('user.email', 'ohusson55@gmail.com')
        .addConfig('user.name', 'Odran HUSSON')
        .exec(() => console.log('Git config set successfully!'));
        await git.add('.');
        try {
          const commit = await git.commit(commitMessage as string, chatId);
        } catch (error) {
          await createBotMessage('[GIT] Failed to commit  \n Error : \n ```\n' + error.message + '\n```\n', res, chatId);
          await createBotMessage('[GIT] Commit manually with  : \n ```\n git commit -m "' + commitMessage + '" \n```\n', res, chatId);
        }
        await createBotMessage('[GIT] Successfully commited',res, chatId)
    } else {
        await createBotMessage('[GIT] No commit message found',res, chatId)
    }
}

export const writeFile = async (repoDir: string, directory: string, filename: string, content: string, res: NextApiResponseServerIO, chatId: string) => {
  if (!filename || !content) {
    res.status(400).json({ error: 'Filename and content are required' });
    return;
  }
  const filePath = path.join(repoDir, directory || '', filename);
  try {
    await createBotMessage('[GIT] Attempting to write file at path ```' + filePath + '```',res, chatId)
    await fs.writeFile(filePath, content);
    await createBotMessage('[GIT] Success, file updated at path  ```' + filePath + '```', res, chatId)
    await suggestCommitByGitDiff(repoDir, res, chatId)
    res.json({ success: true, message: 'File written successfully' });
  } catch (error) {
    await createBotMessage('[GIT] Failed to write file \n```\n' + filePath + '\n``` \n Error : \n ```\n' + error.message + '\n```\n', res, chatId)
    res.status(500).json({ error: 'Failed to write file', details: error.message });
  }
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {  
  const { command, message, repo, directory, filename, content, chatId } = req.body as GitCommandBody;
  const repoDir = path.join(process.env.GIT_REPO_DIR || '', repo || '');

  try {
    switch (command) {
      case 'writeFile':
        await writeFile(repoDir, directory, filename, content, res, chatId);
        break;

      default:
        res.status(400).json({ error: 'Invalid command' });
    }
  } catch (error) {
    console.error('Error executing git command:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
