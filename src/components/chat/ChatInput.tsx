import React, { FC, KeyboardEvent, ChangeEvent, useState } from 'react';
import { MdBolt } from 'react-icons/md';
import { Button, Flex, Icon, Input, useColorModeValue, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { commands } from '@/utils/commands';
import { MdDelete, MdFileDownload } from 'react-icons/md';
import { truncateMessages } from '@/utils/messages';
import { FileToChatModal } from '../sidebar/components/git/FileToChatModal';

interface ChatInputProps {
  inputCode: string;
  setInputCode: (value: string) => void;
  handleChat: () => void;
  handleDeleteChat: () => void; 
  loading: boolean;
}


const ChatInput: FC<ChatInputProps> = ({
  inputCode,
  setInputCode,
  handleChat,
  loading,
}) => {
  const [truncating, setTruncating] = useState<boolean>(false);
  const [isFileModalOpen, setisFileModalOpen] = useState(false);
  const inputColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' }
  );

  const navbarIcon = useColorModeValue('gray.500', 'white');
  let menuBg = useColorModeValue('white', 'navy.700');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '0px 41px 75px #081132',
  );
  const buttonBg = useColorModeValue('transparent', 'navy.800');
  const activeButton = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.200' },
  );

  const onFileModalClose = () => {
		setisFileModalOpen(false);
	}

	const openFileModal = () => {
		setisFileModalOpen(true);
  };

  const [autoCompleteIndex, setAutoCompleteIndex] = useState<number>(-1);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleChat();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matchingCommands = commands.filter((command) =>
        command.name.startsWith(inputCode.slice(1))
      );
      if (matchingCommands.length > 0) {
        if (autoCompleteIndex === -1) {
          // First tab press
          setAutoCompleteIndex(0);
          setInputCode(`/${matchingCommands[0].name}`);
        } else {
          // Subsequent tab presses
          const nextIndex = (autoCompleteIndex + 1) % matchingCommands.length;
          setAutoCompleteIndex(nextIndex);
          setInputCode(`/${matchingCommands[nextIndex].name}`);
        }
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputCode(value);

    if (value.startsWith('/')) {
      const matchingCommands = commands.filter((command) =>
        command.name.startsWith(value.slice(1))
      );
      if (matchingCommands.length > 0) {
        setAutoCompleteIndex(0);
      } else {
        setAutoCompleteIndex(-1);
      }
    } else {
      setAutoCompleteIndex(-1);
    }
  };

  const handleTruncateMessages = async () => {
    e.stopPropagation();
    console.log("Truncate button clicked");
    setTruncating(true);
    await truncateMessages();
    setTruncating(false);
  };

  const handleAddFileFromGithub = () => {
    setisFileModalOpen(true)
  };

  return (
    <Flex
      position="relative"
      width={"100%"}
      bottom="0"
      left="0"
      right="0"
      zIndex={1000}
      ms={{ base: '0px', xl: '60px' }}
      mt="20px"
      justifySelf={'flex-end'}
      as="form"
      onSubmit={(e) => e.preventDefault()}
      align={"center"}
    >
   <FileToChatModal isOpen={isFileModalOpen} onClose={onFileModalClose}/>
    <Menu>
      <MenuButton
          as={Button}
          bg={menuBg}
          transition='all 0.2s'
          borderRadius="45px"
          p="120x"
          me="10px"          
          _hover={{
            boxShadow:
              '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
            bg:
              'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
            _active: {
              bg:  'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
            },
          }}
          
        >
          <Icon as={MdBolt} w={7} h={7} marginLeft="-5px" />
        </MenuButton>
        <MenuList>
          <MenuItem bg={"red.500"}  _hover={{
              bg:
              'red.700',
              _disabled: {
                bg: 'red.700',
              },
            }} icon={<MdDelete />} onClick={handleTruncateMessages}>
            Delete
          </MenuItem>
          <MenuItem icon={<MdFileDownload />} onClick={handleAddFileFromGithub}>
            Add file from Github
          </MenuItem>
        </MenuList>
      </Menu>
      <Input
        placeholder={
          autoCompleteIndex >= 0
            ? commands[autoCompleteIndex].name
            : 'Type your message here...'
        }
        onKeyDown={handleKeyDown}
        minH="54px"
        h="54px"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="45px"
        p="15px 20px"
        me="10px"
        fontSize="sm"
        fontWeight="500"
        _focus={{ borderColor: 'none' }}
        color={inputColor}
        _placeholder={placeholderColor}
        onChange={handleChange}
        value={inputCode}
      />
      <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg:
                'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={handleChat}
            isLoading={loading ? true : false}
          >Submit</Button>
    </Flex>
  );
};

export default ChatInput;
