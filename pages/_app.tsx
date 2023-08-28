import type { AppProps } from 'next/app';
import { ChakraProvider, Box, Portal, useDisclosure } from '@chakra-ui/react';
import theme from '@/theme/theme';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import SocketIOClient from 'socket.io-client';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminNavbar from '@/components/navbar/NavbarAdmin';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';

function ChildComponent({ Component, pageProps, apiKey, socket, setIsAuthenticated }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = !!session;

  useEffect(() => {
    setIsAuthenticated(isAuthenticated);
    if (status === 'loading') return;
    if (!session) router.push('/Login');
  }, [session, status, router, setIsAuthenticated]);

  return (
    <Box
      mx="auto"
      p={{ base: '20px', md: '30px' }}
      pe="20px"
      minH="100vh"
      pt="50px"
    >
      <Component apiKeyApp={apiKey} socket={socket} {...pageProps} />
    </Box>
  );
}

function App({ Component, pageProps }: AppProps<{}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [socket, setSocket] = useState<typeof SocketIOClient.Socket | null>(null);
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const initialKey = localStorage.getItem('apiKey');
    if (initialKey?.includes('sk-') && apiKey !== initialKey) {
      setApiKey(initialKey);
    }
  }, [apiKey]);
  
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
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <Box>
          {isAuthenticated &&<Sidebar setApiKey={setApiKey} routes={routes} /> }
          <Box
            pt={{ base: '60px', md: '100px' }}
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
            {isAuthenticated && <Portal>
              <Box>
                <AdminNavbar
                  setApiKey={setApiKey}
                  onOpen={onOpen}
                  logoText={'Horizon UI Dashboard PRO'}
                  brandText={getActiveRoute(routes, pathname)}
                  secondary={getActiveNavbar(routes, pathname)}
                  socket={socket}
                />
              </Box>
            </Portal> }
            <Box
              mx="auto"
              p={{ base: '20px', md: '30px' }}
              pe="20px"
              minH="100vh"
              pt="50px"
            >
              <ChildComponent Component={Component} pageProps={pageProps} apiKey={apiKey} socket={socket} setIsAuthenticated={setIsAuthenticated} />
            </Box>
          </Box>
        </Box>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default App;
