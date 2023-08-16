import axios from 'axios';

interface GitCommandBody {
  command: string;
  message?: string;
  repo?: string;
  directory?: string;
  filename?: string;
  content?: string;
}

export default class GitClient {
  private static instance: GitClient;
  private baseURL: string;

  private constructor() {
    this.baseURL = '/api/git';
  }

  public static getInstance(): GitClient {
    if (!GitClient.instance) {
      GitClient.instance = new GitClient();
    }
    return GitClient.instance;
  }

  private async makeRequest(body: GitCommandBody) {
    try {
      const response = await axios.post(this.baseURL, body);
      return response.data;
    } catch (error) {
      console.error('Error making request:', error);
      throw error;
    }
  }

  public status(repo?: string) {
    return this.makeRequest({ command: 'status', repo });
  }

  public add(repo?: string) {
    return this.makeRequest({ command: 'add', repo });
  }

  public commit(message: string, repo?: string) {
    return this.makeRequest({ command: 'commit', message, repo });
  }

  public clone(repo: string) {
    return this.makeRequest({ command: 'clone', repo });
  }

  public repos() {
    return this.makeRequest({ command: 'repos' });
  }

  public list(directory: string, repo?: string) {
    return this.makeRequest({ command: 'list', directory, repo });
  }

  public writeFile(filename: string, content: string, repo?: string) {
    return this.makeRequest({ command: 'writeFile', filename, content, repo });
  }
}
