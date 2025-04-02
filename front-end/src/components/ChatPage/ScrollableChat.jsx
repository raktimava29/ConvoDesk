import { Avatar, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "./ChatLogic";
import { ChatState } from "./ChatProvider";

export default function ScrollableChat({ message = [] }) {
  const { user } = ChatState();

  {/* Function to format date as DD/MM/YYYY */}
  const formatDate = (date) => {
    const msgDate = new Date(date);
    return msgDate.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  let lastDisplayedDate = null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        height: "100%",
        scrollBehavior: "smooth",
        padding: "10px",
      }}
    >
      <ScrollableFeed forceScroll>
        {message.map((m, i) => {
          const isUser = m.sender?._id === user._id;
          const showAvatar = isSameSender(message, m, i, user._id) || isLastMessage(message, i, user._id);
          const messageDate = formatDate(m.createdAt);

          {/*Show date only if it's different from the last one*/}
          const showDateHeader = messageDate !== lastDisplayedDate;
          lastDisplayedDate = messageDate;

          return (
            <div key={m._id}>
              {showDateHeader && (
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#fffff",
                    textAlign:"center",
                    padding:"20px"
                  }}
                >
                  {messageDate}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  marginBottom: isSameUser(message, m, i, user._id) ? "5px" : "15px",
                }}
              >
                {showAvatar && !isUser && (
                  <Tooltip label={m.sender?.name || "Unknown"} placement="bottom-start" hasArrow>
                    <Avatar
                      size="sm"
                      cursor="pointer"
                      name={m.sender?.name || "Unknown"}
                      src={m.sender?.pic}
                      style={{ marginRight: "8px", alignSelf: "flex-end" }}
                    />
                  </Tooltip>
                )}

                <div
                  style={{
                    maxWidth: "65%",
                    backgroundColor: isUser ? "#0889ff" : "#D3D3D3",
                    color: isUser ? "#ffffff" : "#252323",
                    padding: "10px 15px",
                    borderRadius: "18px",
                    wordBreak: "break-word",
                    fontSize: "16px",
                    display: "inline-block",
                    position: "relative",
                    minWidth: "fit-content",
                    marginLeft: isUser ? "0px" : showAvatar ? "5px" : "45px",
                    textAlign: "left",
                  }}
                >
                  <span>{m.content}</span>

                  {/* Timestamp */}
                  <div
                    style={{
                      fontSize: "10px",
                      color: isUser ? "#e0e0e0" : "#555",
                      textAlign: "right",
                      marginTop: "5px",
                      display: "block",
                    }}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </ScrollableFeed>
    </div>
  );
}
