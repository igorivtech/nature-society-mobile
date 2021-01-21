import React, { useState, useEffect, useRef } from "react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import {ASK_PUSH, SAVE_NOTIFICATION} from "../context/userReducer"
import AsyncStorage from "@react-native-community/async-storage";
import { Auth } from "aws-amplify";
import { ATTRIBUTE_PUSH_TOKEN } from "./useUser";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const LAST_SENT_TOKEN = "LAST_SENT_TOKEN"

export const useNotifications = (state, dispatch) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const {askPush, user} = state;

  useEffect(()=>{
    handleToken();
  }, [expoPushToken, user])

  const handleToken = () => {
    if (user != null) {
      Promise.all([
        getExpoToken(),
        AsyncStorage.getItem(LAST_SENT_TOKEN)
      ]).then(async results => {
        const lastKnownToken = results[0];
        const lastSentToken = results[1];
        if (lastKnownToken != null && lastKnownToken != lastSentToken) {
          try {
            let attributes = {}
            attributes[ATTRIBUTE_PUSH_TOKEN] = lastKnownToken;
            let cognitoUser = await Auth.currentAuthenticatedUser({
              bypassCache: true,
            });
            let result = await Auth.updateUserAttributes(cognitoUser, attributes);
            if (result === 'SUCCESS') {
              console.log('saved push token');
              AsyncStorage.setItem(LAST_SENT_TOKEN, lastKnownToken).then(()=>{});
            } else {
              console.error('error saving push token with result', result);
            }
          } catch (error) {
            console.error('error saving push token', error);
          }
        }
      })
    }
  }

  useEffect(()=>{
    if (askPush) {
      dispatch({
        type: ASK_PUSH,
        payload: false
      })
      registerForPushNotificationsAsync().then((token) => {
        setExpoPushToken(token);
      });
    }
  }, [askPush])

  useEffect(() => {

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      // console.log(notification);
      // setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response?.notification?.request?.content?.data?.extraData;
        if (data != null) {
          dispatch({
            type: SAVE_NOTIFICATION,
            payload: data
          })
        }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

};

async function getExpoToken() {
  let token;
  if (Constants.isDevice) {
    const { status } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    if (status !== "granted") {
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    return null;
  }
  return token;
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(`expo push token: `, token);
  } else {
    // console.log("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export const shouldAskUser = async() => {
  let ask = false;
  if (Constants.isDevice) {
    const { status } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    ask = status === "undetermined";
  } 
  return ask;
}
