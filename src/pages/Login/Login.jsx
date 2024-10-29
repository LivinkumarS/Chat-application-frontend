import React, { useState } from "react";
import "./Login.css";
import { assets } from "../../assets/assets.js";
import { signup, login } from "../../config/firebase.js";

export default function Login() {
  const [currState, setCurrState] = useState("SignUp");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChangeState() {
    setCurrState((prev) => {
      if (prev === "SignUp") {
        return "LogIn";
      }
      return "SignUp";
    });
  }

  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    if (currState === "SignUp") {
      await signup(username, email, password);
    } else {
      await login(email, password);
    }
    setLoading(false);
  }

  return (
    <div className="login">
      <div className="overlay">
        <img src={assets.Logo} alt="chat-logo" className="logo" />
        <form onSubmit={handleSubmit} className="login-form">
          <h2>{currState}</h2>
          {currState === "SignUp" && (
            <input
              type="text"
              value={username}
              placeholder="User Name"
              className="form-input"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
            />
          )}
          <input
            type="email"
            value={email}
            placeholder="Email"
            className="form-input"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            className="form-input"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <button type="submit">Submit</button>
          <div className="login-forget">
            <p className="login-toggle">
              {currState === "SignUp"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <span onClick={handleChangeState}>
                {loading ? "Loading..." : "Click here"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
