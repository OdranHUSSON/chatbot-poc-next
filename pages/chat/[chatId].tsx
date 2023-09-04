import { useRouter } from 'next/router';
import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import ModelChange from '@/components/chat/ModelChange';
import ChatInput from '@/components/chat/ChatInput';
import ChatHistory from '@/components/chat/ChatHistory';
import ChatAdmin from '@/components/chat/ChatAdmin';
import { ChatBody, OpenAIModel } from '@/types/types';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Icon, Image, Img, Input, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdContentCopy, MdFileCopy } from 'react-icons/md';
import Bg from '../../public/img/chat/bg-image.png';
import ReactMarkdown from 'react-markdown'
import { useChat } from '@/utils/useChat';
import ChatsList from '@/components/chat/ChatsList';

export default function Chat(props: { apiKeyApp: string, socket: typeof SocketIOClient.Socket | null }) {
    const router = useRouter();
    const { chatId } = router.query;
    const [isLoading, setIsLoading] = useState(true);

    const chat = useChat(props.apiKeyApp, props.socket, chatId as string);
    const { chatHistory, model, setModel, outputCode, setOutputCode, inputCode, setInputCode, handleChat, loading, fetchChatHistory } = chat;

    useEffect(() => {
        if (chatId) {
            setIsLoading(false);
            fetchChatHistory(chatId as string)
        }
    }, [chatId]);

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

    return (
        <Flex direction="row" height="100%">
            <Flex flex="1" marginRight="10px" position="relative" overflowY="scroll" height="100%" maxHeight="calc(100vh - 20px - 100px)">
                <ChatsList selectedChat={chatId} />
            </Flex>
            <Flex flex="3" direction="column" position="relative" height="100%" padding="0 30px">
                <Box flex="1" overflowY="auto" maxHeight="calc(100vh - 74px - 100px)">
                    <ModelChange model={model} setModel={setModel} outputCode={outputCode} />
                    <ChatHistory chatHistory={chatHistory} chatId={chatId} />
                </Box>
                <Box position="sticky" bottom={0} zIndex={1}>
                    <ChatInput
                        inputCode={inputCode}
                        setInputCode={setInputCode}
                        handleChat={handleChat}
                        loading={loading}
                        chatId={chatId as string}
                    />
                </Box>
            </Flex>
        </Flex>
    );
}
