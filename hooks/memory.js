// import { AsyncStorage } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useEffect, useState } from "react";
export const ONBOARDING_SHOWN_KEY = "ONBOARDING_SHOWN_KEY";

export const useOnboarding = () => {
  const [loadingOnboarding, setLoading] = useState(true);
  const [shown, setShown] = useState(false);

  useEffect(()=>{
    read();
  }, [])

  const read = () => {
    AsyncStorage.getItem(ONBOARDING_SHOWN_KEY).then((shown) => {
      setShown(shown ?? false);
      setLoading(false);
    });
  }

  return {shown, loadingOnboarding}
};
