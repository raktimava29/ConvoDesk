import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Spinner } from "@chakra-ui/react";
import { Button, useDisclosure, FormControl, Input, useToast, Box } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "./ChatProvider";
import UserBadgeItem from "../Extras/UserBadgeItem";
import UserListItem from "../Extras/UserListItem";

export default function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

// Clear selected users when modal closes
useEffect(() => {
  if (!isOpen) {
    setSelectedUsers([]);
  }
}, [isOpen, setSelectedUsers]);

  const handleGroup = (userToAdd) => { 
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the search results.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      const { data } = await axios.post(`/api/chat/group`, {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      }, config);
  
      setChats([data, ...chats]);
      onClose();
      
      toast({
        title: "New Group Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong.";
      
      toast({
        title: "Failed to Create the Group!",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  
  const onClose = () => {
    setSearchResult([]);
    closeModal(); 
  };

  return (
    <>
      <span onClick={onOpen} style={{ cursor: "pointer" }}>{children}</span>

      <Modal size={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={{ base: "24px", md: "35px" }}
            fontFamily="suse"
            textAlign="center"
          >
            Create Group
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody display="flex" flexDirection="column" alignItems="center">
            
            <FormControl mb={3} width="100%">
              <Input
                placeholder="Chat Name"
                onChange={(e) => setGroupChatName(e.target.value)}
                size={{ base: "sm", md: "md" }}
              />
            </FormControl>

            <FormControl mb={1} width="100%">
              <Input
                placeholder="Add Users"
                onChange={(e) => handleSearch(e.target.value)}
                size={{ base: "sm", md: "md" }}
              />
            </FormControl>

            <Box width="100%" display="flex" flexWrap="wrap" gap={2}>
              {selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
              ))}
            </Box>

            <Box width="100%" mt={2}>
              {loading ? (
                <Spinner size="md" />
              ) : (
                searchResult?.slice(0, 4).map((user) => (
                  <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button onClick={handleSubmit} colorScheme="blue" size={{ base: "sm", md: "md" }}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
