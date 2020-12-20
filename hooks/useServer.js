import React, { useRef, useState } from "react";
import { convertServerPlaces } from "./helpers";

const BASE_URL = `https://jwfyhvynee.execute-api.us-east-1.amazonaws.com/dev`;

export const useServer = () => {

  const [loadingSearch, setLoadingSearch] = useState(false);
  const loadingPlaces = useRef(false);
  const [loadingMorePlaces, setLoadingMorePlaces] = useState(false);

  const getExplorePlaces = async (location, page) => {
    if (loadingMorePlaces) {
      return;
    }
    try {
      setLoadingMorePlaces(true);
      const response = await fetch(
        `${BASE_URL}/getAll?lat=${location.latitude}&lng=${location.longitude}&skip=${page}&limit=10`,
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
      setLoadingMorePlaces(false);
    }
  };

  const searchPlaces = async (name, location) => {
    if (loadingSearch) {
      return;
    }
    try {
      setLoadingSearch(true);
      let url
      if (location) {
        url = `${BASE_URL}/searchByName?lat=${location.latitude}&lng=${location.longitude}&text=${name}`;
      } else {
        url = `${BASE_URL}/searchByName?text=${name}`;
      }
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

  const sendUsageTime = async (milliseconds) => {
    try {
      await fetch(`${BASE_URL}/insertTime`, {
        method: "POST",
        body: {
          time: milliseconds/1000
        }
      });
      // const data = await response.json();
      // return data;
    } catch (error) {
      // console.log({ error });
      // return null;
    }
  }

  const sendReport = async (token, data) => {
    if (!token) {
      return null;
    }
    try {
      const response = await fetch(`${BASE_URL}/report`, {
        method: "POST",
        body: data,
        headers: {
          Auth: token
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log({ error });
      return null;
    }
  }

  return { getPlaces, getSettings, searchPlaces, loadingSearch, getExplorePlaces, loadingMorePlaces, sendUsageTime, sendReport };
};

//
