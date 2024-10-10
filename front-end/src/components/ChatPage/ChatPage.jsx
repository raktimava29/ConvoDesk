import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "./Chatbox";
import MyChats from "./MyChats";
import SideDrawer from "../Extras/SideDrawer";
import { ChatState } from "./ChatProvider";

export default function Chatpage(){
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div className="w-full">
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}
