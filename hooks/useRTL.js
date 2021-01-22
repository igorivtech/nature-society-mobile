import { useState, useEffect } from "react";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";

export const useRTL = () => {
  const [loadingRTL, setLoading] = useState(true);

  useEffect(() => {
    if (I18nManager.isRTL) {
      try {
        I18nManager.forceRTL(false);
      } catch (e) {console.error(e)}
      try {
        I18nManager.allowRTL(false);
      } catch (e) {console.error(e)}
      try {
        setTimeout(() => {
          Updates.reloadAsync().then(()=>{}).finally(()=>{});
        }, 200);
      } catch (e) {console.error(e)}
    } else {
      setLoading(false);
    }
  }, []);

  return { loadingRTL };
};
