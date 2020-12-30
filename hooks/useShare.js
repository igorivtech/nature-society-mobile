import React from "react";
import { Share } from "react-native";

export const useShare = () => {
  const share = async (title, url) => {
    try {
      const result = await Share.share({
        title,
        url,
      }, {
        subject: title
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("shared with activity type of result.activityType");
        } else {
          console.log("shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismissed");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return { share };
};
