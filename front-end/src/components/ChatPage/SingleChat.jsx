import { Box, Button, flexbox, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { ChatState } from "./ChatProvider";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModal from "../Extras/ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal"
import { getSender, getSenderFull } from "./ChatLogic";

export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const { isOpen,onOpen,onClose } = useDisclosure();
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
    <IconButton
          icon={<ViewIcon />}
          onClick={onOpen}
        />
        <Modal size={{base:"xs" , md:"lg"}} key={user} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="suse"
            display="flex"
            justifyContent="center"
          >
          Group Members:
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDirection="column"
          >
          {selectedChat.users.map((user) => (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" key={user}>
            <Text as='b' fontSize={{ base: "25px", md: "30px" }} fontFamily="suse" key={user}>
              {user.name}
              </Text>
              <Text fontSize={{ base: "20px", md: "27px" }} display="flex" flexDirection="row" fontFamily="suse" key={user}>
              Email: {user.email}
              </Text>
            </Box>
          ))}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
