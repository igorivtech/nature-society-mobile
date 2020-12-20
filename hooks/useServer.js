import React, { useRef } from "react";
import { convertServerPlaces } from "./helpers";

export const useServer = () => {

  const loadingPlaces = useRef(false);

  const getPlaces = async (coordinate, location, radius) => {
    if (loadingPlaces.current) {
      return;
    }
    loadingPlaces.current = true;
    try {
      const response = await fetch(
        `https://jwfyhvynee.execute-api.us-east-1.amazonaws.com/dev/getAll?lat=${coordinate.latitude}&lng=${coordinate.longitude}&skip=0&limit=10&radius=${1000 * radius}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
    //   console.log({data});
      loadingPlaces.current = false;
      return convertServerPlaces(data, location);
    } catch (error) {
      console.log({error});
      loadingPlaces.current = false;
      return [];
    }
  };

  return { getPlaces };
};

//
