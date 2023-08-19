import React, { FC, useState } from 'react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Box,
  Flex,
  Icon,
  Text,
  Link,
  Badge,
  MenuItem,
  Spinner
} from '@chakra-ui/react';
import { MdDelete, MdFileDownload, MdLightbulbCircle, MdLightbulbOutline, MdMemory, MdOutlineManageAccounts } from 'react-icons/md';
import { GitDrawer } from '../git/GitDrawer';
import { truncateMessages } from '@/utils/messages';

const ChatActions: FC<ChatActionsProps> = () => {
  const [isFileModalOpen, setisFileModalOpen] = useState(false);
  const [modalComponent, setModalComponent] = useState('fileread');
  const [truncating, setTruncating] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onFileModalClose = () => {
    setisFileModalOpen(false);
  };

  const handleTruncateMessages = async () => {
    setTruncating(true);
    await truncateMessages();
    setTruncating(false);
    setIsDrawerOpen(false);
  };

  const handleAddFileFromGithub = () => {
    setModalComponent('fileread');
    setisFileModalOpen(true);
    setIsDrawerOpen(false);
  };

  const handleCommit = () => {
    setModalComponent('commit');
    setIsDrawerOpen(false);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const gray = 'gray.500'; // define gray color, adjust as needed

  return (
    <>
      <GitDrawer
        isOpen={isFileModalOpen}
        onClose={onFileModalClose}
        component={modalComponent}
      />
      <Button
        transition='all 0.2s'
        borderRadius="24px"
        p="120x"
        me="10px"
        bg={"linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important"}
        _hover={{
          boxShadow: '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
          bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
          _active: {
            bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
          },
        }}
        onClick={openDrawer}
      >
        <Icon
          as={MdLightbulbOutline}
          width="24px"
          height="24px"
          color={"#FFF"}
        /> 
      </Button>
      <Drawer placement="right" onClose={() => setIsDrawerOpen(false)} isOpen={isDrawerOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Actions</DrawerHeader>
            <DrawerBody>
              <Button mb="30px" w={"100%"} onClick={handleTruncateMessages}>
                <Flex align="center" w="100%">
                  <Icon
                    as={MdDelete}
                    width="24px"
                    height="24px"
                    color={"red.500"}
                    me="12px"
                  />                  
                   {truncating ? <Spinner color='brand' /> : <Text color={"brand"} fontWeight="500" fontSize="sm">Truncate</Text> }
                </Flex>
              </Button>

              <Button mb="30px" w={"100%"} onClick={handleAddFileFromGithub}>
                <Flex align="center" w="100%">
                  <Icon
                    as={MdMemory}
                    width="24px"
                    height="24px"
                    color={"brand"}
                    me="12px"
                  />
                  <Text
                    color={"brand"}
                    fontWeight="500"
                    fontSize="sm"
                  >
                    Github
                  </Text>
                </Flex>
              </Button>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default ChatActions;
