'use client';
import type { AppProps } from 'next/app';
import { ChakraProvider, Box, Portal, useDisclosure } from '@chakra-ui/react';
import theme from '@/theme/theme';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import SocketIOClient from 'socket.io-client';

function App({ Component, pageProps }: AppProps<{}>) {
  const [apiKey, setApiKey] = useState('');
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const initialKey = localStorage.getItem('apiKey');
    if (initialKey?.includes('sk-') && apiKey !== initialKey) {
      setApiKey(initialKey);
    }
  }, [apiKey]);

  const [socket, setSocket] = useState<typeof SocketIOClient.Socket | null>(null);
  
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
    const socketInstance = SocketIOClient(socketUrl, {
      path: "/api/ws",
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Sidebar setApiKey={setApiKey} routes={routes} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Portal>
            <Box>
              <Navbar
                setApiKey={setApiKey}
                onOpen={onOpen}
                logoText={'Horizon UI Dashboard PRO'}
                brandText={getActiveRoute(routes, pathname)}
                secondary={getActiveNavbar(routes, pathname)}
                socket={socket}
              />
            </Box>
          </Portal>
          <Box
            mx="auto"
            p={{ base: '0 20px', md: '0 30px' }}
            pe="20px"
            minH="100vh"
            height="100%"
            overflow={"hidden"}
            pt={{ base: '60px', md: '100px' }}
          >
            <Component apiKeyApp={apiKey} socket={socket} {...pageProps} />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
