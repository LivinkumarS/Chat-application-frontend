import React, { useContext, useState } from "react";
import "./LeftSideBar.css";
import { assets } from "../../assets/assets.js";
import { CiMenuKebab, CiSearch } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  getDocs,
  query,
  collection,
  where,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../config/firebase.js";
import { AppContext } from "../../context/appContext";
import { toast } from "react-toastify";

export default function LeftSideBar() {
  const [subMenu, setSubMenu] = useState(false);
  const {
    userData,
    chatData,
    chatUser,
    setChatUser,
    messagesId,
    setMessagesId,
  } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          await chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
      await updateDoc(doc(chatsRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
      setShowSearch(false);
      toast.success("User added to yout chat list")
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const setChat = async (item) => {
    setMessagesId(item.messageId);
    setChatUser(item);
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.Logo} alt="" className="logo" />
          <h5>Chat App</h5>
          <div className="menu" onClick={() => setSubMenu((prev) => !prev)}>
            <BsThreeDotsVertical />
            {subMenu && (
              <div className="sub-menu">
                <Link to={`/profile`}>Profile</Link>
                <hr />
                <p>SignOut</p>
              </div>
            )}
          </div>
        </div>
        <div className="ls-search">
          <CiSearch />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here..."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div className="friends" onClick={addChat}>
            <img src={user.avatar} alt="" />
            <div>
              <p>{user.name}</p>
              <span>
                last seen:{new Date(user.lastSeen).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : (
          chatData.map((item, index) => (
            <div
              onClick={() => {
                setChat(item);
              }}
              className="friends"
              key={index}
            >
              <img src={item.userData.avatar} alt="" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
