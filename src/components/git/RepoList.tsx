import React, { useState, useEffect } from 'react';
import { Box, Text, Button, useToast, Badge, Flex } from '@chakra-ui/react';
import GitClient from '@/utils/gitClient';
import ReactMarkdown from 'react-markdown';
import { LightMarkdownComponents } from '@/styles/LightMarkdownComponent';

interface RepoListProps {
  onSelect: (repo: string) => void;
}

const RepoList: React.FC<RepoListProps> = ({ onSelect }) => {
  const [repos, setRepos] = useState<{ name: string; description: string }[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const gitClient = GitClient.getInstance();
        const response = await gitClient.repos();
        if (response.success) {
          setRepos(response.data);
        }
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
  }, [toast]);

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
      setRepos((prevRepos) => prevRepos.filter((r) => r.name !== repo));
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
      {repos.map((repo) => (
        <Box key={repo.name} p={5} mb={8} shadow="md" borderWidth="1px" borderRadius="lg">
          <Flex w="100%" alignItems="center" justifyContent="left">
            <Text fontSize="xl" fontWeight="bold">
              {repo.name}
            </Text>
            <Badge
              display={{ base: 'flex', lg: 'none', xl: 'flex' }}
              colorScheme="brand"
              borderRadius="25px"
              color="brand.500"
              textTransform="none"
              letterSpacing="0px"
              px="8px"
            >
              {repo.branch}
            </Badge>
          </Flex>
          <Box p={2}>
            <Text fontWeight="bold">README.md</Text>
            <Box height="200px" overflow="scroll" m={2} p={8} bg="#000" color="#FFF">
              <ReactMarkdown components={LightMarkdownComponents}>{repo.description}</ReactMarkdown>
            </Box>
          </Box>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button colorScheme="red" variant="outline" onClick={() => handleDeleteRepo(repo.name)}>
              Delete
            </Button>
            <Button colorScheme="teal" variant="outline" onClick={() => handleSelectRepo(repo.name)}>
              Select
            </Button>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default RepoList;
