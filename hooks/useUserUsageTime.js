import AsyncStorage from "@react-native-community/async-storage";
import React, { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useServer } from "./useServer";

const LAST_USAGE_TIME = 'LAST_USAGE_TIME'

export const useUserUsageTime = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const startTime = useRef();

  const {sendUsageTime} = useServer();

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      // App has come to the foreground!
      startTime.current = new Date();
      AsyncStorage.getItem(LAST_USAGE_TIME).then(stringData=>{
        AsyncStorage.removeItem(LAST_USAGE_TIME).then(()=>{});
        if (stringData != null) {
          const data = JSON.parse(stringData);
          if (data != null) {
            sendUsageTime(data);
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
        console.log("TRYING TO SAVE - GOD SAVE THE QUEEN");
        AsyncStorage.setItem(LAST_USAGE_TIME, JSON.stringify({
          duration: usage,
          endDate: endTime
        })).then(()=>console.log("SAVED"))
          .catch((err)=>console.log("DIDN'T SAVE, ", err))
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
