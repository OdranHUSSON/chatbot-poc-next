import { useToast } from '@chakra-ui/react';

export const useClipboard = () => {
  const toast = useToast();

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      // Use modern clipboard API if available
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
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";  // Prevent scrolling to the bottom of the page
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand('copy');
        toast({
          title: "Text copied to clipboard!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Failed to copy text. Try manually.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.error("Failed to copy text using execCommand: ", err);
      }

      document.body.removeChild(textarea);
    }
  };

  return { handleCopy };
};
