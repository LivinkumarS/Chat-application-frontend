import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import LeftSideBar from "../../components/LeftSideBar/LeftSideBar";
import RightSideBar from "../../components/RightSideBar/RightSideBar";
import ChatBox from "../../components/ChatBox/ChatBox";
import { AppContext } from "../../context/appContext";

export default function Chat() {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData && chatData) setLoading(false);
  }, [userData, chatData]);

  return (
    <div className="chat">
      <div className="overly">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="chat-container">
            <LeftSideBar />
            <ChatBox />
            <RightSideBar />
          </div>
        )}
      </div>
    </div>
  );
}
