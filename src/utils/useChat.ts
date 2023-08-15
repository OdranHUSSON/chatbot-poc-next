import { useState, useEffect } from 'react';
import { ChatBody, OpenAIModel } from '@/types/types';
import { handleCommands } from '@/utils/commands';
import { createUserMessage, createBotMessage, getAllMessages, updateMessage, getMessageById } from './messages';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@chakra-ui/react';

export const useChat = (apiKeyApp: string, socket: typeof SocketIOClient.Socket | null) => {
    const [chatHistory, setChatHistory] = useState<Array<{ id: string; type: 'user' | 'bot'; message: string }>>([]);
    const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const [outputCode, setOutputCode] = useState<string>('');
    const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();

    const fetchChatHistory = async () => {
        try {
            const messages = await getAllMessages();
            if (Array.isArray(messages)) {
                setChatHistory(messages);
            } else {
                setChatHistory([]);
            }
        } catch (error) {
            console.error("Failed to fetch chat history from API:", error);
            setChatHistory([]); 
            toast({
                title: "Failed to fetch chat history 😔",
                description: error.message,
                status: "error",
                duration: 10000,
                isClosable: false,
                
            });
        }
    };

    const clearChatHistory = async () => {
        try {
            const response = await fetch('/api/messages?truncate=true', {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                throw new Error('Failed to truncate chat history.');
            }            
        } catch (error) {
            console.error("Error clearing chat history:", error);
            // Here, you can handle any additional error logging or UI feedback.
        }
    };

    const getMessageFromDatabaseAddToState = async (id) => {
        console.log("WS:createMessage:", id);
        let message = await getMessageById(id);
        console.log("message", message)
        setChatHistory(prev => [...prev, message]);
    };

    const getMessageFromDatabaseUpdateState = async (id) => {
        console.log("WS:updateMessage:", id);
        let message = await getMessageById(id);
        stateUpdateMessageById(message.id, message.message)
    };

    useEffect(() => {
        if (socket) {    
            
            socket.on("connect", () => {
                fetchChatHistory()
            });
            // update chat on new message dispatched
            socket.on("messageCreated", (id) => {
                getMessageFromDatabaseAddToState(id).catch(err => console.error(err));
            });
    
            socket.on("messageUpdated", (id) => {
                getMessageFromDatabaseUpdateState(id).catch(err => console.error(err));
            });

            socket.on("messagesTruncated", (message: string) => {
                console.log("WS:truncateMessages:", message);
                setChatHistory([]);
                toast({
                    title: "🕵️ Chat erased",
                    description: `Chat erased  by web event`,
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            });
                
        }
    
        return () => {
            if (socket) {
                socket.off("messagesTruncated");
                socket.off("messageCreated");
                socket.off("connect");
            }
        }
    }, [socket]);
    
    

    const updateMessageById = async (id: string, updatedMessage: string) => {
        await stateUpdateMessageById(id, updatedMessage); // Await this function
        await updateMessage(id, updatedMessage); // Await this function
    };
      
      const stateUpdateMessageById = (id: string, updatedMessage: string) => {
        setChatHistory(prev =>
          prev.map(message => (message.id === id ? { ...message, message: updatedMessage } : message))
        );
      };
      
    

    const addUserMessageToChatHistory = async (message: string) => {
        try {
            const savedMessage = await createUserMessage(message);
            return savedMessage.id;
        } catch (error) {
            console.error("Error adding user message:", error);
        }
    };
    
    const addBotMessageToChatHistory = async (message: string) => {
        try {
            const savedMessage = await createBotMessage(message);
            return savedMessage.id;
        } catch (error) {
            console.error("Error adding bot message:", error);
        }
    };
    

    const handleChat = async () => {
        setInputOnSubmit(inputCode);
        const apiKey = apiKeyApp;
        setInputOnSubmit(inputCode);

        const maxCodeLength = model === 'gpt-3.5-turbo' ? 60000 : 60000;

        if (!apiKeyApp?.includes('sk-') && !apiKey?.includes('sk-')) {
                alert('Please enter an API key.');
                return;
        }

        if (!inputCode) {
                alert('Please enter your message.');
                return;
        }

        if (inputCode.length > maxCodeLength) {
                alert(
                        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
                );
                return;
        }


        setLoading(true);
        await addUserMessageToChatHistory(inputCode); 

        if (inputCode.startsWith('/')) {
            handleCommands(inputCode, setLoading, addBotMessageToChatHistory, clearChatHistory, updateMessageById, chatHistory);
            setInputCode('');
            return; 
        }

        const controller = new AbortController();
        const body: ChatBody & { chatHistory: typeof chatHistory } = {
            inputCode,
            model,
            apiKey,
            chatHistory,
        };
        
        const response = await fetch('/api/chatAPI', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
                setLoading(false);
                alert(
                        'Something went wrong went fetching from the API. Make sure to use a valid API key.',
                );
                return;
        }

        const data = response.body;

        if (!data) {
                setLoading(false);
                alert('Something went wrong');
                return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();

        let fullResponse = "";

        const id = await addBotMessageToChatHistory('<Loading>')
    
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
    
            const chunkValue = await decoder.decode(value);
            fullResponse += chunkValue;
            stateUpdateMessageById(id, fullResponse);
        }
        await updateMessageById(id, fullResponse)

        setLoading(false);
        setInputCode('');
    };

    return {
        chatHistory, 
        setChatHistory,
        inputOnSubmit, 
        setInputOnSubmit, 
        inputCode, 
        setInputCode, 
        outputCode, 
        setOutputCode, 
        model, 
        setModel, 
        loading, 
        setLoading, 
        clearChatHistory, 
        handleChat,
        addUserMessageToChatHistory,
        addBotMessageToChatHistory,
    };
}
