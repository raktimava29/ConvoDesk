import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Stack,
  Tooltip,
  Menu,
  MenuList,
  MenuButton,
  MenuDivider,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
  Skeleton,
  useDisclosure,
  useToast,
  Button,
  Avatar,
  IconButton,
  useColorMode,
  useColorModeValue,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { ChatState } from "../ChatPage/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserListItem from "./UserListItem";
import { getSender } from "../ChatPage/ChatLogic";
import NotificationBadge, { Effect } from "react-notification-badge";

export default function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const navigateTo = useNavigate();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("black", "white");

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem("notifications"));
    if (storedNotifications) {
      setNotification(storedNotifications);
    }
  }, [setNotification]);

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
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
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
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
    } finally {
      setLoadingChat(false);
    }
  };

  const clearNotification = (notif) => {
    const updatedNotifications = notification.filter((n) => n !== notif);
    setNotification(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const handleNotificationClick = (notif) => {
    setSelectedChat(notif.chat);
    clearNotification(notif);
  };

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notification));
  }, [notification]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigateTo("/");
  };

  return (
    <>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      p={{ base: "4px 6px", md: "5px 10px" }}
      borderWidth="3px"
      bg={bgColor} 
      color={textColor}
    >
      <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen} fontSize={{ base: "xs", md: "md" }}>
          <i className="fas fa-search"></i>
          <Text display={{ base: "none", md: "inline" }} ml={6}>
            Search
          </Text>
        </Button>
      </Tooltip>

        <Text fontSize={{ base: "2xl", md: "4xl" }} fontFamily="suse" fontWeight="600">
          ConvoDesk
        </Text>

      <HStack spacing={{ base: 2, md: 4 }}>
          <IconButton
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              bg={colorMode === "light" ? "white" : "gray.800"}
              size={{ base: "sm", md: "lg" }} 
              isRound
            />
        <Menu>
          <MenuButton>
            <NotificationBadge count={notification.length} effect={Effect.SCALE} />
            <BellIcon fontSize={{ base: "md", md: "2xl" }} mt={-1} />
          </MenuButton>
          <MenuList>
            {notification.length === 0 ? "No New Messages" : notification.map((notif) => (
              <MenuItem key={notif._id} onClick={() => handleNotificationClick(notif)}>
                {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} bg={bgColor} _hover={bgColor} _active={bgColor}>
            <Avatar size={{ base: "xs", md: "sm" }} cursor="pointer" name={user.name} />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Box>

    {/* SEARCH DRAWER */}
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent maxWidth={{ base: "80vw", md: "400px" }}>
        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
        <DrawerBody>
        <VStack align="stretch">
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            width="100%"
            fontSize={{ base: "sm", md: "md" }}
          />
          <Button
            width="30%"
            onClick={handleSearch}
            bg={colorMode === "light" ? "blue.500" : "blue.300"}
            color="white"
            _hover={{ bg: colorMode === "light" ? "blue.600" : "blue.400" }}
            alignSelf="flex-start"
            mb={2}
            mt={2}
          >
            Go
          </Button>
        </VStack>


          {loading ? (
            <Skeleton height="30px" my={2} />
          ) : (
            searchResult?.map((user) => (
              <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
            ))
          )}
          {loadingChat && <Spinner />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
    </>
  );
}
