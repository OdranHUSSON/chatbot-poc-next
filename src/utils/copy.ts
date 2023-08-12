import { useToast } from "@chakra-ui/react";

export const useHandleCopy = () => {
  const toast = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Text copied to clipboard!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Failed to copy text. Try manually.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.error("Failed to copy text: ", err);
      });
  };

  return handleCopy;
};
