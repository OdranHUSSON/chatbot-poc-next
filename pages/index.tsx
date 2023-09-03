'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import ModelChange from '@/components/chat/ModelChange';
import ChatInput from '@/components/chat/ChatInput';
import ChatHistory from '@/components/chat/ChatHistory';

import { ChatBody, OpenAIModel } from '@/types/types';
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Flex,
	Icon,
	Image,
	Img,
	Input,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdContentCopy, MdFileCopy } from 'react-icons/md'; 
import Bg from '../public/img/chat/bg-image.png';
import ReactMarkdown from 'react-markdown'
import { useChat } from '@/utils/useChat';

export default function Index(props: { apiKeyApp: string, socket: typeof SocketIOClient.Socket | null }) {
	const { 
		chatHistory,
		setChatHistory, 
		inputOnSubmit, 
		setInputOnSubmit, 
		inputCode, 
		setInputCode, 
		outputCode, 
		setOutputCode, 
		model, 
		setModel, 
		loading, 
		setLoading, 
		clearChatHistory, 
		handleChat ,
		chatId
	} = useChat(props.apiKeyApp, props.socket);

	const { apiKeyApp } = props;
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const inputColor = useColorModeValue('navy.700', 'white');
	const iconColor = useColorModeValue('brand.500', 'white');
	const bgIcon = useColorModeValue(
		'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
		'whiteAlpha.200',
	);
	const brandColor = useColorModeValue('brand.500', 'white');
	const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
	const gray = useColorModeValue('gray.500', 'white');
	const buttonShadow = useColorModeValue(
		'14px 27px 45px rgba(112, 144, 176, 0.2)',
		'none',
	);
	const textColor = useColorModeValue('navy.700', 'white');
	const placeholderColor = useColorModeValue(
		{ color: 'gray.500' },
		{ color: 'whiteAlpha.600' },
	);

	// @ts-ignore
		return (
			
		<Flex
			w="100%"
			pt={{ base: '70px', md: '0px' }}
			direction="column"
			position="relative"
			overflow={"hidden"}
		>
			<Img
				src={Bg.src}
				position={'absolute'}
				w="350px"
				left="50%"
				top="50%"
				transform={'translate(-50%, -50%)'}
			/>
			<Flex
				direction="column"
				mx="auto"
				w={{ base: '100%', md: '100%', xl: '100%' }}
				minH={{ base: '75vh', '2xl': '85vh' }}
				maxW="1000px"
				paddingTop={{ base: '44px', md: '16px', xl: '18px' }}
			>
				
				<ModelChange model={model} setModel={setModel} outputCode={outputCode} />				
				<ChatHistory chatHistory={chatHistory} chatId={chatId}/>
				<ChatInput
					inputCode={inputCode}
					setInputCode={setInputCode}
					handleChat={handleChat}
					loading={loading}
					chatId={chatId as string}
				/>
			</Flex>
		</Flex>
	);
}
