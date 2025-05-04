import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Divider } from "@react-md/divider";
import { useNavigate } from "react-router-dom";
import "./components.css";
import { textVide } from "text-vide";
import CustomCursor from "../utils/CustomCursor";
import "../components/components.css";
import useAccessibilitySettings from "../utils/useAccessibilitySettings";

export default function Layout({ children, messages }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [internalShowModal, setInternalShowModal] = React.useState(false);
  const accessibilitySettings = useAccessibilitySettings();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [flashing, setFlashing] = useState(false);
  const [textColour, setTextColour] = useState("#000000"); // Default: black text
  const [componentColour, setComponentColour] = useState("#ffffff"); // Default: white background
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const showCustomCursor = accessibilitySettings?.data?.custom_cursor;
  const textSize = accessibilitySettings?.data?.text_size || "medium";
  const notificationType =
    accessibilitySettings?.data?.notification_type || "default";
  const bionic_reading = accessibilitySettings?.data?.bionic_reading;

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

    // Text size settings
    switch (textSize) {
      case "small":
        body.style.fontSize = "12px";
        break;
      case "medium":
        body.style.fontSize = "16px";
        break;
      case "large":
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
    if (notificationType === "modal") {
      setInternalShowModal(true);
    }
  }, [notificationType]);

  // Read colours from cookies on mount
  useEffect(() => {
    const textColorFromCookie = accessibilitySettings?.data?.textColour;
    const componentColorFromCookie = accessibilitySettings?.data?.componentColour;

    if (textColorFromCookie) {
      setTextColour(decodeURIComponent(textColorFromCookie));
    }
    if (componentColorFromCookie) {
      setComponentColour(decodeURIComponent(componentColorFromCookie));
    }
  }, []);

  const handleMessagesClick = () => {
    setNotificationDismissed(true);
    setInternalShowModal(true);
  };

  useEffect(() => {
    let interval;
    if (notificationType === "flashing" && !notificationDismissed) {
      interval = setInterval(() => {
        setFlashing((prev) => !prev);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [notificationType, notificationDismissed]);

  const renderContent = () => {
    if (bionic_reading) {
      const bionicHTML = textVide(children, {});
      return <div dangerouslySetInnerHTML={{ __html: bionicHTML }} />;
    }
    return children;
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: componentColour,
        color: textColour,
        minHeight: "100vh",
      }}
    >
      <div className="sidebar-container">
        <Sidebar style={{ backgroundColor: componentColour }}>
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
                Log Out
              </MenuItem>
            </div>
          </Menu>
        </Sidebar>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>{renderContent()}</div>

      {!notificationDismissed && (
  <div
    style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "10px 20px",
      backgroundColor: "#ffcc00",
      color: textColour,
      borderRadius: "12px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      fontWeight: "bold",
      display: flashing ? "none" : "block",
    }}
  >
    You have new messages!
  </div>
)}

      {internalShowModal && notificationType === "modal" && (
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
              color: textColour,
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
