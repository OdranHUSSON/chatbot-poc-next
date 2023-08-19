import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  DrawerOverlay, 
  DrawerContent, 
  DrawerHeader, 
  DrawerCloseButton, 
  DrawerBody, 
  Text, 
  Flex, 
  Icon, 
  Box 
} from '@chakra-ui/react';
import GitClient from '@/utils/gitClient';
import RepoList from '@/components/git/RepoList';
import RepoDetails from '@/components/git/GitSave';
import FileToChat from './FileToChat';
import GitClone from './GitClone';
import GitCommit from './GitCommit';
import { MdMemory } from 'react-icons/md';

export const GitDrawer = ({ isOpen, onClose, component }) => {
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
    <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Flex
            align={"center"}
            verticalAlign={"center"}
            w="100%"
            p={2}>
              <Icon as={MdMemory} color={"brand.500"} mr={2} /> 
              <Text fontStyle={"bold"}>Github</Text>
              <Text fontStyle={"light"}> - save</Text>
          </Flex>            
        </DrawerHeader>
        <DrawerBody>
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
      </DrawerBody>
    </DrawerContent>
    </Drawer>
  );
};
