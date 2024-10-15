import { useState } from "react";
import { Box, Text, Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Menu, MenuList, MenuButton, Tooltip,  MenuDivider, MenuItem} from "@chakra-ui/react";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react";
import { Input, Spinner, Skeleton } from "@chakra-ui/react";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../ChatPage/ChatProvider";
import ProfileModal from "./ProfileModal"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserListItem from "./UserListItem";

export default function SideDrawer(){
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const navigateTo = useNavigate();
  const toast = useToast();

  const { user,setUser,selectedChat,setSelectedChat,chats,setChats } = ChatState();

  const {isOpen, onOpen, onClose} = useDisclosure();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigateTo("/");
  };

  return(
    <>
      <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px"
      borderWidth="5px"
    >
      <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <i className="fas fa-search"></i>
          <Text display={{ base: "none", md: "flex" }} px={4}>
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize="4xl" fontFamily="suse">
        Chatify
      </Text>
      <div>
      <Menu>
        <MenuButton p={1}>
          {/* <NotificationBadge
            count={notification.length}
            effect={Effect.SCALE}
          /> */}
          <BellIcon fontSize="2xl" m={1} />
        </MenuButton>
        <MenuList pl={2}>
          {/* {!notification.length && "No New Messages"}
          {notification.map((notif) => (
            <MenuItem
              key={notif._id}
              onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
              }}
            >
              {notif.chat.isGroupChat
                ? `New Message in ${notif.chat.chatName}`
                : `New Message from ${getSender(user, notif.chat.users)}`}
            </MenuItem>
          ))} */}
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
          <Avatar
            size="sm"
            cursor="pointer"
            name={user.name}
          />
        </MenuButton>
        <MenuList>
          <ProfileModal user={user}>
            <MenuItem>My Profile</MenuItem>
          </ProfileModal>
          <MenuDivider />
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </MenuList> 
      </Menu>
    </div>
    </Box>
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" flexDirection='column' pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                mt={5}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button width={100} mt={3} onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <Stack>
            {Array(13)
              .fill("")
              .map((_, index) => (
                <Skeleton
                  height={{ base: "20px", md: "30px" }}
                  key={index}
                />
              ))}
          </Stack>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            ) }
            {loadingChat && 
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
            }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}