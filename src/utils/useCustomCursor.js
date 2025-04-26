import { useEffect, useState } from "react";
import '../components/components.css';

export const useCustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const cursorSetting = document.cookie
      .split("; ")
      .find(row => row.startsWith("accessibility="));
    
    if (cursorSetting) {
      const parsed = JSON.parse(decodeURIComponent(cursorSetting.split("=")[1]));
      setShowCursor(parsed.custom_cursor);
    }

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (showCursor) {
      document.body.style.cursor = "none";
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      document.body.style.cursor = "auto";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "auto";
    };
  }, [showCursor]);

  return { mousePosition, showCursor };
};