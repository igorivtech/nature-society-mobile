import React from "react";
import { Platform, Share } from "react-native";
import * as Linking from 'expo-linking';
import { isStandalone } from "../values/consts";
import Branch from './branch';

export const appWebsite = "https://dev.d39prj9hryszvg.amplifyapp.com/"

export const useShare = () => {
  const oldShare = async (title, id) => {
    try {
      const url = Linking.makeUrl('showPlace', {id})
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
    if (isStandalone) {
      try {
        const shareOptions = {
          messageHeader: title,
        };
        const branchUniversalObject = await Branch.createBranchUniversalObject(
          `place_${id}`,
          {
            title: title,
            metadata: {
              params: JSON.stringify({ id }),
            },
          }
        );
        await branchUniversalObject.showShareSheet(shareOptions);
      } catch (error) {
        alert(JSON.stringify(error));
      }
    } else {
      oldShare(title, id);
    }
  };

  return { share };
};
