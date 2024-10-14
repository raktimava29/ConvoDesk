import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { ChatState } from "./ChatProvider"
export default function Chatbox({ fetchAgain, setFetchAgain }){
    const { selectedChat } = ChatState();
  
    return (
      <Box
        display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        alignItems="center"
        flexDirection="column"
        padding={3}
        height={"86vh"}
        background="white"
        width={{base:"100vw" ,md:"62vw"}}
        borderRadius="lg"
        borderWidth="1px"
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    );
  }
  