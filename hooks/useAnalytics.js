import React, { useEffect } from "react";
import * as Analytics from "expo-firebase-analytics";
import * as Facebook from "expo-facebook";

export const useAnalytics = () => {
  useEffect(() => {
    // Analytics.logEvent("ButtonTapped", {
    //   name: "settings",
    //   screen: "profile",
    //   purpose: "Opens the internal settings",
    // }).then(v=>console.log({v})).catch(e=>console.log({e}));
    //
    Facebook.initializeAsync({
      appId: "139938011330970",
    }).then(() => {});
  }, []);
};
