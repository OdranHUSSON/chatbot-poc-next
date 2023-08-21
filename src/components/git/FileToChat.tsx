import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, Button, VStack, Flex, Spinner, HStack, useToast } from '@chakra-ui/react';
import GitClient from '@/utils/gitClient';
import ReactMarkdown from 'react-markdown';
import { LightMarkdownComponents } from '@/styles/LightMarkdownComponent';
import { createBotMessage, createUserMessage } from '@/utils/messages';

interface RepoDetailsProps {
  repoName: string;
  onRemove: () => void;
  fileContent: string;
  closeModal: () => void;
  chatId: string;
}

const FileToChat: React.FC<RepoDetailsProps> = ({ repoName, onRemove , closeModal, chatId }) => {
  const [contents, setContents] = useState<any[]>([]);
  const [currentDir, setCurrentDir] = useState('.');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const toast = useToast();

  const fetchContents = useCallback(() => {
    setLoading(true);
    GitClient.getInstance().list(currentDir, repoName)
      .then(data => {
        if (data.success) {
          setContents(data.data);
        } else {
          console.error(data.error);
        }
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, [repoName, currentDir]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
  };

  const handleRead = async () => { 
    try {
      const data = await GitClient.getInstance().readFile(selectedFile!, repoName, chatId);
  
      if (data.success) {
        await createUserMessage("Provide me the code of " + selectedFile, chatId); 
        await createBotMessage('```\n' + data.content + '\n```\n', chatId); 
      } else {
        toast({
          title: "Error",
          description: `Failed to read file ${selectedFile} : ${data.error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to read file ${selectedFile} : ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSelectedFile(null);
      closeModal();
    }
  };
  


  const handleCancel = () => {
    setSelectedFile(null);
  };

  const handleFolderClick = (folderName: string) => {
    const newPath = `${currentDir}/${folderName}`;
    setCurrentDir(newPath);
  };

  const handleBackClick = () => {
    const newPath = currentDir.substring(0, currentDir.lastIndexOf('/')) || '.';
    setCurrentDir(newPath);
  };

  const isRootDir = currentDir === '.';

  return (
    <Box p={5} width={"100%"} borderWidth={1} borderRadius="md" shadow="md">
      <Flex justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">{repoName}</Text>
        <Button colorScheme="brand" variant="outline" onClick={onRemove}>
          Change GitHub Repo
        </Button>
      </Flex>

      {selectedFile === null ? (
        <>
          <Text mt={4}>
            Select a file to save your data.
          </Text>

          {!isRootDir && (
            <Button mt={2} onClick={handleBackClick}>
              Back
            </Button>
          )}

          {loading ? (
            <Spinner />
          ) : (
            <VStack spacing={2} mt={2} align="start">
              {contents.map((item, index) => (
                <Box
                  w={"100%"}
                  key={index}
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: 'brand.500' }}
                  color={'currentColor'}
                  cursor={"pointer"}
                  onClick={() => item.type === 'file' ? handleFileSelect(`${currentDir}/${item.name}`) : handleFolderClick(item.name)}
                >
                  {item.type === 'file' ? (
                    <Text>📄 {item.name}</Text>
                  ) : (
                    <Text>📁 {item.name}</Text>
                  )}
                </Box>
              ))}
            </VStack>
          )}
        </>
      ) : (
        <>
          <Text mt={4}>
            Do you want to add this file content as a chat context ?
          </Text>
          <Flex mt={4} justifyContent="space-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button colorScheme="brand" onClick={handleRead}>Add to chat</Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default FileToChat;
