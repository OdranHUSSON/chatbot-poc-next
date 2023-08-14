// Utility function to add a message to the database
export const createMessage = async (type: 'user' | 'bot', messageContent: string) => {
    const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message: messageContent })
    });

    const data = await response.json();
    return data;
};

export const createUserMessage = async (messageContent: string) => {
    return await createMessage('user', messageContent);
};

export const createBotMessage = async (messageContent: string) => {
    return await createMessage('bot', messageContent);
};


export const getAllMessages = async () => {
    try {
        const response = await fetch('/api/messages', {
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



export const updateMessage = async (id: string, updatedContent: string) => {
    const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, message: updatedContent })
    });

    const data = await response.json();
    return data;
};

export const deleteMessage = async (id: string) => {
    const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    return data;
};
