import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // นำเข้า React Toastify
import "react-toastify/dist/ReactToastify.css";
import "./AccountList.css";

const AccountList = () => {
  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    // เรียก API เพื่อดึงข้อมูลบัญชี
    axios.get("https://mylogin.up.railway.app/account").then((response) => {
      setAccountList(response.data);
    });
  }, []); // ใช้ค่าว่างใน dependency array เพื่อให้ useEffect ทำงานเฉพาะครั้งแรก

  const handleDelete = (id) => {
    if (id) {
      axios
        .delete(`https://mylogin.up.railway.app/account/delete/${id}`)
        .then((response) => {
          console.log(response.data);

          // หลังจากลบสำเร็จ ใช้ React Toastify เพื่อแสดงข้อความแจ้งเตือน
          toast.success("บัญชีถูกลบแล้ว", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          // หลังจากลบสำเร็จ อัปเดต state ของรายการบัญชี
          setAccountList((prevAccountList) =>
            prevAccountList.filter((account) => account._id !== id)
          );
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
        });
    }
  };

  return (
    <div className="account-list-container">
      <h2>รายการบัญชีทั้งหมด</h2>
      <ul className="account-list">
        {accountList.map((account) => (
          <li key={account._id} className="account-item">
            <strong>ชื่อผู้ใช้:</strong> {account.username}
            <br />
            <strong>อีเมล:</strong> {account.email}
            <div className="account-actions">
              <Link to={`/edit/${account._id}`} state={{ account }}>
                แก้ไข
              </Link>
              <button onClick={() => handleDelete(account._id)}>ลบ</button>
            </div>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default AccountList;
