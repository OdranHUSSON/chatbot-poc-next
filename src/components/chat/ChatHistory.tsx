import { useToast, Box, Flex, Icon, Text, useColorModeValue, Table, Td, Th, Tr, Spinner, Badge, Button } from '@chakra-ui/react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdContentCopy, MdFileCopy, MdShare, MdSave } from 'react-icons/md';
import ReactMarkdown from "react-markdown";
import { useClipboard } from '@/utils/copy';
import React, { useState, useRef, useEffect } from 'react';
import LineChart from '../charts/LineChart';
import { GitModal } from '../sidebar/components/git/GitModal';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type ChatType = {
  type: 'user' | 'bot';
  message: string;
};

const ChatHistory = ({ chatHistory }: any) => {
  	const toast = useToast();

  	const [isOpen, setIsOpen] = useState(false);
  	const [fileContentForModal, setFileContentForModal] = useState<string | null>(null);
	const { handleCopy } = useClipboard();
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const brandColor = useColorModeValue('brand.500', 'white');
	const gray = useColorModeValue('gray.500', 'white');
	const textColor = useColorModeValue('navy.700', 'white');
	const chatEndRef = useRef(null); 

	useEffect(() => {
	  chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
	  <Box width={"100%"} position={"relative"}>
		<GitModal isOpen={isOpen} fileContent={fileContentForModal} onClose={onClose} />
		{chatHistory.map((chat: ChatType, index: number) => (
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
					w="100%"
					mt={{ base: '10px', md: '0' }}
				>
					<Box position="relative" width={"100%"} minW={"320px"}>
					{
						(() => {
							let cleanedMessage = chat.message.trim().replace(/\n/g, '');
							const datasetMatch = cleanedMessage.match(/<Linechart dataset='([^']+)'\/?>/i);
							const jsonString = datasetMatch ? datasetMatch[1] : null;
						
							if (jsonString) {
								return <LineChart dataJSON={jsonString} />;
							}

							if (chat.message === '<Loading>') return <Spinner size="sm" />;
							return <ReactMarkdown components={MarkdownComponents}>{chat.message}</ReactMarkdown>;
						})()
					}
					</Box>
				</Flex>
			</Flex>

		))}
		<div ref={chatEndRef} /> {/* This empty div will be our scrolling target */}
    </Box>
	);
  };
  
  export default ChatHistory;
  