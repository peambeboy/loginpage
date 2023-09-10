import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { useNavigate } from "react-router-dom"; // แก้ไขการ import นี้

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate(); // เรียกใช้ hook useNavigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    try {
      const response = await axios.post(
        "https://mylogin.up.railway.app/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        const data = response.data;
        toast.success(data.message);
        onLoginSuccess();
        navigate("/account");
      }
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        toast.error(errorData.errorMessage);
      } else {
        toast.error("มีข้อผิดพลาดเกิดขึ้นในการเชื่อมต่อกับเซิร์ฟเวอร์");
        console.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์:", error);
      }
    }
  };

  return (
    <div className="login-container">
      <h1>เข้าสู่ระบบ</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>ชื่อผู้ใช้:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="input-container">
          <label>รหัสผ่าน:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <button type="submit" className="login-button">
          เข้าสู่ระบบ
        </button>
      </form>
      <ToastContainer pauseOnHover={false} />
    </div>
  );
}

export default Login;
