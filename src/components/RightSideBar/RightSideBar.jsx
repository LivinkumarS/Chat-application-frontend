import React, { useContext } from "react";
import "./RightSideBar.css";
import { assets } from "../../assets/assets";
import { GoDotFill } from "react-icons/go";
import { signOut } from "firebase/auth";
import { logout } from "../../config/firebase";
import { AppContext } from "../../context/appContext";

export default function RightSideBar() {
  const { chatUser } = useContext(AppContext);

  return (
    <div className="rs">
      {chatUser?(<div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>
          {chatUser.userData.name}{" "}
          <span>
            <GoDotFill />
          </span>
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>):(
        <div className="rs-profile">
          <img src={assets.blankProfile} alt="" />
        </div>
      )}
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          <p className="empty">Empty</p>
        </div>
      </div>

      <button className="log-out" onClick={() => logout()}>
        LogOut
      </button>
    </div>
  );
}
