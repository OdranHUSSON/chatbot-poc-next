export const createMessage = async (type: 'user' | 'bot', chatId: string, messageContent: string) => {
    let content = messageContent ?? '<Loading>';
    const response = await fetch(`/api/messages?chatId=${chatId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message: messageContent, chatId })
    });

    const data = await response.json();
    return data;
};

export const createUserMessage = async (messageContent: string, chatId: string) => {
    return await createMessage('user', chatId, messageContent);
};

export const createBotMessage = async (messageContent: string, chatId: string) => {
    return await createMessage('bot', chatId, messageContent);
};

export const getAllMessages = async (chatId: string) => {
    try {
        const response = await fetch(`/api/messages?chatId=${chatId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            // Get more detailed error information from the response if available
            let errorMessage = 'Failed to fetch messages.';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (_) {
                // In case parsing the response body fails, use the default error message
            }

            // Throw error with refined message
            const error = new Error(errorMessage);
            error.status = response.status;  // Attach the status code to the error object for further handling
            throw error;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in getAllMessages:", error);
        throw error;  // re-throw the error so it can be handled by callers
    }
};



export const updateMessage = async (id: string, updatedContent: string, chatId: string) => {
    const response = await fetch(`/api/messages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, message: updatedContent, chatId })
    });

    const data = await response.json();
    return data;
};

export const deleteMessage = async (id: string, chatId: string) => {
    const response = await fetch(`/api/messages/${id}?chatId=${chatId}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    return data;
};

export const truncateMessages = async (chatId: string) => {
    try {
        const response = await fetch(`/api/messages?truncate=true&chatId=${chatId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            let errorMessage = 'Failed to truncate messages.';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (_) {
                // In case parsing the response body fails, use the default error message
            }

            const error = new Error(errorMessage);
            error.status = response.status; 
            throw error;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in truncateMessages:", error);
        throw error;
    }
};

export const getMessageById = async (id: string, chatId: string) => {
    try {
        const response = await fetch(`/api/messages?id=${id}&chatId=${chatId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            let errorMessage = 'Failed to fetch the message.';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (_) {
                // In case parsing the response body fails, use the default error message
            }

            const error = new Error(errorMessage);
            error.status = response.status; 
            throw error;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error in getMessageById:", error);
        throw error; 
    }
};
