import React, { useState, useEffect, useRef } from "react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import {ASK_PUSH} from "../context/userReducer"
import AsyncStorage from "@react-native-community/async-storage";
import { Auth } from "aws-amplify";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const LAST_SAVED_TOKEN = "LAST_SAVED_TOKEN"
const LAST_SENT_TOKEN = "LAST_SENT_TOKEN"

export const useNotifications = (state, dispatch) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const {askPush, token} = state;

  useEffect(()=>{
    if (expoPushToken != null) {
      AsyncStorage.setItem(LAST_SAVED_TOKEN, expoPushToken).then(()=>{
        handleToken();
      })
    } else {
      handleToken();
    }
  }, [expoPushToken, token])

  const handleToken = () => {
    if (token != null) {
      Promise.all([
        AsyncStorage.getItem(LAST_SAVED_TOKEN),
        AsyncStorage.getItem(LAST_SENT_TOKEN)
      ]).then(results => {
        const lastSavedToken = results[0];
        const lastSentToken = results[1];
        if (lastSavedToken != null && lastSavedToken != lastSentToken) {
          // send lastSavedToken
          AsyncStorage.setItem(LAST_SENT_TOKEN, lastSavedToken).then(()=>{});
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
      console.log(notification);
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return {};
};

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
