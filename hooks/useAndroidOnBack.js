import React, { useEffect } from "react";
import { BackHandler, Platform } from "react-native";

export const useAndroidOnBack = (onBack) => {
  useEffect(() => {
    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (onBack != null) {
            onBack();
          }
          return true;
        }
      );
      return () => {
        if (Platform.OS === "android") {
          backHandler.remove();
        }
      };
    }
  }, []);
};
