import { Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

interface ChatFormProps {
  id: string;
}

const ChatAdmin: React.FC<ChatFormProps> = ({ id }) => {
  console.log("ChatAdmin", id)
  const [chat, setChat] = useState({ id: id, name: "", description: "", isPrivate: false, additionalContext: {} });
  const toast = useToast();

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

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={chat.name} onChange={(e) => setChat({ ...chat, name: e.target.value })} />
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Input value={chat.description} onChange={(e) => setChat({ ...chat, description: e.target.value })} />
      </FormControl>
      <Button type="submit">Update</Button>
      <Button colorScheme="red" onClick={handleDelete}>
        Delete
      </Button>
    </form>
  );
};

export default ChatAdmin;
