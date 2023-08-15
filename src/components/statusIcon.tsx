import React from 'react';
import { Spinner, Box, Icon } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

const StatusComponent = ({ status }) => {
  let content;

  switch (status) {
    case 'ok':
      content = <CheckCircleIcon color="green.500" />;
      break;
    case 'loading':
      content = <Spinner color="orange.500" />;
      break;
    case 'error':
      content = <WarningIcon color="red.500" />;
      break;
    default:
      content = null;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
    >
      {content}
    </Box>
  );
};

export default StatusComponent;
