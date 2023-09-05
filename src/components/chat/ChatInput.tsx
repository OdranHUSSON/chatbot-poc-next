import React, { FC, KeyboardEvent, ChangeEvent, useState } from 'react';
import { Button, Flex, Input, useColorModeValue } from '@chakra-ui/react';
import ChatActions from './ChatActions';

interface ChatInputProps {
  inputCode: string;
  setInputCode: (value: string) => void;
  handleChat: () => void;
  loading: boolean;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({
  inputCode,
  setInputCode,
  handleChat,
  loading,
  chatId
}) => {
  const [localInputCode, setLocalInputCode] = useState(inputCode);
  const inputColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' }
  );
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');

  let timeoutId;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setInputCode(localInputCode);
      handleChat();
    }
  };  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalInputCode(value);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setInputCode(value);
    }, 350);
  };

  return (
    <Flex
      position="relative"
      width={"100%"}
      bottom="0"
      left="0"
      right="0"
      zIndex={1000}
      justifySelf={'flex-end'}
      as="form"
      onSubmit={(e) => e.preventDefault()}
      align={"center"}
      m={"20px 0"}
    >
      <ChatActions chatId={chatId}/>
      <Input
        placeholder='Type your message here...'
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
        value={localInputCode}
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
        onClick={() => {
          setInputCode(localInputCode);
          handleChat();
        }}
        isLoading={loading ? true : false}
      >
        Submit
      </Button>
    </Flex>
  );
};

export default ChatInput;
