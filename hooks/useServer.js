import React, { useRef } from "react";
import { convertServerPlaces } from "./helpers";

const BASE_URL = `https://jwfyhvynee.execute-api.us-east-1.amazonaws.com/dev`;

export const useServer = () => {

  const loadingPlaces = useRef(false);

  const getPlaces = async (coordinate, location, radius) => {
    if (loadingPlaces.current) {
      return;
    }
    loadingPlaces.current = true;
    try {
      const response = await fetch(
        `${BASE_URL}/getAll?lat=${coordinate.latitude}&lng=${coordinate.longitude}&skip=0&limit=10&radius=${1000 * radius}`,
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

  const getSettings = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/settings`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log({error});
      return null;
    }
  };

  return { getPlaces, getSettings };
};

//
