import { useEffect } from "react";
import * as Linking from "expo-linking";
import { SAVE_DEEP_LINK_ID } from "../context/userReducer";
import { useServer } from "./useServer";
import { convertServerPlaces } from "./helpers";

export const useDeepLink = (dispatch) => {
  const { getPlace } = useServer();

  const handleQueryParams = (queryParams) => {
    if (queryParams != null && queryParams.id != null) {
      getPlace(queryParams.id).then((place) => {
        if (place != null) {
          dispatch({
            type: SAVE_DEEP_LINK_ID,
            payload: convertServerPlaces([place])[0],
          });
        }
      });
    }
  };

  const handleUrl = ({ url }) => {
    const { queryParams } = Linking.parse(url);
    handleQueryParams(queryParams);
  };

  useEffect(() => {
    Linking.parseInitialURLAsync().then((url) => {
      if (url != null && url.queryParams != null) {
        handleQueryParams(url.queryParams);
      }
    });
    Linking.addEventListener("url", handleUrl);
    return () => {
      Linking.removeEventListener("url", handleUrl);
    };
  }, []);
};
