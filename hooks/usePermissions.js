import * as Permissions from "expo-permissions";
import { useEffect } from "react";

export const useLocationPermissions = () => {
  const [permission, askPermission, getPermission] = Permissions.usePermissions(Permissions.LOCATION, {});

  useEffect(() => {
    console.log({ permission });
  }, [permission]);

  const askLocation = () => {
    askPermission();
  };

  return {
    askLocation,
    locationPermission: permission,
  };
};

export const useCameraPermissions = () => {
  const [permission, askPermission, getPermission] = Permissions.usePermissions(Permissions.CAMERA, {});

  useEffect(() => {
    console.log({ permission });
  }, [permission]);

  const askCamera = () => {
    askPermission();
  };

  return {
    askCamera,
    cameraPermission: permission,
  };
};

export const useGalleryPermissions = () => {
    const [permission, askPermission, getPermission] = Permissions.usePermissions(Permissions.CAMERA_ROLL, {});
  
    useEffect(() => {
      console.log({ permission });
    }, [permission]);
  
    const askGallery = () => {
      askPermission();
    };
  
    return {
      askGallery,
      galleryPermission: permission,
    };
  };
  