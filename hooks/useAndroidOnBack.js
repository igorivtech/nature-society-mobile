import React, { useEffect } from "react";
import { BackHandler, Platform } from "react-native";
import useIsMounted from "ismounted";

export const useAndroidOnBack = (onBack) => {
  const isMounted = useIsMounted();
  useEffect(() => {
    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (onBack != null && isMounted?.current) {
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
