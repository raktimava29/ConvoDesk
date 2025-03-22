import { Box, useColorMode } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { ChatState } from "./ChatProvider";

export default function Chatbox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();
  const { colorMode } = useColorMode(); // Get color mode

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      padding={3}
      height="86vh"
      width={{ base: "100vw", md: "62vw" }}
      borderRadius="lg"
      borderWidth="1px"
      background={colorMode === "light" ? "white" : "gray.800"} // Dynamic Background
      borderColor={colorMode === "light" ? "gray.300" : "gray.600"} // Dynamic Border
      transition="background 0.3s ease, border-color 0.3s ease" // Smooth Theme Transition
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}
