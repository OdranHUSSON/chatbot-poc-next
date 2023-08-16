import { useToast, Box, Flex, Icon, Text, useColorModeValue, Table, Td, Th, Tr, Spinner, Badge } from '@chakra-ui/react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdContentCopy, MdFileCopy, MdShare, MdSave } from 'react-icons/md';

export const MarkdownComponents = {
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