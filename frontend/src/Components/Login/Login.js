"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../API/auth";
import "./Login.css";

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt with:", { username, password, rememberMe });

    const user = await loginUser(username, password);
    console.log("Backend Response:", user);

    if (user) {
      if (user?._id) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user?._id);
        localStorage.setItem("userType", user?.type);
        // localStorage.setItem("username", user?.userName);
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        console.log("LoginUser:", user)
        navigate("/home", { replace: true });
      } else {
        alert("Invalid credentials");
      }
    } else {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-image-container">
          <img src="/login-pic.png" alt="Login illustration" className="login-image" />
        </div>
      </div>
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h1>Welcome to SocialApp</h1>
            <p>Please Login to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="Email">Email</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <div className="login-footer"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
