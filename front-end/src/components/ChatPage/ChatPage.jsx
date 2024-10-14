import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "./ChatBox";
import MyChats from "./MyChats";
import SideDrawer from "../Extras/SideDrawer";
import { ChatState } from "./ChatProvider";

export default function Chatpage() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user,selectedChat } = ChatState();

  return (
    <>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        height={"100vh"}
        padding="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </>
  );
}