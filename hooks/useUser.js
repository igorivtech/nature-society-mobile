import { useEffect, useState } from "react";
import Amplify, { Auth } from "aws-amplify";
import { SAVE_ACHIEVEMENTS, SAVE_SETTINGS, SAVE_TOKEN, SAVE_USER } from "../context/userReducer";
import { DEFAULT_ACHIEVEMENTS, SERVER_ACHIEVEMENTS } from "../values/consts";
import { useServer } from "./useServer";

export const ATTRIBUTE_POINTS = "custom:points";
export const ATTRIBUTE_NUM_OF_REPORTS = "custom:numOfReports";

export const useUser = (dispatch) => {
  const [loadingUser, setLoadingUser] = useState(false);
  const {getSettings} = useServer();
  useEffect(() => {
    (async () => {
      try {
        setLoadingUser(true);
        const cognitoUser = await Auth.currentAuthenticatedUser({
          // bypassCache: true,
        })
        const settings = await getSettings();
        if (settings) {
          dispatch({
            type: SAVE_SETTINGS,
            payload: settings
          })
        }
        dispatch({
          type: SAVE_TOKEN,
          payload: getToken(cognitoUser),
        });
        dispatch({
          type: SAVE_USER,
          payload: cognitoToUser(cognitoUser),
        });
        dispatch({
          type: SAVE_ACHIEVEMENTS,
          payload: SERVER_ACHIEVEMENTS
        })
      } catch (error) {
        console.log(err) || console.log(null);
      } finally {
        setLoadingUser(false);
      }
    })()
  }, []);
  return { loadingUser };
};

export const cognitoToUser = (cognitoUser) => {
  const { attributes } = cognitoUser;
  const user = {
    name: attributes.name,
    email: attributes.email,
    points: parseInt(attributes[ATTRIBUTE_POINTS]),
    numOfReports: parseInt(attributes[ATTRIBUTE_NUM_OF_REPORTS]),
    achievements: DEFAULT_ACHIEVEMENTS,
    lastAchievement: "חקלאי",
  };
  if (attributes.picture) {
    user.image = attributes["picture"];
  }
  return user;
};

const getToken = (cognitoUser) => {
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
