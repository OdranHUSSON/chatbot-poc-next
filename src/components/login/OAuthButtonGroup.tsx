import { Button, ButtonGroup, VisuallyHidden } from '@chakra-ui/react';
import { GitHubIcon, GoogleIcon, TwitterIcon } from './ProvidersIcons';
import { signIn } from "next-auth/react";

const providers = [
  { name: 'Google', icon: <GoogleIcon /> },
  // Add more providers here if needed
  // { name: 'GitHub', icon: <GitHubIcon /> },
  // { name: 'Twitter', icon: <TwitterIcon /> },
];

export const OAuthButtonGroup = () => (
  <ButtonGroup variant="secondary" spacing="4">
    {providers.map(({ name, icon }) => (
      <Button 
        key={name} 
        flexGrow={1}
        onClick={() => signIn(name.toLowerCase())}
      >
        <VisuallyHidden>Sign in with {name}</VisuallyHidden>
        {icon}
      </Button>
    ))}
  </ButtonGroup>
);
