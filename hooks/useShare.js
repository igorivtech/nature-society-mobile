import React from "react";
import { Share } from "react-native";

export const useShare = () => {
  const share = async (title, message) => {
    try {
      const result = await Share.share({
        title,
        message,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return { share };
};
