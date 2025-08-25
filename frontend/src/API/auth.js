import axios from "axios";
import API_URL from "../Config";

export const loginUser = async (email, password) => {
  if (!email || !password) {
    alert("Please fill in both fields");
    return;
  }

  try {
    const response = await axios.put(`${API_URL}api/user/authorize`, { email, password });
    console.log("Login Success:", response.data);

    // ✅ Save user data in localStorage
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("userId", response.data.id);
    console.log("Response Data after Autherization:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    if (error.response?.status === 401) {
      alert("Invalid email or password");
    } else {
      alert("Something went wrong. Please try again later.");
    }

  }
};
