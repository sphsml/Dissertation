import { useEffect, useState } from "react";

export default function useAccessibilitySettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const parseCookies = () => {
      return document.cookie.split(";").reduce((acc, cookie) => {
        const separatorIndex = cookie.indexOf("=");
        if (separatorIndex === -1) return acc;
        const name = cookie.slice(0, separatorIndex).trim();
        const value = cookie.slice(separatorIndex + 1).trim();
        acc[name] = value;
        return acc;
      }, {});
    };

    const cookies = parseCookies();

    if (cookies.accessibility) {
      try {
        const decoded = decodeURIComponent(cookies.accessibility);
        const accessibilityData = JSON.parse(decoded);
        setSettings(accessibilityData || {});
      } catch (error) {
        console.error("Error parsing accessibility cookie:", error);
        setSettings({});
      }
    } else {
      setSettings({});
    }
  }, []);

  return settings;
}