import React, { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useServer } from "./useServer";

export const useUserUsageTime = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const startTime = useRef();

  const {sendUsageTime} = useServer();

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      // App has come to the foreground!
      startTime.current = new Date();
    }
    if (appState === "active" && nextAppState.match(/inactive|background/)) {
      // App has gone to the background!
      if (startTime?.current) {
        const endTime = new Date();
        const usage = endTime - startTime.current;
        startTime.current = null;
        sendUsageTime(usage);
      }
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);
};
