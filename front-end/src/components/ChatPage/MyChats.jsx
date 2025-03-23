import { Box, Stack, Text, Skeleton, Button, useToast, useColorModeValue , useColorMode } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "./ChatLogic";
import { ChatState } from "./ChatProvider";
import GroupChatModal from "./GroupChatModal";
import { AddIcon } from "@chakra-ui/icons";
import { color } from "framer-motion";

export default function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  // Dynamic colors for light and dark mode
  const bgColor = useColorModeValue("white", "gray.800");
  const boxBgColor = useColorModeValue("#F8F8F8", "gray.700");
  const selectedBg = useColorModeValue("#098aff", "blue.600");
  const { colorMode, toggleColorMode } = useColorMode();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      padding={3}
      bg={bgColor}
      width={{ base: "100vw", md: "35vw" }}
      height="86vh"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        paddingBottom={3}
        paddingX={3}
        fontSize={{ base: "23px", lg: "35px" }}
        fontFamily="suse"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
        <Button
          display="flex"
          fontSize={{ base: "20px", lg: "20px", md: "15px" }}
          rightIcon={<AddIcon/>}
        >
          Create Group
        </Button>
      </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        padding={3}
        bg={boxBgColor}
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? selectedBg : boxBgColor}
                color={selectedChat === chat ? colorMode === "light" ? "white" : "black" : colorMode === "light" ? "black" : "white"}
                paddingX={3}
                paddingY={2}
                borderRadius="lg"
                fontSize='lg'
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Stack>
            {Array(13)
              .fill("")
              .map((_, index) => (
                <Skeleton height={{ base: "20px", md: "30px" }} key={index} />
              ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
