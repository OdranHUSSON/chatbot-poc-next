import axios from 'axios';

interface GitCommandBody {
  command: string;
  message?: string;
  repo?: string;
  directory?: string;
  filename?: string;
  content?: string;
  chatId?: string; // Added chatId property
}

export default class GitClient {
  private static instance: GitClient;
  private baseURL: string;
  private baseAIUrl: string;

  private constructor() {
    this.baseURL = '/api/git';
    this.baseAIUrl = '/api/gitAI';
  }

  public static getInstance(): GitClient {
    if (!GitClient.instance) {
      GitClient.instance = new GitClient();
    }
    return GitClient.instance;
  }

  private async makeRequest(body: GitCommandBody, useAI: boolean) {
    try {
      if (useAI) {
        console.log("USING AI for git request");
        const response = await axios.post(this.baseAIUrl, body);
        return response.data;
      }

      const response = await axios.post(this.baseURL, body);
      return response.data;
    } catch (error) {
      console.error('Error making request:', error);
      throw error;
    }
  }

  public status(repo?: string, chatId?: string) {
    return this.makeRequest({ command: 'status', repo, chatId }, false);
  }

  public add(repo?: string, chatId?: string) {
    return this.makeRequest({ command: 'add', repo, chatId }, false);
  }

  public commit(message: string, repo?: string, chatId?: string) {
    return this.makeRequest({ command: 'commit', message, repo, chatId }, false);
  }

  public clone(repo: string, chatId?: string) {
    return this.makeRequest({ command: 'clone', repo, chatId }, false);
  }

  public repos(chatId?: string) {
    return this.makeRequest({ command: 'repos', chatId }, false);
  }

  public list(directory: string, repo?: string, chatId?: string) {
    return this.makeRequest({ command: 'list', directory, repo, chatId }, false);
  }

  public writeFile(filename: string, content: string, repo?: string, chatId?: string) {
    return this.makeRequest({ command: 'writeFile', filename, content, repo, chatId }, true);
  }

  public readFile(filename: string, repo?: string, chatId?: string) {
    return this.makeRequest({ command: 'readFile', filename, repo, chatId }, false);
  }
}
