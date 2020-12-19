import React, { useState } from "react";
import { convertServerPlaces } from "./helpers";

export const useServer = () => {
  const getPlaces = async (coordinate, radius) => {
    try {
      const response = await fetch(
        `https://jwfyhvynee.execute-api.us-east-1.amazonaws.com/dev/getAll?lat=${coordinate.latitude}&lng=${coordinate.longitude}&skip=0&limit=10&radius=${1000 * radius}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
    //   console.log({data});
      return convertServerPlaces(data);
    } catch (error) {
      console.log({error});
      return [];
    }
  };

  return { getPlaces };
};

//
