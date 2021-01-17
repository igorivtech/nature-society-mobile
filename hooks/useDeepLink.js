import { useEffect } from "react";
import * as Linking from "expo-linking";
import { SAVE_DEEP_LINK_ID } from "../context/userReducer";
import { useServer } from "./useServer";
import { convertServerPlaces } from "./helpers";
import * as Location from 'expo-location';
import { isStandalone } from "../values/consts";

export const useDeepLink = (dispatch) => {
  const { getPlace } = useServer();

  const handleQueryParams = (queryParams) => {
    if (queryParams != null && queryParams.id != null) {
      Promise.all([
        Location.getLastKnownPositionAsync({}),
        getPlace(queryParams.id)
      ]).then((results) => {
        const location = results[0];
        const place = results[1];
        if (place != null) {
          dispatch({
            type: SAVE_DEEP_LINK_ID,
            payload: convertServerPlaces([place], location?.coords)[0],
          });
        }
      });
    }
  };

  const handleUrl = ({ url }) => {
    const idInArray = Linking.parse(url).path.split('/showPlace/').filter(e=>e != '');
    if (idInArray.length === 1) {
      handleQueryParams({
        id: idInArray[0]
      });
    }
  };

  useEffect(() => {
    // if (isStandalone) {
    // } else {
      Linking.parseInitialURLAsync().then((url) => {
        if (url != null && url.path != null) {
          handleUrl({url: url.path});
        }
      });
      Linking.addEventListener("url", handleUrl);
      return () => {
        Linking.removeEventListener("url", handleUrl);
      };
    // }
  }, []);
};
