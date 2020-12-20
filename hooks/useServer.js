import React, { useRef, useState } from "react";
import { convertServerPlaces } from "./helpers";

const BASE_URL = `https://jwfyhvynee.execute-api.us-east-1.amazonaws.com/dev`;

export const useServer = () => {

  const [loadingSearch, setLoadingSearch] = useState(false);
  const loadingPlaces = useRef(false);

  const searchPlaces = async (name, location) => {
    if (loadingSearch) {
      return;
    }
    try {
      setLoadingSearch(true);
      console.log({location});
      const response = await fetch(
        `${BASE_URL}/searchByName?lat=${location.latitude}&lng=${location.longitude}&text=${name}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return convertServerPlaces(data, location);
    } catch (error) {
      console.log({ error });
      return [];
    } finally {
      setLoadingSearch(false);
    }
  };

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
      console.log({ error });
      loadingPlaces.current = false;
      return [];
    }
  };

  const getSettings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/settings`, {
        method: "GET",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log({ error });
      return null;
    }
  };

  return { getPlaces, getSettings, searchPlaces, loadingSearch };
};

//
