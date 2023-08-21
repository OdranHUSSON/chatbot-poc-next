import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Badge, Button } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';

const ChatsComponent = () => {
  const router = useRouter();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetch('/api/chats')
      .then((response) => response.json())
      .then((data) => setChats(data))
      .catch((error) => console.error('Error fetching chats:', error));
  }, []);

  const handleSelectChat = (chatId) => {
    router.push(`/chat/${chatId}`);
  };

  if (chats.length === 0) {
    return (
      <Box p={5} mb={8} shadow="md" borderWidth="1px" borderRadius="lg">
        <Text fontSize="xl" fontWeight="bold">
          No chats yet
        </Text>
      </Box>
    );
  }

  return (
    <div>
      {chats.map((chat) => (
        <Box key={chat.chatId} p={5} mb={8} shadow="md" borderWidth="1px" borderRadius="lg">
          <Flex w="100%" alignItems="center" justifyContent="left">
            <Text fontSize="xl" fontWeight="bold">
              {chat.chatId}
            </Text>
            {/* You can add more info like a badge here, similar to the branch in your example */}
          </Flex>
          <Box p={2}>
            {/* Add more info like README or chat description */}
          </Box>
          <Box mt={4} display="flex" justifyContent="space-between">
            {/* Add any actions like Delete or Select here */}
            <Button colorScheme="teal" variant="outline" onClick={() => handleSelectChat(chat.chatId)}>
              Select
            </Button>
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default ChatsComponent;
