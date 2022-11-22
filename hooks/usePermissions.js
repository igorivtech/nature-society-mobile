import { useEffect } from "react";
import { Linking } from "react-native";
import * as Location from "expo-location";
import { Camera } from "expo-camera";

export const askSettings = () => {
  // Camera.getCameraPermissionsAsync();
  Linking.openSettings();
  // Linking.openURL("app-settings:");
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
    Location.getForegroundPermissionsAsync();
  };

  return {
    askLocation,
    // locationPermission: permission,
  };
};
