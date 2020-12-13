import * as Permissions from 'expo-permissions';
import { useEffect } from 'react';

export const useLocationPermissions = () => {

  const [permission, askPermission, getPermission] = Permissions.usePermissions(Permissions.LOCATION, { });

  useEffect(()=>{
      console.log({permission});
  }, [permission])

  const askLocation = (callback) => {
    askPermission();
  }

  return {
    askLocation,
    locationPermission: permission, 
  };
};
