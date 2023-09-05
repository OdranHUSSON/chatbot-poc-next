import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Badge, Avatar, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useClipboard } from '@/utils/copy';

const ChatsList = ({ selectedChat }) => {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hoverBgColor = useColorModeValue('gray.200', 'brand.700');
  const selectedChatColor = useColorModeValue('gray.200', 'brand.700');
  const { handleCopy } = useClipboard();

  useEffect(() => {
    fetch('/api/chats')
      .then((response) => response.json())
      .then((data) => {
        setChats(data);
        setIsLoading(false);
      })
      .catch((error) => console.error('Error fetching chats:', error));
  }, []);

  const handleSelectChat = (chatId) => {
    if (chatId !== selectedChat) {
      router.push(`/chat/${chatId}`);
    }
  };

  if (isLoading) {
    return <Skeleton height="20px" my="10px" />;
  }

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
    <Box height={"100%"} pt={"54px"}>
      {chats.map((chat) => (
        <Box
          key={chat.id}
          p={5}
          mb={8}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          backgroundColor={chat.id === selectedChat ? selectedChatColor : 'transparent'}
          _hover={{ backgroundColor: chat.id === selectedChat ? selectedChatColor : hoverBgColor }}
          transition="background-color 0.2s"
          onClick={() => handleSelectChat(chat.id)}
          cursor={chat.id === selectedChat ? 'default' : 'pointer'}
        >
          <Flex w="100%" alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Avatar name={chat.name || chat.id} />
              <Text fontSize="xl" fontWeight="bold" ml={4}>
                {chat.name || chat.id}
              </Text>
            </Flex>
            <Badge
              display={{ base: 'flex', lg: 'flex', xl: 'flex' }}
              colorScheme="brand"
              borderRadius="25px"
              color="brand.500"
              textTransform="none"
              letterSpacing="0px"
              px="8px"
              _hover={{ cursor: 'pointer' }}
              onClick={() => handleCopy(chat.id)}
            >
              {chat.id.slice(-4)}
            </Badge>
          </Flex>
          <Box p={2}>{chat.description}</Box>
        </Box>
      ))}
    </Box>
  );
};

export default ChatsList;
