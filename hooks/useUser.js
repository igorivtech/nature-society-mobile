import { useEffect, useState } from "react";
import Amplify, { Auth } from "aws-amplify";
import { SAVE_USER } from "../context/userReducer";
import { DEFAULT_ACHIEVEMENTS } from "../values/consts";

export const useUser = (dispatch) => {
  const [loadingUser, setLoadingUser] = useState(false);
  useEffect(() => {
    setLoadingUser(true);
    Auth.currentAuthenticatedUser({
      // bypassCache: true,
    })
      .then((cognitoUser) => {
        dispatch({
            type: SAVE_USER,
            payload: cognitoToUser(cognitoUser)
        })
      })
      .catch((err) => {
        console.log(err) || console.log(null);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);
  return { loadingUser };
};

export const cognitoToUser = (cognitoUser) => {
  const { attributes } = cognitoUser;
  return {
    name: attributes.name,
    email: attributes.email,
    // image
    points: parseInt(attributes["custom:points"]),
    numOfReports: parseInt(attributes["custom:numOfReports"]),
    achievements: DEFAULT_ACHIEVEMENTS,
    lastAchievement: "חקלאי"
  };
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
