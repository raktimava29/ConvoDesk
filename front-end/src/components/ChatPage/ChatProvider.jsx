import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export default function ChatProvider({children}){
    const [user,setUser] = useState();
    const [selectedChat,setSelectedChat] = useState(null);
    const [chats,setChats] = useState([]);
    const [notification,setNotification] = useState([]);
    const navigateTo = useNavigate();

    useEffect(() => {
        const info = JSON.parse(localStorage.getItem("userInfo"))
        setUser(info)
        if(!info){
            navigateTo('/');
        }
    },[navigateTo])
    
    return(
        <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats}}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext)
}
