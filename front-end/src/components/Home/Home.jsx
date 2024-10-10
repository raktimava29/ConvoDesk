import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
  } from "@chakra-ui/react";
import Signup from "./Signup";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
    const navigateTo = useNavigate();

    useEffect(() => {
        const info = JSON.parse(localStorage.getItem("userInfo"))
        if(!info){
            navigateTo('/')
        }
    },[navigateTo])

return (
    <Container maxW="xl" centerContent>
    <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px" 
    >
        <Text fontSize="4xl" textAlign="center" fontFamily="suse" fontWeight="600">
        Chatify
        </Text>
    </Box>
    <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
        <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
            <Login/>
            </TabPanel>
            <TabPanel>
            <Signup/>
            </TabPanel>
        </TabPanels>
        </Tabs>
    </Box>
    </Container>
);
}
  