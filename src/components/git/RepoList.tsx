import React, { useState, useEffect } from 'react';
import { Box, Text, Button, useToast, Card } from '@chakra-ui/react';
import GitClient from '@/utils/gitClient';

interface RepoListProps {
  onSelect: (repo: string) => void;
}

const RepoList: React.FC<RepoListProps> = ({ onSelect }) => {
  const [repos, setRepos] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const gitClient = GitClient.getInstance();
        const repos = await gitClient.repos();
        setRepos(repos);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch repos',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchRepos();
  }, []);

  const handleSelectRepo = (repo: string) => {
    onSelect(repo);
  };

  const handleDeleteRepo = async (repo: string) => {
    try {
      const gitClient = GitClient.getInstance();
      await gitClient.deleteRepo(repo);
      toast({
        title: 'Success',
        description: 'Repo deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setRepos(prevRepos => prevRepos.filter(r => r !== repo));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete repo',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {repos.map(repo => (
        <Card key={repo} p={5} shadow="md" borderWidth="1px">
          <Text fontSize="xl" fontWeight="bold">{repo}</Text>
          <Text mt={2}>{/* Render README.md content here */}</Text>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button colorScheme="teal" variant="outline" onClick={() => handleSelectRepo(repo)}>
              Select
            </Button>
            <Button colorScheme="red" variant="outline" onClick={() => handleDeleteRepo(repo)}>
              Delete
            </Button>
          </Box>
        </Card>
      ))}
    </>
  );
};

export default RepoList;
