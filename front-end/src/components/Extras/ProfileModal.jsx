import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

export default function ProfileModal({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton 
                  icon={<ViewIcon />} 
                  onClick={onOpen} 
                  colorScheme="gray"
                  bg={colorMode === "dark" ? "gray.800" : "white"}
                _hover={colorMode === "dark" ? "gray.800" : "white"}
                 />
      )}

      <Modal size={{ base: "xs", md: "lg" }} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={{ base: "30px", md: "50px" }}
            fontFamily="suse"
            display="flex"
            justifyContent="center"
          >
            {user ? user.name : "Unknown User"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDirection="column"
            mb={{ base: "2", md: "5" }}
          >
            <Text fontSize={{ base: "25px", md: "30px" }} fontFamily="suse">
              Email: {user ? user.email : "No email available"}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
