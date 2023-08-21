import React, { useState } from 'react';
import { Button, Input, VStack, useColorModeValue } from '@chakra-ui/react';
import GitClient from '@/utils/gitClient';
import { createBotMessage } from '@/utils/messages';

const GitClone = ({chatId}) => {
  const [repo, setRepo] = useState('');
  const gitClient = GitClient.getInstance();
  const buttonColor = useColorModeValue('brand.500', 'white');

  const handleClone = async () => {
    try {      
      await createBotMessage(`[GIT] Coning repo ${repo}`, chatId)
      await gitClient.clone(repo, chatId);
      await createBotMessage(`[GIT] ✅ Successfully cloned ${repo}`, chatId)
    } catch (error) {
      await createBotMessage(`[GIT] ✅ Failed to clone ${repo} , reason : ${error.message}`, chatId)
    }
  };

  const textColorPrimary = useColorModeValue('navy.700', 'white');
  const searchColor = useColorModeValue('gray.700', 'white');
  const inputBg = useColorModeValue('transparent', 'navy.800');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' }
  );

  return (
    <VStack spacing={4}>
      <Input
        fontWeight="500"
        bg={inputBg}
        variant="main"
        fontSize="sm"
        border="1px solid"
        color={searchColor}
        borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
        borderRadius="12px"
        h="44px"
        maxH="44px"
        placeholder="Enter repo URL"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />
      <Button colorScheme={buttonColor} onClick={handleClone}>
        Clone Repo
      </Button>
    </VStack>
  );
};

export default GitClone;
