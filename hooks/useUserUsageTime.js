import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth } from "aws-amplify";
import React, { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useServer } from "./useServer";
import { ATTRIBUTE_LAST_USED_DATE } from "./useUser";

const LAST_USAGE_TIME = 'LAST_USAGE_TIME'

export const useUserUsageTime = (state) => {
  const appState = useRef(AppState.currentState);
  const startTime = useRef();

  const {sendUsageTime} = useServer();
  const {token} = state;
  const sent = useRef(false);

  useEffect(()=>{
    handleLastUse();
  }, [token])

  const handleLastUse = async () => {
    if (token != null && !sent.current) {
      try {
        let attributes = {}
        attributes[ATTRIBUTE_LAST_USED_DATE] = (new Date()).toUTCString();
        let cognitoUser = await Auth.currentAuthenticatedUser({
          bypassCache: true,
        });
        let result = await Auth.updateUserAttributes(cognitoUser, attributes);
        if (result === 'SUCCESS') {
          sent.current = true;
        }
      } catch (error) {}
    }
  }

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      // App has come to the foreground!
      startTime.current = new Date();
      // AsyncStorage.getItem(LAST_USAGE_TIME).then(stringData=>{
      //   AsyncStorage.removeItem(LAST_USAGE_TIME).then(()=>{});
      //   if (stringData != null) {
      //     const data = JSON.parse(stringData);
      //     if (data != null) {
            // sendUsageTime(token, data);
      //     }
      //   }
      // })
    }
    if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
      // App has gone to the background!
      if (startTime?.current) {
        const endTime = new Date();
        const usage = endTime - startTime.current;
        AsyncStorage.setItem(LAST_USAGE_TIME, JSON.stringify({
          duration: usage,
          startDate: startTime.current
        })).then(()=>{}).catch((err)=>console.log("DIDN'T SAVE USAGE TIME, ", err))
        startTime.current = null;
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
