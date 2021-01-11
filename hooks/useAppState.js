import React, { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";

export const useAppState = (onBackground) => {
  const appState = useRef(AppState.currentState);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      // App has come to the foreground!
    }
    if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
      if (onBackground?.current) {
        console.log('onBackground?.current();');
        onBackground?.current();
      }
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);
};
