import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EditAccountPage.css"; // นำเข้าไฟล์ CSS

const EditAccountPage = () => {
  const { id } = useParams();
  const [account, setAccount] = useState({});
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (id && Object.keys(editedData).length === 0) {
      // เรียก API เพื่อดึงข้อมูลบัญชีที่ต้องการแก้ไข
      axios
        .get(`https://mylogin.up.railway.app/account/${id}`)
        .then((response) => {
          setAccount(response.data);
          setEditedData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching account data:", error);
        });
    }
  }, [id, editedData]);

  const handleSave = () => {
    if (account._id && Object.keys(editedData).length > 0) {
      axios
        .put(
          `https://mylogin.up.railway.app/account/update/${account._id}`,
          editedData
        )
        .then((response) => {
          console.log(response.data);

          toast.success("บันทึกสำเร็จ", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((error) => {
          console.error("Error updating account:", error);

          // ตรวจสอบสถานะ HTTP 400 และแสดง Toast ข้อผิดพลาด
          if (error.response && error.response.status === 400) {
            toast.error("ชื่อผู้ใช้ หรือ อีเมลถูกใช้แล้ว", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
    }
  };

  return (
    <div>
      <h2>แก้ไขบัญชี</h2>
      <div>
        <label>ชื่อผู้ใช้:</label>
        <input
          className="input-text"
          type="text"
          value={editedData.username || ""}
          onChange={(e) =>
            setEditedData({ ...editedData, username: e.target.value })
          }
        />
      </div>
      <div>
        <label>อีเมล:</label>
        <input
          className="input-text"
          type="text"
          value={editedData.email || ""}
          onChange={(e) =>
            setEditedData({ ...editedData, email: e.target.value })
          }
        />
      </div>
      <ToastContainer />
      <button className="edit-button" onClick={handleSave}>
        บันทึก
      </button>
    </div>
  );
};

export default EditAccountPage;
