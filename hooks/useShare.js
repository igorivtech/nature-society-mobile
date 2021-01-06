import React from "react";
import { Platform, Share } from "react-native";
import * as Linking from 'expo-linking';

export const appWebsite = "https://dev.d39prj9hryszvg.amplifyapp.com/"

export const useShare = () => {
  const share = async (title, url, id) => {
    try {






      const result = await Share.share({
        ...Platform.select({
          ios: {
            message: title,
            url,
          },
          android: {
            message: `${title}\n${url}`
          }
        }),
        title
      }, {
        ...Platform.select({
          ios: {},
          android: {
            dialogTitle: `${title}\n${url}`
          }
        })
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
