import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

interface RepoListProps {
  repos: string[];
  onSelect: (repo: string) => void;
}

const RepoList: React.FC<RepoListProps> = ({ repos, onSelect }) => {
  return (
    <>
      {repos.map(repo => (
        <Box key={repo} p={5} shadow="md" borderWidth="1px">
          <Text>{repo}</Text>
          <Button colorScheme="teal" variant="outline" mt={2} onClick={() => onSelect(repo)}>
            Open
          </Button>
        </Box>
      ))}
    </>
  );
};

export default RepoList;
