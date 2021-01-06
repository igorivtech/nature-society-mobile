import { useEffect } from "react";
import * as Linking from "expo-linking";
import { SAVE_DEEP_LINK_ID } from "../context/userReducer";

export const useDeepLink = (state, dispatch) => {
  const handleUrl = ({ url }) => {
    const { queryParams } = Linking.parse(url);
    if (queryParams != null && queryParams.id != null) {
      dispatch({
        type: SAVE_DEEP_LINK_ID,
        payload: queryParams.id,
      });
    }
  };

  useEffect(() => {
    Linking.addEventListener("url", handleUrl);
    return () => {
      Linking.removeEventListener("url", handleUrl);
    };
  }, []);
};
