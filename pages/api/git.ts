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

export const getStatus = async (git: SimpleGit, res: NextApiResponseServerIO) => {
  try {
    const status = await git.status();
    res.json({ success: true, status });
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({ error: 'Failed to get status', details: error.message });
  }
};

export const addFiles = async (git: SimpleGit, res: NextApiResponseServerIO) => {
  try {
    await git.add('.');
    res.json({ success: true, message: 'All files added' });
  } catch (error) {
    console.error('Error adding files:', error);
    res.status(500).json({ error: 'Failed to add files', details: error.message });
  }
};

export const commitChanges = async (git: SimpleGit, message: string, res: NextApiResponseServerIO) => {
  try {
    git
    .addConfig('user.email', 'ohusson55@gmail.com')
    .addConfig('user.name', 'Odran HUSSON')
    .exec(() => console.log('Git config set successfully!'));
    const commit = await git.commit(message || 'Commit from simple-git');
    res.json({ success: true, commit });
  } catch (error) {
    console.error('Error committing changes:', error);
    res.status(500).json({ error: 'Failed to commit changes', details: error.message });
  }
};

export const cloneRepository = async (repo: string, res: NextApiResponseServerIO) => {
  const cloneDir = process.env.GIT_REPO_DIR;
  const git = simpleGit(cloneDir, {
    binary: 'git',
    maxConcurrentProcesses: 6,
    config: {
      'http.extraHeader': `Authorization: Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
    }
  });

  try {
    await git.clone(repo || '');
    res.json({ success: true, message: 'Repository cloned' });
  } catch (error) {
    console.error('Error cloning repository:', error);
    res.status(500).json({ error: 'Failed to clone repository', details: error.message });
  }
};

export const listRepositories = async (repoDir: string, res: NextApiResponseServerIO) => {
  try {
    const data = await fs.readdir(repoDir);
    const filteredData = data.filter(file => file !== '.gitkeep');
    res.json({ success: true, data: filteredData });
  } catch (error) {
    console.error('Error listing repositories:', error);
    res.status(500).json({ error: 'Failed to list repositories', details: error.message });
  }
};

export const listFiles = async (repoDir: string, directory: string, res: NextApiResponseServerIO) => {
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
};

export const writeFile = async (repoDir: string, directory: string, filename: string, content: string, res: NextApiResponseServerIO) => {
  if (!filename || !content) {
    res.status(400).json({ error: 'Filename and content are required' });
    return;
  }
  const filePath = path.join(repoDir, directory || '', filename);
  try {
    await fs.writeFile(filePath, content);
    res.json({ success: true, message: 'File written successfully' });
  } catch (error) {
    console.error('Error writing file:', error);
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
  const { command } = req.body as GitCommandBody;
  const { message, repo, directory, filename, content } = req.body as GitCommandBody;
  const repoDir = path.join(process.env.GIT_REPO_DIR || '', repo || '');


  try {
    switch (command) {
      case 'status':
        if (repo) {
          const git: SimpleGit = simpleGit(repoDir);
          await getStatus(git, res);
        }
        break;

      case 'add':
        if (repo) {
          const git: SimpleGit = simpleGit(repoDir);          
          await addFiles(git, res);
        }
        break;

      case 'commit':
        if (repo) {
          const git: SimpleGit = simpleGit(repoDir);
          await commitChanges(git, message || 'Commit from simple-git', res);
        }
        break;

      case 'clone':
        await cloneRepository(repo, res);
        break;

      case 'repos':
        await listRepositories(repoDir, res);
        break;

      case 'list':
        await listFiles(repoDir, directory, res);
        break;

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
