import { useEffect, useState } from "react";
import Amplify, { Auth } from "aws-amplify";

export const useUser = (dispatch) => {
  const [loadingUser, setLoadingUser] = useState(false);
  useEffect(() => {
    setLoadingUser(true);
    Auth.currentAuthenticatedUser({
      // bypassCache: true,
    })
      .then((cognitoUser) => {
        console.log("LOGGED IN");
        console.log({ cognitoUser });
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
