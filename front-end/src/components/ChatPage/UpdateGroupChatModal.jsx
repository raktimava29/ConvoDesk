import { EditIcon } from "@chakra-ui/icons";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, useDisclosure, FormControl, Input, useToast, Box, IconButton, Spinner, useBreakpointValue
} from "@chakra-ui/react";  
import axios from "axios";
import { useState } from "react";
import { ChatState } from "./ChatProvider";
import UserBadgeItem from "../Extras/UserBadgeItem";
import UserListItem from "../Extras/UserListItem";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

export default function UpdateGroupChatModal({ fetchMessages, fetchAgain, setFetchAgain }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const modalSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md", lg: "lg" });
  const { colorMode, toggleColorMode } = useColorMode();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load search results.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`/api/chat/reGroup`, { chatId: selectedChat._id, chatName: groupChatName }, config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setRenameLoading(false);
      setGroupChatName("");
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({ title: "User already in group!", status: "error", duration: 5000, isClosable: true, position: "bottom" });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({ title: "Only admins can add users!", status: "error", duration: 5000, isClosable: true, position: "bottom" });
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`/api/chat/addGroup`, { chatId: selectedChat._id, userId: userToAdd._id }, config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({ title: "Error Occurred!", description: error.response.data.message, status: "error", duration: 5000, isClosable: true, position: "bottom" });
    } finally {
      setLoading(false);
      setGroupChatName(""); 
    }
  };

  const handleRemove = async (userToRemove) => {
    if (!selectedChat || !user) {
      toast({
        title: "Chat or user data is missing!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  
    // Prevent non-admins from removing other users
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      toast({
        title: "Only admins can remove users!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  
    try {
      setLoading(true);
  
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
  
      const response = await axios.put(`/api/chat/remGroup`, {
        chatId: selectedChat._id,
        userId: userToRemove._id,
      }, config);
  
      // console.log("API Response:", response.data);
  
      if (response.data.message === "Group deleted") {
        // Remove the deleted group from the chat list
        setChats((prevChats) => prevChats.filter((chat) => chat._id !== selectedChat._id));
  
        setSelectedChat(null);
        setFetchAgain(!fetchAgain);
  
        toast({
          title: "Group Deleted",
          description: "This group no longer exists.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
  
        return;
      }
  
      // Check if admin was removed and update the frontend state
      if (selectedChat.groupAdmin._id === userToRemove._id) {
        toast({
          title: "Admin Removed",
          description: `${userToRemove.name} was the admin. A new admin has been assigned.`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        toast({
          title: "User Removed",
          description: `${userToRemove.name} has been removed from the group.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
  
      // If the current user was removed, clear the chat
      if (userToRemove._id === user._id) {
        setSelectedChat(null);
      } else {
        setSelectedChat(response.data);
      }
  
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (error) {
      console.error("Error:", error.response?.data || error);
    } finally {
      setLoading(false);
      setGroupChatName("");
    }
  };
  
  return (
    <>
      <IconButton 
        display={{ base: "flex" }} 
        icon={<EditIcon />}
        onClick={onOpen} 
        colorScheme="gray"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        _hover={colorMode === "dark" ? "gray.800" : "white"}
       />
      <Modal onClose={onClose} isOpen={isOpen} isCentered size={modalSize}>
        <ModalOverlay />
        <ModalContent p={{ base: 3, md: 5 }}>
          <ModalHeader fontSize={{ base: "24px", md: "30px", lg: "35px" }} textAlign="center">
            {selectedChat?.chatName || "Group Chat"}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat?.users?.map((u) => (
                <UserBadgeItem key={u._id} user={u} admin={selectedChat.groupAdmin} handleFunction={() => handleRemove(u)} />
              ))}
            </Box>

            <FormControl display="flex" flexDir={{ base: "column", md: "row" }} alignItems={"center"} gap={2} width="100%">
              <Input placeholder="Chat Name" value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
              <Button variant="solid" colorScheme="teal" isLoading={renameloading} onClick={handleRename}>
                Update
              </Button>
            </FormControl>

            <FormControl mt={2} width="100%">
              <Input placeholder="Add User to group" onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>

            {loading ? <Spinner size="lg" mt={3} /> : searchResult.map((user) => (
              <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
            ))}
            <Button onClick={() => handleRemove(user)} colorScheme="red" mt={2} width="50%">
              Leave Group
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
