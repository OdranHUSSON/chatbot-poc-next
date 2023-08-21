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
  branch?: string;
  chatId?: string;
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

export const getDiff = async (git: SimpleGit, res: NextApiResponseServerIO) => {
  try {
    const diff = await git.diff();
    res.json({ success: true, diff });
  } catch (error) {
    console.error('Error getting diff:', error);
    res.status(500).json({ error: 'Failed to get diff', details: error.message });
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
    .addConfig('user.name', 'Odran HUSSON');

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

  git
    .addConfig('user.email', 'ohusson55@gmail.com')
    .addConfig('user.name', 'Odran HUSSON')
    .addConfig('Username', 'OdranHUSSON');

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
    const reposWithReadme: any[] = [];

    for (const repo of filteredData) {
      const readmePath = path.join(repoDir, repo, 'README.md');
      let readmeContent = 'No README.md file';

      const git = simpleGit(path.join(repoDir, repo), {
        binary: 'git',
        maxConcurrentProcesses: 6,
        config: {
          'http.extraHeader': `Authorization: Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
        }
      });

      let activeBranch = "unknown";
      console.log("folder", repo)
      try {
        readmeContent = await fs.readFile(readmePath, 'utf-8');
        await git.branchLocal((err, branchSummary) => {
          if (err) {
            console.error(err);
            return;
          }
        
          activeBranch = branchSummary.current;
        });
      } catch (error) {
        console.warn(`No README.md file found in repository ${repo}`);
      }

      reposWithReadme.push({
        name: repo,
        description: readmeContent,
        branch: activeBranch
      });
    }

    res.json({ success: true, data: reposWithReadme });

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

export const listBranches = async (git: SimpleGit, res: NextApiResponseServerIO) => {
  try {
    const branches = await git.branch();
    res.json({ success: true, branches });
  } catch (error) {
    console.error('Error listing branches:', error);
    res.status(500).json({ error: 'Failed to list branches', details: error.message });
  }
};

export const checkoutBranch = async (git: SimpleGit, branch: string, res: NextApiResponseServerIO) => {
  try {
    await git.checkout(branch);
    res.json({ success: true, message: `Switched to branch ${branch}` });
  } catch (error) {
    console.error('Error checking out branch:', error);
    res.status(500).json({ error: 'Failed to checkout branch', details: error.message });
  }
};

export const pushChanges = async (git: SimpleGit, res: NextApiResponseServerIO) => {
  try {
    await git.push();
    res.json({ success: true, message: 'Changes pushed successfully' });
  } catch (error) {
    console.error('Error pushing changes:', error);
    res.status(500).json({ error: 'Failed to push changes', details: error.message });
  }
};

export const pullChanges = async (git: SimpleGit, res: NextApiResponseServerIO) => {
  try {
    await git.pull();
    res.json({ success: true, message: 'Changes pulled successfully' });
  } catch (error) {
    console.error('Error pulling changes:', error);
    res.status(500).json({ error: 'Failed to pull changes', details: error.message });
  }
};

export const stashChanges = async (git: SimpleGit, res: NextApiResponseServerIO) => {
  try {
    await git.stash();
    res.json({ success: true, message: 'Changes stashed successfully' });
  } catch (error) {
    console.error('Error stashing changes:', error);
    res.status(500).json({ error: 'Failed to stash changes', details: error.message });
  }
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const { command, message, repo, directory, filename, content, branch } = req.body as GitCommandBody;
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
        
      case 'diff':
        if (repo) {
          const git: SimpleGit = simpleGit(repoDir);
          await getDiff(git, res);
        }
        break;
      case 'listBranches':
        if (repo) {
          const git: SimpleGit = simpleGit(repoDir);
          await listBranches(git, res);
        }
        break;

      case 'checkout':
        if (repo) {
          const git: SimpleGit = simpleGit(repoDir);
          await checkoutBranch(git, branch, res);
        }
        break;

      case 'push':
        if (repo) {
          const git: SimpleGit = simpleGit(repoDir);
          await pushChanges(git, res);
        }
        break;

      case 'pull':
        if (repo) {
          const git: SimpleGit = simpleGit(repoDir);
          await pullChanges(git, res);
        }
        break;

      case 'stash':
        if (repo) {
          const git: SimpleGit = simpleGit(repoDir);
          await stashChanges(git, res);
        }
        break;

      default:
        res.status(400).json({ error: 'Invalid command' });
    }
  } catch (error) {
    console.error('Error executing git command:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
