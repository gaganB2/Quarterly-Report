import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const username = localStorage.getItem("username");

  return (
    <div style={styles.container}>
      <h2>Welcome, {username || "Faculty"} 👋</h2>
      <p>You are logged in to the Faculty Dashboard.</p>
      <button style={styles.button} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    marginTop: "1rem",
    padding: "10px 20px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Dashboard;
