import React, { useState, useRef, useEffect, useContext } from "react";
import "./ProfileUpdate.css";
import { assets } from "../../assets/assets.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../lib/upload.js";
import { AppContext } from "../../context/appContext.jsx";

export default function ProfileUpdate() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [prevImg, setPrevImg] = useState("");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserData } = useContext(AppContext);

  const fileRef = useRef();

  const profileUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!prevImg && !image) {
      toast.error("Upload profile photo!");
      return
    }
    const docRef = doc(db, "users", uid);
    if (image) {
      const imgURL = await upload(image);
      console.log(imgURL);
      setPrevImg(imgURL);
      await updateDoc(docRef, {
        avatar: imgURL,
        bio: bio,
        name: name,
      });
      toast.success("Updated successfully");
    } else {
      await updateDoc(docRef, {
        bio: bio,
        name: name,
      });
      toast.success("Updated successfully");
    }
    const snap = await getDoc(docRef);
    setUserData(snap.data());
    setLoading(false);
    navigate("/chat");
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImg(docSnap.data().avatar);
        }
        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <div className="profile">
      <div className="overlay">
        <div className="profile-container">
          <form onSubmit={profileUpdate}>
            <h2>Profile Update</h2>
            <label htmlFor="avatar">
              <input
                type="file"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
                accept=".png, .jpg, .jpeg"
                hidden
                ref={fileRef}
              />
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : prevImg
                    ? prevImg
                    : assets.blankProfile
                }
                className="profilePicture"
                alt="profilePhoto"
                onClick={() => {
                  fileRef.current.click();
                }}
              />
            </label>
            <input
              type="text"
              placeholder="Your name"
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            />
            <textarea
              placeholder="Profile bio"
              required
              onChange={(e) => {
                setBio(e.target.value);
              }}
              value={bio}
            ></textarea>
            <button type="submit">{loading ? "Loading..." : "Save"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
