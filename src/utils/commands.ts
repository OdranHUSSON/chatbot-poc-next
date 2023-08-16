import GitClient from "./gitClient";

export const commands = [
  {
    name: 'help',
    description: 'Lists all available commands',
  },
  {
    name: 'clearchat',
    description: 'Clears the chat history',
  },
  {
    name: 'chatgpt',
    description: 'Fetches a response from chat GPT',
  },
	{
    name: 'commit',
    description: 'Generates a commit message',
  },
  {
    name: 'linechart',
    description: 'Create a linechart from last messages data'
  }
];

let apiKey: string | null = getApiKeyFromLocalStorage();

export const setApiKey = (key: string) => {
  apiKey = key;
  saveApiKeyToLocalStorage(key);
};

function getApiKeyFromLocalStorage(): string | null {
  try {
    return localStorage.getItem('apiKey');
  } catch (error) {
    // Handle error or fallback behavior if localStorage is not available
    return null;
  }
}

function saveApiKeyToLocalStorage(key: string) {
  try {
    localStorage.setItem('apiKey', key);
  } catch (error) {
    // Handle error or fallback behavior if localStorage is not available
  }
}

export const handleCommands = (
	commandText: string,
	setLoading: (loading: boolean) => void,
	addBotMessageToChatHistory: (message: string) => void,
	clearChatHistory: () => void,
	updateMessageById: (id: string, message: string) => void,
  chatHistory: { id: number, message: string, role: 'user' | 'bot' }[] 
) => {
	const [commandName, ...args] = commandText.split(' ');

	if (apiKey === null) {
			addBotMessageToChatHistory('API key not found');
			setLoading(false);
			return;
	}

	switch (commandName) {
			case '/clearchat':
					clearChatHistory();
					break;
			case '/commit':
					handleCommitCommand(args, addBotMessageToChatHistory, updateMessageById, chatHistory);
					break;
			case '/chatgpt':
					chatGPT(args, addBotMessageToChatHistory, updateMessageById, chatHistory);
					break
      case '/linechart':
        linechart(args, addBotMessageToChatHistory, updateMessageById, chatHistory);
        break
			case '/help':
					addBotMessageToChatHistory(
							commands.map((command) => `${command.name}: ${command.description}`).join('\n')
					);
					break;
        break;
			default:
					addBotMessageToChatHistory('Unknown command');
	}

	setLoading(false);
};

async function processCommandWithLoading(
    args: string[],
    messageHandler: (message: string) => Promise<string>,
    updateMessageHandler: (id: string, message: string) => Promise<void>,
    processFunction: (args: string[]) => Promise<string>
) {
    const id = await messageHandler("<Loading>");

    try {
        const result = await processFunction(args);
        await updateMessageHandler(id, result);
    } catch (error) {
        console.error(error);
        await updateMessageHandler(id, 'Error processing command');
    }
}



export async function handleCommitCommand(
  args: string[],
  addBotMessageToChatHistory: (message: string) => Promise<string>,
  updateMessageById: (id: string, message: string) => Promise<void>,
  chatHistory: { id: number, message: string, role: 'user' | 'bot' }[] 
) {
  await processCommandWithLoading(
      args,
      addBotMessageToChatHistory,
      updateMessageById,
      async (args) => {
          const commitMessage = "Generate a short commit message with one emoji at the beginning for the following changes " + args.join(' ');
          return "# Commit Message \n \n Here's your commit command with the personalized commit message :\n \n \n```sh\n\ngit commit -m \"" + (await handleChatGPTCommand(commitMessage, apiKey, chatHistory)) + "\"\n\n```"; // Pass chatHistory here
      }
  );
}

export async function chatGPT(
    args: string[],
    addBotMessageToChatHistory: (message: string) => Promise<string>,
    updateMessageById: (id: string, message: string) => Promise<void>,
    chatHistory: { id: number, message: string, role: 'user' | 'bot' }[] 
) {
    await processCommandWithLoading(
        args,
        addBotMessageToChatHistory,
        updateMessageById,
        async (args) => {
            const message = args.join(' ');
            return await handleChatGPTCommand(message, apiKey, chatHistory);
        }
    );
}

export async function linechart(
  args: string[],
  addBotMessageToChatHistory: (message: string) => Promise<string>,
  updateMessageById: (id: string, message: string) => Promise<void>,
  chatHistory: { id: number, message: string, role: 'user' | 'bot' }[] 
) {
  await processCommandWithLoading(
      args,
      addBotMessageToChatHistory,
      updateMessageById,
      async (args) => {
        
          const commitMessage = "Generate a linechart dataset in json using this example format : " + `{"labels":["Monday","Tuesday","Wednesday","Thursday","Friday"],"datasets":[{"label":"Product A Sales","data":[50,75,60,80,95],"borderColor":"rgb(255, 99, 132)","backgroundColor":"rgba(255, 99, 132, 0.2)"},{"label":"Product B Sales","data":[55,70,65,85,90],"borderColor":"rgb(75, 192, 192)","backgroundColor":"rgba(75, 192, 192, 0.2)"}]}` + " (this is an example do no use the data ) , you can adapt the data as you want, output only the dataset nothing else";
          return "<LineChart dataset='" + (await handleChatGPTCommand(commitMessage, apiKey, chatHistory)) + "'>";
      }
  );
}


export async function handleChatGPTCommand(message: string, apiKey: string | null, chatHistory: { id: number, message: string, role: 'user' | 'bot' }[] = []) {
	try {
			const response = await fetch('/api/completionAPI', {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json',
					},
					// Include the message, apiKey, and chatHistory in the request body
					body: JSON.stringify({ prompt: message, apiKey, chatHistory }), 
			});

			if (!response.ok) {
					throw new Error('Failed to fetch chat GPT');
			}

			const data = await response.json();
			const completion = data.completion;
			return completion
	} catch (error) {
			console.error(error);
			return 'Error fetching from chat GPT'
	}
}
