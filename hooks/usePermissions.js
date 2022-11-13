import { useEffect } from "react";
import { Linking } from "react-native";
import * as Location from "expo-location";

export const askSettings = () => {
  Linking.openURL("app-settings:");
};

export const useLocationPermissions = () => {
  // const [permission, askPermission, getPermission] = Permissions.usePermissions(Permissions.LOCATION, {});
  // const {} = await Location.
  // Location.
  useEffect(() => {
    // console.log({ permission });
  }, []);

  const askLocation = () => {
    // askPermission();
    Location.getBackgroundPermissionsAsync();
  };

  return {
    askLocation,
    // locationPermission: permission,
  };
};
