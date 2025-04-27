import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Divider } from "@react-md/divider";
import { useNavigate } from "react-router-dom";
import "./components.css";
import CustomCursor from "../utils/CustomCursor";
import useAccessibilitySettings from "../utils/useAccessibilitySettings";

export default function Layout({ children, messages }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [internalShowModal, setInternalShowModal] = React.useState(false);

  const accessibilitySettings= useAccessibilitySettings();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const showCustomCursor = accessibilitySettings?.custom_cursor;
  const textSize = accessibilitySettings?.text_size || "medium";
  const notificationType = accessibilitySettings?.data?.notification_type || 'default';

  const handleMessagesClick = () => {
    setInternalShowModal(true);
    // if (setShowModal) setShowModal(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (showCustomCursor) {
      document.body.style.cursor = "none";
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      document.body.style.cursor = "auto";
    }

    const body = document.body;

    switch(textSize) {
      case 'small':
        body.style.fontSize ="12px";
        break;
      case 'medium':
        body.style.fontSize = "16px";
        break;
      case 'large':
        body.style.fontSize = "20px";
        break;
      default:
        body.style.fontSize = "16px";
        break;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "auto";
    };
  }, [showCustomCursor, textSize]);

  useEffect(() => {
    if (notificationType === 'modal') {
      setInternalShowModal(true);
    }
  }, [notificationType]);

  // Flashing effect for notifications
  const [flashing, setFlashing] = useState(false);
  useEffect(() => {
    let interval;
    if (notificationType === 'flashing') {
      interval = setInterval(() => {
        setFlashing((prev) => !prev);
      }, 500); // Flashes every 500ms
    }
    return () => clearInterval(interval);
  }, [notificationType]);

  return (
    <div style={{ display: "flex" }}>
      <div className="sidebar-container">
        <Sidebar>
          <Menu>
            <h1>@One4All</h1>
            <br />
            <SubMenu label="Overview">
              <MenuItem onClick={() => navigate("/Home")}> Summary </MenuItem>
              <MenuItem> Custom View </MenuItem>
            </SubMenu>
            <br />
            <Divider />
            <br />
            <MenuItem onClick={handleMessagesClick}>
              Messages{" "}
              <span
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  borderRadius: "9999px",
                  padding: "2px 8px",
                  fontSize: "0.75rem",
                  marginLeft: "8px",
                  fontWeight: "bold",
                }}
              >
                {messages.length}
              </span>
            </MenuItem>
            <MenuItem onClick={() => navigate("/savings")}> Savings </MenuItem>
            <MenuItem onClick={() => navigate("/insights")}>
              {" "}
              Insights{" "}
            </MenuItem>
            <MenuItem onClick={() => navigate("/payments")}>
              {" "}
              Payments{" "}
            </MenuItem>
            <br />
            <Divider />
            <MenuItem onClick={() => navigate("/settings")}>
              {" "}
              Settings{" "}
            </MenuItem>
            <div className="menu-spacer">
              <Divider />
              <MenuItem> Help </MenuItem>
              <MenuItem> Contact Us </MenuItem>
              <br />
              <MenuItem
                onClick={async () => {
                  try {
                    await fetch("http://localhost:4000/logout", {
                      method: "POST",
                      credentials: "include",
                    });
                    navigate("/");
                  } catch (error) {
                    console.error("Logout failed:", error);
                  }
                }}
              >
                {" "}
                Log Out{" "}
              </MenuItem>
            </div>
          </Menu>
        </Sidebar>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>{children}</div>

      {(notificationType === 'default' || notificationType === 'flashing') && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "10px 20px",
            backgroundColor: "#ffcc00",
            color: "black",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
            fontWeight: "bold",
            display: flashing ? "none" : "block", // Hide if flashing
          }}
        >
          You have new messages!
        </div>
      )}

      {/* Modal Notification */}
      {internalShowModal && notificationType === 'modal' && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              minWidth: "320px",
              maxWidth: "500px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginBottom: "16px" }}>Messages</h2>
            <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
              {messages.map((msg, idx) => (
                <li key={idx} style={{ marginBottom: "10px" }}>
                  {msg}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setInternalShowModal(false)}
              style={{
                marginTop: "20px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCustomCursor && (
        <CustomCursor mousex={mousePosition.x} mousey={mousePosition.y} />
      )}
    </div>
  );
}
