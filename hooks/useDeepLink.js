import { useEffect } from "react";
import * as Linking from "expo-linking";
import { SAVE_DEEP_LINK_ID } from "../context/userReducer";
import { useServer } from "./useServer";
import { convertServerPlaces } from "./helpers";
import * as Location from "expo-location";
import { isStandalone } from "../values/consts";

export const useDeepLink = (dispatch) => {
  const { getPlace } = useServer();

  const handlePlaceId = (placeId) => {
    Promise.all([Location.getLastKnownPositionAsync({}), getPlace(placeId)]).then((results) => {
      const location = results[0];
      const place = results[1];
      if (place != null) {
        dispatch({
          type: SAVE_DEEP_LINK_ID,
          payload: convertServerPlaces([place], location?.coords)[0],
        });
      }
    });
  };

  const handleUrl = ({ url }) => {
    if (url == null) {
      return;
    }

    const idInArray = Linking.parse(url).path
      ? Linking.parse(url)
          .path.split("showPlace/")
          .filter((e) => e != "")
      : null;
    if (idInArray !== null && idInArray.length === 1) {
      handlePlaceId(idInArray[0].replace(/\\|\//g, ""));
    }
  };

  useEffect(() => {
    // if (isStandalone) {
    // } else {
    Linking.parseInitialURLAsync().then((url) => {
      if (url != null && url.path != null) {
        handleUrl({ url: url.path });
      }
    });
    Linking.addEventListener("url", handleUrl);
    return () => {
      // Linking.removeEventListener("url", handleUrl);
    };
    // }
  }, []);
};
