import React from "react";
import { Platform, Share } from "react-native";
import * as Linking from 'expo-linking';
import { isStandalone } from "../values/consts";

export const appWebsite = "https://my.teva.org.il"

export const useShare = () => {
  const oldShare = async (title, id) => {
    try {
      // const url = Linking.makeUrl('showPlace', {id})
      const url = `${appWebsite}/showPlace/${id}`;
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

  const share = async (title, id) => {
    // if (isStandalone) {
      
    // } else {
      oldShare(title, id);
    // }
  };

  return { share };
};
