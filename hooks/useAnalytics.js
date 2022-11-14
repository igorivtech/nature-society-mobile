import React, { useEffect } from "react";
import * as Analytics from "expo-firebase-analytics";
import { Settings } from "react-native-fbsdk-next";

export const useAnalytics = () => {
  useEffect(() => {
    // Analytics.logEvent("ButtonTapped", {
    //   name: "settings",
    //   screen: "profile",
    //   purpose: "Opens the internal settings",
    // }).then(v=>console.log({v})).catch(e=>console.log({e}));
    //
    // Facebook.initializeAsync("139938011330970").then(() => {});
    // Settings.initializeSDK();
    // Settings.setAppID("139938011330970");
  }, []);
};
