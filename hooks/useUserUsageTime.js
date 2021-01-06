import AsyncStorage from "@react-native-community/async-storage";
import React, { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useServer } from "./useServer";

const LAST_USAGE_TIME = 'LAST_USAGE_TIME'

export const useUserUsageTime = (state) => {
  const [appState, setAppState] = useState(AppState.currentState);
  const startTime = useRef();

  const {sendUsageTime} = useServer();
  const {token} = state;

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      // App has come to the foreground!
      startTime.current = new Date();
      AsyncStorage.getItem(LAST_USAGE_TIME).then(stringData=>{
        AsyncStorage.removeItem(LAST_USAGE_TIME).then(()=>{});
        if (stringData != null) {
          const data = JSON.parse(stringData);
          if (data != null) {
            sendUsageTime(token, data);
          }
        }
      })
    }
    if (appState === "active" && nextAppState.match(/inactive|background/)) {
      // App has gone to the background!
      if (startTime?.current) {
        const endTime = new Date();
        const usage = endTime - startTime.current;
        startTime.current = null;
        AsyncStorage.setItem(LAST_USAGE_TIME, JSON.stringify({
          duration: usage,
          endDate: endTime
        })).then(()=>{}).catch((err)=>console.log("DIDN'T SAVE USAGE TIME, ", err))
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
