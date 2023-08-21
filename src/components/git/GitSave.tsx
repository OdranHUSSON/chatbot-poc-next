import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, Button, VStack, Flex, Spinner, HStack } from '@chakra-ui/react';
import GitClient from '@/utils/gitClient';
import ReactMarkdown from 'react-markdown';
import { LightMarkdownComponents } from '@/styles/LightMarkdownComponent';
import { createBotMessage } from '@/utils/messages';

interface RepoDetailsProps {
  repoName: string;
  onRemove: () => void;
  fileContent: string;
  closeModal: () => void;
  filePath?: string;
  chatId: string;
}

const RepoDetails: React.FC<RepoDetailsProps> = ({ repoName, onRemove, fileContent , closeModal, filePath, chatId }) => {
  const [contents, setContents] = useState<any[]>([]);
  const [currentDir, setCurrentDir] = useState('.');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const fetchContents = useCallback(() => {
    setLoading(true);
    GitClient.getInstance().list(currentDir, repoName, chatId)
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

  useEffect(() => {
    if (filePath) {
      const directory = filePath.substring(0, filePath.lastIndexOf('/'));
      setCurrentDir(directory);
      setSelectedFile(filePath);
    }
  }, [filePath]);

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
  };

  const handleOverwrite = () => {
    GitClient.getInstance().writeFile(selectedFile!, fileContent, repoName, chatId)
      .then(data => {
        if (!data.success) {
          createBotMessage(`[GIT] Failed to overwrite file ${repoName}${selectedFile}`, chatId);
        }
      })
      .catch(error => {
        createBotMessage(`[GIT] Failed to overwrite file ${repoName}${selectedFile}`, chatId);
      })
      .finally(() => {
        setSelectedFile(null);
        closeModal();
      });
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
            Are you sure you want to overwrite <strong>{selectedFile}</strong> with the following content?
          </Text>
          <Box mt={4} p={4} borderWidth={1} borderRadius="md" shadow="sm">
            <ReactMarkdown components={LightMarkdownComponents}>
              {fileContent}
            </ReactMarkdown>
          </Box>
          <Flex mt={4} justifyContent="space-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button colorScheme="brand" onClick={handleOverwrite}>Overwrite</Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default RepoDetails;
