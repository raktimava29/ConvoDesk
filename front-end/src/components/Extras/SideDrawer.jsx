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
      <Box display="flex" justifyContent="space-between" alignItems="center" bg={bgColor} color={textColor} w="100%" p="5px 10px" borderWidth="3px">
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="4xl" fontFamily="suse" fontWeight="600">
          ConvoDesk
        </Text>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Dark Mode Toggle Button */}
          <Box>
              <IconButton
                  icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                  bg={colorMode === "light" ? "white" : "gray.800"}
                  size="lg"
                  isRound
              />
            </Box>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE} />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2} pr={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem key={notif._id} onClick={() => handleNotificationClick(notif)}>
                  {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              bg={useColorModeValue("white", "gray.800")} // Light mode: white, Dark mode: gray.700
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }} // Hover effect
              _focus={{ boxShadow: "none" }}
            >
              <Avatar size="sm" cursor="pointer" name={user.name} />
            </MenuButton>
            <MenuList bg={useColorModeValue("white", "gray.800")} borderColor={useColorModeValue("gray.200", "gray.600")}>
              <ProfileModal user={user}>
                <MenuItem _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem _hover={{ bg: useColorModeValue("red.100", "red.600") }} onClick={logoutHandler}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={colorMode === "light" ? "white" : "gray.800"} color={colorMode === "light" ? "black" : "white"}>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" flexDirection="column" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                mt={5}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg={colorMode === "light" ? "gray.100" : "gray.700"}
                color={colorMode === "light" ? "black" : "white"}
              />
              <Button width={100} mt={3} onClick={handleSearch} bg={colorMode === "light" ? "blue.500" : "blue.300"} color="white" _hover={{ bg: colorMode === "light" ? "blue.600" : "blue.400" }}>
                Go
              </Button>
            </Box>
            {loading ? (
              <Stack>
                {Array(13)
                  .fill("")
                  .map((_, index) => (
                    <Skeleton height={{ base: "20px", md: "30px" }} key={index} bg={colorMode === "light" ? "gray.200" : "gray.600"} />
                  ))}
              </Stack>
            ) : (
              searchResult?.map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
              ))
            )}
            {loadingChat && <Spinner thickness="4px" speed="0.65s" emptyColor={colorMode === "light" ? "gray.200" : "gray.600"} color={colorMode === "light" ? "blue.500" : "blue.300"} size="xl" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
