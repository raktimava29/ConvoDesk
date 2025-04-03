import { Box, Button, Center, FormControl, IconButton, Input, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";  
import { ChatState } from "./ChatProvider";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModal from "../Extras/ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal"
import { getSender, getSenderFull } from "./ChatLogic";
import { useEffect, useState } from "react";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import io from "socket.io-client"
import Lottie from 'react-lottie'
import animationData from '../Extras/Typing.json'
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

// const ENDPOINT = "http://localhost:5000/";
const ENDPOINT = "https://convodesk.onrender.com/";
var socket,selectedChatCompare;

export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
  const { isOpen,onOpen,onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [loadingC, setLoadingC] = useState(false);
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sockConnect , setSockConnect] = useState(false);
  const [typing,setTyping] = useState(false);
  const [isTyping,setIsTyping] = useState(false);
  
  const toast = useToast();

  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.200", "gray.700"); 
  const textColor = useColorModeValue("black", "white"); 
  const inputBg = useColorModeValue("#E0E0E0", "gray.600"); 
  const modalBg = useColorModeValue("white", "gray.800"); 
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const typingHandler = (e) => {
    const inputValue = e.target.value;
    setNewMessage(inputValue);
  
    if (!sockConnect) return;
  
    if (inputValue === "") {
      if (typing) {
        socket.emit("NotTyping", selectedChat._id);
        setTyping(false);
      }
      return;
    }
  
    if (!typing) {
      setTyping(true);
      socket.emit("Typing", selectedChat._id);
    }
  
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("NotTyping", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("NotTying", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`, 
          },
        };
        
        const { data } = await axios.post(
          "/api/msg",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        ); 
        setNewMessage("");
        socket.emit("Recieved",data);
        setMessage([...message, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/msg/${selectedChat._id}`,
        config
      );
      
      setMessage(data);
      setLoading(false);

      socket.emit("Join", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
  
  useEffect(() => {
    if (user) {
      setSelectedChat(null);
      setMessage([]);         
      setLoadingC(true);       
  
      setTimeout(() => {
        setLoadingC(false);
      }, 1000);
    }
  }, [user, setSelectedChat]);
  
  

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection",() =>{
      setSockConnect(true);
    })
    socket.on('Typing', () => {
      setIsTyping(true);
    })
    socket.on('NotTyping', () => {
      setIsTyping(false);
    })
  })

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  },[selectedChat])

  useEffect(() => {
    socket.on("Message Recieved", (messageRecieved) => {
      if (!selectedChatCompare ||selectedChatCompare._id !== messageRecieved.chat._id) {
        if (!notification.includes(messageRecieved)) {
          setNotification([messageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessage([...message, messageRecieved]);
      }
    });
  })

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="suse"
            display="flex"
            justifyContent="space-between"
            color={textColor} 
          >
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
              bg={colorMode === "dark" ? "gray.800" : "white"}
              _hover={colorMode === "dark" ? "gray.800" : "white"}
            />

            
            {message && (!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
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
                  colorScheme="gray"
                  bg={colorMode === "dark" ? "gray.800" : "white"}
                _hover={colorMode === "dark" ? "gray.800" : "white"}
                 />
                <Modal size={{ base: "xs", md: "lg" }} key={user} onClose={onClose} isOpen={isOpen} isCentered>
                  <ModalOverlay />
                  <ModalContent bg={modalBg} borderColor={borderColor}>
                    <ModalHeader
                      fontSize="40px"
                      fontFamily="suse"
                      display="flex"
                      justifyContent="center"
                      color={textColor}
                    >
                      Group Members:
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                      {selectedChat.users.map((user) => (
                        <Box key={user} textAlign="center" mb={4}>
                          <Text as="b" fontSize={{ base: "25px", md: "30px" }} fontFamily="suse" color={textColor}>
                            {user.name}
                          </Text>
                          <Text fontSize={{ base: "20px", md: "27px" }} fontFamily="suse" color={textColor}>
                            Email: {user.email}
                          </Text>
                        </Box>
                      ))}
                    </ModalBody>
                    <ModalFooter>
                      <Button onClick={onClose} colorScheme="blue">Close</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            ))}
          </Text>
  
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg={bgColor}
            width="100%"
            height="100%"
            borderRadius="lg"
            overflow="hidden" // Prevents unexpected scroll jumps
          >
            {loading ? (
              <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Spinner size="xl" color={textColor} />
              </Box>
            ) : (
              <Box overflowY="auto" mb={2}>
                <ScrollableChat message={message} />
              </Box>
            )}

            <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={1}>
              <Input
                variant="filled"
                bg={inputBg}
                color={textColor}
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
                transition="background 0.3s ease"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="86vh">
          <Text fontSize={{ base: "3xl", lg: "5xl" }} fontFamily="suse" color={textColor}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}