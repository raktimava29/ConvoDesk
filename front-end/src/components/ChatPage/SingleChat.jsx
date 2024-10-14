import { Box, IconButton, Text } from "@chakra-ui/react";
import { ChatState } from "./ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../Extras/ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal"
import { getSender, getSenderFull } from "./ChatLogic";

export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();

  return (
    <>
      {selectedChat ? (
        <Text
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          width="100%"
          fontFamily="suse"
          display="flex"
          justifyContent="space-between"
        >
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat(null)}
          />
          {(!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName}
                  <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </>
              ))}
        </Text>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="86vh"> 
          <Text fontSize={{base:"3xl" , lg:"5xl"}} fontFamily="suse">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}
