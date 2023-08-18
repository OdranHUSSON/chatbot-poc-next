import React, { useState } from 'react';
import { Button, Textarea, VStack, useColorModeValue, Icon } from '@chakra-ui/react';
import { MdAndroid } from 'react-icons/md';
import GitClient from '@/utils/gitClient';
import { createBotMessage } from '@/utils/messages';

interface GitCommitProps {
  repo: string;
  commitMessage: string;
  setCommitMessage: (message: string) => void;
}

const GitCommit: React.FC<GitCommitProps> = ({ repo }) => {
  const [commitMessage, setCommitMessage] = useState('');
  const gitClient = GitClient.getInstance();
  const buttonColor = useColorModeValue('brand.500', 'white');

  const handleCommit = async () => {
    try {
      await createBotMessage(`[GIT] Creating commit in ${repo}`);
      await gitClient.add(repo);
      await gitClient.commit(commitMessage, repo);
      await createBotMessage(`[GIT] ✅ Successfully committed in ${repo}`);
    } catch (error) {
      await createBotMessage(`[GIT] Failed committing in ${repo}, reason: ${error.message}`);
    }
  };

  const handleGenerateCommitMessage = () => {
    
  };

  return (
    <VStack spacing={4}>
      <Textarea
        placeholder="Enter commit message"
        value={commitMessage}
        onChange={(e) => setCommitMessage(e.target.value)}
      />
      <Button colorScheme={"brand"} onClick={handleCommit}>
        Commit Changes
      </Button>
      <Button colorScheme={"brand"} onClick={handleGenerateCommitMessage} leftIcon={<Icon as={MdAndroid} />}>
        Generate Commit Message
      </Button>
    </VStack>
  );
};

export default GitCommit;
