import { Button, FormControl, FormLabel, Input, useToast, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

interface ChatFormProps {
  id: string;
}

const ChatAdmin: React.FC<ChatFormProps> = ({ id }) => {
  console.log("ChatAdmin", id);
  const [chat, setChat] = useState({ id: id, name: "", description: "", isPrivate: false, additionalContext: {} });
  const toast = useToast();
  const { colorMode } = useColorMode();

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await axios.get(`/api/chats/${id}`);
        setChat(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast({
            title: "Chat not found.",
            description: "You can create it using this form.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "An error occurred.",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchChat();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.put(`/api/chats/${id}`, chat);
      toast({
        title: "Chat updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/chats/${id}`);
      toast({
        title: "Chat deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const inputColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' }
  );
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          value={chat.name}
          onChange={(e) => setChat({ ...chat, name: e.target.value })}
          colorScheme={colorMode === "dark" ? "teal" : undefined}
          color={inputColor}
          _placeholder={placeholderColor}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Input
          value={chat.description}
          onChange={(e) => setChat({ ...chat, description: e.target.value })}
          colorScheme={colorMode === "dark" ? "teal" : undefined}
          color={inputColor}
          _placeholder={placeholderColor}
        />
      </FormControl>
      <Button type="submit" colorScheme={colorMode === "dark" ? "teal" : undefined}>
        Update
      </Button>
    </form>
  );
};

export default ChatAdmin;
