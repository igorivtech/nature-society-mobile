import { useEffect, useState } from "react";
import Amplify, { Auth } from "aws-amplify";
import { SAVE_SETTINGS, SAVE_TOKEN, SAVE_USER, SAVE_OFFLINE_USER } from "../context/userReducer";
import { useServer } from "./useServer";
import AsyncStorage from "@react-native-community/async-storage";
import { getExpoToken } from "./helpers";

export const ATTRIBUTE_POINTS = "custom:points";
export const ATTRIBUTE_NUM_OF_REPORTS = "custom:numOfReports";
export const ATTRIBUTE_UNLOCKED_PLACES = "custom:unlockedPlaces";
export const ATTRIBUTE_PUSH_TOKEN = "custom:pushToken";
export const ATTRIBUTE_LAST_USED_DATE = "custom:lastUsedDate";

export const OFFLINE_USER_KEY = 'OFFLINE_USER_KEY';

export const useUser = (dispatch) => {
  const [loadingUser, setLoadingUser] = useState(true);
  
  // const {getSettings} = useServer();
  useEffect(() => {
    Auth.currentAuthenticatedUser({
      // bypassCache: true,
    })
      .then((cognitoUser) => {
        const token = getToken(cognitoUser);
        dispatch({
          type: SAVE_TOKEN,
          payload: token,
        });
        dispatch({
          type: SAVE_USER,
          payload: cognitoToUser(cognitoUser),
        });
        // send token and date to Ron
      })
      .catch(async(error) => {
        const savedOfflineUser = await AsyncStorage.getItem(OFFLINE_USER_KEY);
        const user = JSON.parse(savedOfflineUser);
        if (savedOfflineUser != null && user != null) {
          dispatch({
            type: SAVE_OFFLINE_USER,
            payload: user
          })
        }
        getExpoToken().then(pushToken=>{
          if (pushToken != null) {
            // send pushToken and date to Ron
          }
        });
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);
  return { loadingUser };
};

export const dicToArray = (dic) => {
  let array = [];
  Object.keys(dic).forEach((key) => {
    if (isNumeric(key)) {
      array.push(parseInt(key));
    } else {
      array.push(key);
    }
  });
  return array;
};

const arrayToDic = (array) => {
  let dic = {};
  array.forEach((e) => {
    dic[`${e}`] = 1;
  });
  return dic;
};

function isNumeric(value) {
  return /^\d+$/.test(value);
}

export const cognitoToUser = (cognitoUser) => {
  const { attributes } = cognitoUser;
  let unlockedPlaces = JSON.parse(attributes[ATTRIBUTE_UNLOCKED_PLACES]);
  if (Array.isArray(unlockedPlaces)) {
    unlockedPlaces = arrayToDic(unlockedPlaces);
  }
  const user = {
    name: attributes.name,
    email: attributes.email,
    points: parseInt(attributes[ATTRIBUTE_POINTS]),
    numOfReports: parseInt(attributes[ATTRIBUTE_NUM_OF_REPORTS]),
    unlockedPlaces,
  };
  if (attributes.picture) {
    user.image = attributes["picture"];
  }
  return user;
};

export const getToken = (cognitoUser) => {
  const { signInUserSession } = cognitoUser;
  if (
    signInUserSession &&
    signInUserSession.accessToken &&
    signInUserSession.accessToken.jwtToken
  ) {
    return signInUserSession.accessToken.jwtToken;
  }
  return null;
};

// signInUserSession, accessToken, jwtToken

// "attributes": Object {
//     "custom:numOfReports": "0",
//     "custom:points": "0",
//     "email": "nimrodbens@gmail.com",
//     "email_verified": true,
//     "name": "Nimrod",
//     "sub": "efda898a-a161-4630-958a-3c48320b4ac1",
//   },

// try {
//   const settings = await getSettings();
//   if (settings) {
//     dispatch({
//       type: SAVE_SETTINGS,
//       payload: settings
//     })
//   }
// } catch (error) {
//   console.log(error) || console.log(null);
// }
