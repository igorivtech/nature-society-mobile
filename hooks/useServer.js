import React, { useRef, useState } from "react";
import { convertServerPlaces } from "./helpers";

export const BASE_URL = `https://ddaflq8r2a.execute-api.eu-central-1.amazonaws.com/prod`;

export const useServer = () => {

  const [loadingSearch, setLoadingSearch] = useState(false);
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
        url = `${BASE_URL}/searchByName?lat=${0}&lng=${0}&text=${name}`;
      }
      const response = await fetch(
        url,
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

  let abortController = useRef();
  const getPlaces = (searchId, coordinate, location, radius, limit = 10) => {
    // if (abortController?.current) {
    //   abortController.current.abort();
    // }
    // abortController.current = new AbortController();
    return new Promise((resolve) => {
      fetch(
        `${BASE_URL}/getAll?lat=${coordinate.latitude}&lng=${coordinate.longitude}&skip=0&limit=${limit}&radius=${1000 * radius}`,
        { 
          method: "GET",
          // signal: abortController.current.signal,
        }
      ).then(response => response.json())
        .then(data=>{
          if (Array.isArray(data)) {
            resolve({
              searchId,
              pp: convertServerPlaces(data, location, true)
            })
          } else {
            resolve(null);
          }
        })
        .catch(err=>{
          console.error("PLACES ERROR:", err);
          resolve(null)
        })
    })
  };

  const [loadingGetPlace, setLoadingGetPlace] = useState(false);
  const getPlace = (id) => {
    return new Promise((resolve) => {
      setLoadingGetPlace(true);
      fetch(
        `${BASE_URL}/getSite?id=${id}`,
        { 
          method: "GET",
        }
      ).then(response => response.json())
        .then(data=>{
          resolve(data);
        })
        .catch(err=>{
          resolve(null)
        })
        .finally(()=>setLoadingGetPlace(false));
    })
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

  const sendUsageTime = async (token, data) => {
    if (token == null) {
      return; // ?
    }
    try {
      await fetch(`${BASE_URL}/insertTime`, {
        method: "POST",
        body: JSON.stringify({
          duration: data.duration/1000,
          startDate: data.startDate
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      });
      // console.log("SUCCESS SENDING USAGE TIME", data);
    } catch (error) {
      // console.log("ERROR SENDING USAGE TIME", error);
    }
  }

  const sendReport = async (token, reportData) => {
    if (!token) {
      return null;
    }
    try {
      const response = await fetch(`${BASE_URL}/newReport`, {
        method: "POST",
        body: JSON.stringify({report: reportData}),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: token
        }
      });
      const content = await response.json();
      return {content};
    } catch (error) {
      console.log({error});
      return {error};
    }
  }

  return { getPlaces, getSettings, searchPlaces, loadingSearch, getExplorePlaces, loadingMorePlaces, sendUsageTime, sendReport, getPlace, loadingGetPlace };
};

//
