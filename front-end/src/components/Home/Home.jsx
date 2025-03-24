import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useColorModeValue,
    Spinner,
    IconButton,
    useColorMode,
} from "@chakra-ui/react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./Signup"));

export default function Home() {
    const navigateTo = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { colorMode, toggleColorMode } = useColorMode(); // Dark mode toggle
    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("black", "white");

    useEffect(() => {
        if (!localStorage.getItem("userInfo")) {
            navigateTo('/');
        }
        setTimeout(() => setIsLoading(false), 1500);
    }, [navigateTo]);

    const tabContent = useMemo(() => (
        <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
                <Tab>Login</Tab>
                <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Suspense fallback={<Spinner size="lg" color="blue.500" />}>
                        <Login />
                    </Suspense>
                </TabPanel>
                <TabPanel>
                    <Suspense fallback={<Spinner size="lg" color="blue.500" />}>
                        <Signup />
                    </Suspense>
                </TabPanel>
            </TabPanels>
        </Tabs>
    ), []);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bg={bgColor}>
                <Box textAlign="center">
                    <Spinner size="xl" color="blue.500" />
                    <Text fontSize="lg" mt={4} fontWeight="bold">Loading ConvoDesk...</Text>
                </Box>
            </Box>
        );
    }

    return (
        <Container maxW="xl" centerContent>
            {/* Dark Mode Toggle Button */}
            <Box 
                position="absolute" 
                right={{ base: "2", md: "4" }}
                top={{ base: "2", md: "4" }}
                >
                <IconButton 
                    aria-label="Toggle dark mode"
                    icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                    onClick={toggleColorMode}
                    bg={colorMode === "light" ? "white" : "gray.800"}
                    size="lg"
                    isRound
                />
            </Box>

            <Box
                display="flex"
                justifyContent="center"
                p={3}
                bg={bgColor}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
                color={textColor}
                mt={20}
            >
                <Text fontSize="4xl" textAlign="center" fontFamily="suse" fontWeight="600">
                    ConvoDesk
                </Text>
            </Box>

            <Box bg={bgColor} color={textColor} w="100%" p={4} borderRadius="lg" borderWidth="1px">
                {tabContent}
            </Box>
        </Container>
    );
}
