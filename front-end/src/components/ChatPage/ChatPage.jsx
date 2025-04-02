import { Box, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import { lazy, Suspense, useEffect, useState } from "react";
import { ChatState } from "./ChatProvider";

const Chatbox = lazy(() => import("./ChatBox"));
const MyChats = lazy(() => import("./MyChats"));
const SideDrawer = lazy(() => import("../Extras/SideDrawer"));

export default function Chatpage() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  const [isLoading, setIsLoading] = useState(true);

  // Colors based on dark/light mode
  const bgColor = useColorModeValue("gray.300", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const spinnerColor = useColorModeValue("blue.500", "cyan.300");

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        bg={bgColor}
      >
        <Box textAlign="center">
          <Spinner size="xl" color={spinnerColor} />
          <Text fontSize="lg" mt={4} fontWeight="bold" color={textColor}>
            Loading Chats...
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} color={textColor} minH="100vh">
      {user && (
        <Suspense fallback={<Spinner size="lg" color={spinnerColor} />}>
          <SideDrawer />
        </Suspense>
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        height="100vh"
        padding="10px"
      >
        {user && (
          <Suspense fallback={<Spinner size="lg" color={spinnerColor} />}>
            <MyChats fetchAgain={fetchAgain} />
          </Suspense>
        )}
        {user && (
          <Suspense fallback={<Spinner size="lg" color={spinnerColor} />}>
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </Suspense>
        )}
      </Box>
    </Box>
  );
}
