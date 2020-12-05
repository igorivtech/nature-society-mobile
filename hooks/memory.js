import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";

export const ONBOARDING_SHOWN_KEY = "ONBOARDING_SHOWN_KEY";

export const useOnboarding = () => {
  const [loadingOnboarding, setLoading] = useState(true);
  const [shown, setShown] = useState(false);

  useEffect(()=>{
    read();
  }, [])

  const read = () => {
    AsyncStorage.getItem(ONBOARDING_SHOWN_KEY).then((shown) => {
      setShown(shown !== null ? true : false);
      setLoading(false);
    });
  }

  return {shown, loadingOnboarding}
};
