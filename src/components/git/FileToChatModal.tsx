import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  Text, 
  VStack, 
  useDisclosure, 
  Box 
} from '@chakra-ui/react';
import GitClient from '@/utils/gitClient';
import RepoList from '@/components/git/RepoList';
import RepoDetails from '@/components/git/RepoDetail';
import FileToChat from './FileToChat';
import GitClone from './GitClone';
import GitCommit from './GitCommit';

export const FileToChatModal = ({ isOpen, onClose, component }) => {
  const [repos, setRepos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    GitClient.getInstance().repos()
      .then(data => {
        if (data.success) {
          setRepos(data.data);
        } else {
          console.error(data.error);
        }
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const handleRepoSelect = (repo: string) => {
    setSelectedRepo(repo);
  };

  const handleRepoRemove = () => {
    setSelectedRepo(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Git Repositories</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Text>Loading...</Text>
          ) : selectedRepo ? (
            <Box>
              {component === 'commit' && (
                <GitCommit repo={selectedRepo} />
              )}
              {component === 'fileread' && (
                <FileToChat repoName={selectedRepo} closeModal={onClose} onRemove={handleRepoRemove} />
              )}
            </Box>
          ) : (
            <>
              <RepoList repos={repos} onSelect={handleRepoSelect} />
              <GitClone />
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
