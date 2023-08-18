import React, { useState } from 'react';
import { Button, Input, VStack, useColorModeValue } from '@chakra-ui/react';
import GitClient from '@/utils/gitClient';
import { createBotMessage } from '@/utils/messages';

interface GitCloneProps {
  repo: string;
  setRepo: (repo: string) => void;
}

const GitClone = () => {
  const [repo, setRepo] = useState('');
  const gitClient = GitClient.getInstance();
  const buttonColor = useColorModeValue('brand.500', 'white');

  const handleClone = async () => {
    try {      
      await createBotMessage(`[GIT] Coning repo ${repo}`)
      await gitClient.clone(repo);
      await createBotMessage(`[GIT] ✅ Successfully cloned ${repo}`)
    } catch (error) {
      await createBotMessage(`[GIT] ✅ Failed to clone ${repo} , reason : ${error.message}`)
    }
  };

  return (
    <VStack spacing={4}>
      <Input
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
