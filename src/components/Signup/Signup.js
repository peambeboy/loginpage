import React, { useEffect, useState } from "react"; // Import useState instead of Component
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import "./Signup.css";

const usernamePattern = /^[a-zA-Z0-9]+$/;

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isUsernameSpecialChars, setIsUsernameSpecialChars] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const { username, email, password, confirmPassword } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // ตรวจสอบความถูกต้องของชื่อผู้ใช้
    if (name === "username") {
      const isValid = usernamePattern.test(value);
      setIsUsernameValid(isValid);

      // ตรวจสอบความถูกต้องของอักษรพิเศษ
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      setIsUsernameSpecialChars(hasSpecialChars);
    }
  };
  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.post(
        "https://mylogin.up.railway.app/signup/checkUsername",
        {
          username,
        }
      );

      return response.data.isUsernameTaken;
    } catch (error) {
      console.error("Error checking username availability:", error);
      return true;
    }
  };

  useEffect(() => {
    if (username) {
      // เมื่อมีการเปลี่ยนแปลงใน username
      // ให้ทำการตรวจสอบความถูกต้องของชื่อผู้ใช้
      checkUsernameAvailability(username).then((isTaken) => {
        setIsUsernameValid(!isTaken); // อัปเดต state เพื่อแสดงผลความถูกต้องของชื่อผู้ใช้
      });
    }
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("โปรดกรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (!usernamePattern.test(username)) {
      toast.error(
        "ชื่อผู้ใช้ต้องประกอบด้วยตัวพิมพ์เล็กพิมพ์ใหญ่ภาษาอังกฤษและตัวเลขเท่านั้น"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!isUsernameValid) {
      toast.error("ชื่อผู้ใช้นี้ถูกใช้แล้ว");
      return;
    }

    try {
      const response = await axios.post(
        "https://mylogin.up.railway.app/signup",
        {
          username,
          email,
          password,
        }
      );

      if (response.status === 200) {
        toast.success("สมัครสมาชิกสำเร็จ");
        console.log("สมัครสมาชิกสำเร็จ:", response.data);
        navigate("/");
      } else {
        toast.error("เกิดข้อผิดพลาดในการสมัครสมาชิก");
        console.error("เกิดข้อผิดพลาดในการสมัครสมาชิก:", response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.errorMessage);
      } else {
        toast.error("เกิดข้อผิดพลาดในการสมัครสมาชิก");
        console.error("เกิดข้อผิดพลาดในการสมัครสมาชิก:", error);
      }
    }
  };

  return (
    <div>
      <h1>สมัครสมาชิก</h1>
      <form className="signform" onSubmit={handleSubmit}>
        <div className="input-container-signup">
          <label>ชื่อผู้ใช้:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
          />
          {!isUsernameValid && (
            <div className="error-icon">
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>ชื่อผู้ใช้นี้ถูกใช้แล้ว</span>
            </div>
          )}
          {isUsernameSpecialChars && (
            <div className="error-icon">
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>ชื่อผู้ใช้ไม่สามารถมีอักษรพิเศษได้</span>
            </div>
          )}
        </div>
        <div className={`input-container-signup`}>
          <label>อีเมล:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className={`input-container-signup`}>
          <label>รหัสผ่าน:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div className={`input-container-signup`}>
          <label>ยืนยันรหัสผ่าน:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
          {password !== confirmPassword && (
            <div className="error-icon">
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>รหัสผ่านไม่ตรงกัน</span>
            </div>
          )}
        </div>
        <button type="submit">สมัครสมาชิก</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
