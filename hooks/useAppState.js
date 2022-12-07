import React, { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";

export const useAppState = (onBackground = null, onForeground = null) => {
  const appState = useRef(AppState.currentState);

  const handleAppStateChange = (nextAppState) => {
    if (appState.current === "background" && nextAppState === "active") {
      // App has come to the foreground!
      if (onForeground) {
        onForeground();
      }
    }
    if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
      if (onBackground) {
        onBackground();
      }
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      // AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);
};
