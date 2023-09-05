import { useToast, Box, Flex, Icon, Text, useColorModeValue, Table, Td, Th, Tr, Spinner, Badge, Button } from '@chakra-ui/react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdContentCopy, MdFileCopy, MdShare, MdSave, MdArrowDownward } from 'react-icons/md';
import ReactMarkdown from "react-markdown";
import { useClipboard } from '@/utils/copy';
import React, { useState, useRef, useEffect } from 'react';
import LineChart from '../charts/LineChart';
import { GitModal } from '../git/GitSaveDrawer';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import reactMarkdown from 'react-markdown';

type ChatType = {
  type: 'user' | 'bot';
  message: string;
};

const ChatHistory = ({ chatHistory, chatId }: any) => {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [fileContentForModal, setFileContentForModal] = useState<string | null>(null);
  const { handleCopy } = useClipboard();
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const brandColor = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'white');
  const textColor = useColorModeValue('navy.700', 'white');
  const chatEndRef = useRef(null);
  const loadMoreRef = useRef();
  const [lastMessage, setLastMessage] = useState(5);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreMessages();
      }
    }, { threshold: 1 });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, []);

  const loadMoreMessages = () => {
    setLastMessage((prevLastMessage) => prevLastMessage + 20);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const onClose = () => {
    setIsOpen(false);
  }

  const MarkdownComponents = {
    h1: (props: any) => <Text as="h1" fontSize="2xl" fontWeight="bold" my={3} {...props} />,
    h2: (props: any) => <Text as="h2" fontSize="xl" fontWeight="bold" my={2} {...props} />,
    h3: (props: any) => <Text as="h3" fontSize="lg" fontWeight="bold" my={2} {...props} />,
    p: (props: any) => <Text my={2} {...props} />,
    table: Table,
    th: Th,
    td: Td,
    tr: Tr,
    code: ({ inline, children, ...props }: CodeComponentProps) => {
      // Extracting the content from children
      const content = Array.isArray(children) 
          ? children[0]
          : children;
      if (!content) {
          return <Text>Error displaying code.</Text>;
      }
    
      // Handle inline code
      if (inline) {
          return <Badge as="code" px={1} {...props}>{content}</Badge>;
      }
    
      // Handle block code
      return (
          <Box maxW="300px" minW="100%" overflowX="auto" my={4} {...props}> 
              <Flex justifyContent="space-between" alignItems="center" borderBottom="1px solid" borderColor="gray.300" pb={1}>
                  <Icon as={MdFileCopy} onClick={() => handleCopy(content)} cursor="pointer" />	
                  <Icon as={MdSave} onClick={() => {
                      setFileContentForModal(content);
                      setIsOpen(true);
                  }} cursor="pointer" />				 
              </Flex>
              <SyntaxHighlighter position="relative" width={"100%"}  overflow={"scroll"} style={dracula} language="javascript">
                  {content}
              </SyntaxHighlighter>
          </Box>
      );
    }
  };

  return (
    <Box width={"100%"} position={"relative"} overflowY={"scroll"} height={"100%"}>
      <GitModal isOpen={isOpen} fileContent={fileContentForModal} onClose={onClose} chatId={chatId} />
      
      {chatHistory.slice(0, lastMessage).map((chat: ChatType, index: number) => (
        <Flex 
        key={index} 
        w="100%" 
        overflowX="hidden" 
        align="center" 
        mb="10px"
        direction={{ base: 'column', md: 'row' }}
        >
          <Flex         
            direction="row"
            align="center"
            borderRadius="full" 
            bg={chat.type === 'user' ? 'transparent' : 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'} 
            me={{ base: '0', md: '20px' }} 
            mt={{ base: '10px', md: '0' }}
            h="40px" 
            minH="40px" 
            minW="40px"
            justifyContent={{ base: 'flex-start', md: 'center' }}
            p={{ base: '10px', md: '0' }}
          >
            <Icon as={chat.type === 'user' ? MdPerson : MdAutoAwesome} w="20px" h="20px" color={chat.type === 'user' ? brandColor : 'white'} />
          </Flex>
          <Flex 
              p="22px" 
              border="1px solid" 
              borderColor={borderColor} 
              borderRadius="14px" 
              flex="1" 
              zIndex={2} 
              color={textColor} 
              fontWeight="600" 
              fontSize={{ base: 'sm', md: 'md' }} 
              lineHeight={{ base: '24px', md: '26px' }}
              maxW="300px" minW="100%" overflowX="auto"
              mt={{ base: '10px', md: '0' }}
          >
              <Box position="relative" width={"100%"} minW={"320px"}>
              {
                  (() => {
                      let cleanedMessage = chat.message.trim().replace(/\n/g, '');

                      if (chat.message === '<Loading>') return <Spinner size="sm" />;
                      if (cleanedMessage.startsWith('@agent')) {
                        try {
                          // Parse the command
                          const command = JSON.parse(cleanedMessage.replace('@agent ', ''));
                    
                          // Display the command as a badge
                          return <Box>
                                  <Badge
                                  colorScheme="brand"
                                  borderRadius="25px"
                                  color="brand.500"
                                  textTransform="none"
                                  letterSpacing="0px"
                                  width={"auto"}
                                  px="8px"
                                  _hover={{ cursor: 'pointer' }}
                                >
                                  @{command.command}
                                </Badge>
                          </Box>
                        } catch (error) {
                          console.error('Error parsing command:', error);
                        }
                      }
                      return <ReactMarkdown components={MarkdownComponents}>{chat.message}</ReactMarkdown>;
                  })()
              }
              </Box>
            </Flex>
          </Flex>
      ))}
      <div ref={loadMoreRef} /> 
      <div ref={chatEndRef} /> 

      <Button
        position="fixed"
        bottom="10px"
        right="1rem"
        variant="secondary"
        py="4px"
        px="8px"
        fontSize="sm"
        borderRadius="45px"
        ms="auto"
        zIndex={"1000"}
        onClick={scrollToBottom}
        leftIcon={<MdArrowDownward />}
      />
    </Box>
  );
};

export default ChatHistory;
