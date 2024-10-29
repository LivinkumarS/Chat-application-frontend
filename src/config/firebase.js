import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chat-application-3e250.firebaseapp.com",
  projectId: "chat-application-3e250",
  storageBucket: "chat-application-3e250.appspot.com",
  messagingSenderId: "289400416848",
  appId: "1:289400416848:web:a8f6a7d35b9060342f3f55",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {

  try {
    const responese = createUserWithEmailAndPassword(auth, email, password);
    const user = (await responese).user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey there, i'm using chat application!",
      lastSeen: Date.now(),
    });
    await setDoc(doc(db, "chats", user.uid), {
      chatData: [],
    });
  } catch (err) {
    console.error(err);
    toast(err.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    toast(err.code.split("/")[1].split("-").join(" "));
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
    toast(err.code.split("/")[1].split("-").join(" "));
  }
};

export { signup, login, logout, auth, db };
