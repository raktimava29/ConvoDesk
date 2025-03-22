import { Box, Text, useColorModeValue } from "@chakra-ui/react";

export default function UserListItem({ user, handleFunction }) {
  const bgColor = useColorModeValue("#E8E8E8", "gray.700");
  const hoverBg = useColorModeValue("#38B2AC", "teal.500");
  const textColor = useColorModeValue("black", "white");

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg={bgColor}
      _hover={{
        background: hoverBg,
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color={textColor}
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
}
