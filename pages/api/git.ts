/* eslint-disable import/no-anonymous-default-export */
// pages/api/git.ts
import path from 'path';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/io';
import simpleGit, { SimpleGit } from 'simple-git';
import fs from 'fs/promises';

interface GitCommandBody {
  command: string;
  message?: string;
  repo?: string;
  directory?: string;
  filename?: string;
  content?: string;
}

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const { command, message, repo, directory } = req.body as GitCommandBody;
  const repoDir = path.join(process.env.GIT_REPO_DIR || '', repo || '');
  const git: SimpleGit = simpleGit(repoDir);

  try {
    switch (command) {
      case 'status':
        const status = await git.status();
        res.json({ success: true, status });
        break;

      case 'add':
        await git.add('.');
        res.json({ success: true, message: 'All files added' });
        break;

      case 'commit':
        const commit = await git.commit(message || 'Commit from simple-git');
        res.json({ success: true, commit });
        break;

      case 'clone':
        const cloneDir = process.env.GIT_REPO_DIR || 'workdir';
        await simpleGit(cloneDir).clone(repo || '');
        res.json({ success: true, message: 'Repository cloned' });
        break;

      case 'repos':
        try {
          const data = await fs.readdir(repoDir);
          const filteredData = data.filter(file => file !== '.gitkeep');
          res.json({ success: true, data: filteredData });
        } catch (error) {
          console.error('Error listing files:', error);
          res.status(500).json({ error: 'Failed to list files', details: error.message });
        }
        break;

      case 'list':
        const dirPath = path.join(repoDir, directory || '');
        try {
          const items = await fs.readdir(dirPath, { withFileTypes: true });
          const data = items.map(item => ({
            type: item.isDirectory() ? 'folder' : 'file',
            name: item.name
          }));
          res.json({ success: true, data });
        } catch (error) {
          console.error('Error listing files:', error);
          res.status(500).json({ error: 'Failed to list files', details: error.message });
        }
        break;

      case 'writeFile':
        const { filename: writeFileFilename, content } = req.body;
        if (!writeFileFilename || !content) {
          res.status(400).json({ error: 'Filename and content are required' });
          return;
        }
        const filePath = path.join(repoDir, directory || '', writeFileFilename);
        try {
          await fs.writeFile(filePath, content);
          res.json({ success: true, message: 'File written successfully' });
        } catch (error) {
          console.error('Error writing file:', error);
          res.status(500).json({ error: 'Failed to write file', details: error.message });
        }
        break;

      case 'readFile':
        const { filename: readFileFilename } = req.body;
        if (!readFileFilename) {
          res.status(400).json({ error: 'Filename is required' });
          return;
        }
        const fileContent = await fs.readFile(path.join(repoDir, directory || '', readFileFilename), 'utf-8');
        res.json({ success: true, content: fileContent });
        break;

      default:
        res.status(400).json({ error: 'Invalid command' });
    }
  } catch (error) {
    console.error('Error executing git command:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
