import React, { useEffect } from "react";
import * as Analytics from "expo-firebase-analytics";

export const useAnalytics = () => {
  useEffect(() => {
    // Analytics.logEvent("ButtonTapped", {
    //   name: "settings",
    //   screen: "profile",
    //   purpose: "Opens the internal settings",
    // }).then(v=>console.log({v})).catch(e=>console.log({e}));
  }, []);
};
