import { Box, Button, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { ChatState } from "./ChatProvider";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModal from "../Extras/ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal"
import { getSender, getSenderFull } from "./ChatLogic";

export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const { onOpen } = useDisclosure();
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
          {selectedChat.isGroupChat ? (
  <>
    <Box display="flex" flexDirection="row" gap={4}>
      <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="suse">
        {selectedChat.chatName}
      </Text>
      <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
    <Box mt={2}>
  <Text fontSize="md" fontFamily="suse">Group Members:</Text>
  <Box display="flex" flexWrap="wrap" gap={2}>
    {selectedChat.users.map((user) => (
      <ProfileModal key={user._id} user={user}>
        <Button
          display="flex"
          alignItems="center"
          p={2}
          border="1px solid lightgray"
          borderRadius="md"
          fontSize="md"
          fontFamily="suse"
        >
          {user.name}
        </Button>
      </ProfileModal>
    ))}
  </Box>
</Box>

  </>
) : (
  <>
    {getSender(user, selectedChat.users)}
    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
  </>
)}

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
