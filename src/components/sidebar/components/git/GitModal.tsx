import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import GitClient from '@/utils/gitClient';
import RepoList from '@/components/sidebar/components/git/RepoList';
import RepoDetails from '@/components/sidebar/components/git/RepoDetail';

export const GitModal = ({ isOpen, onClose, fileContent }) => {
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
            <RepoDetails repoName={selectedRepo} fileContent={fileContent} closeModal={onClose} onRemove={handleRepoRemove} />
          ) : (
            <RepoList repos={repos} onSelect={handleRepoSelect} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
