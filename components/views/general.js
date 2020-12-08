import React from "react";
import { StyleSheet, View } from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";

export const TapView = ({ onPress }) => {
  const tapClose = (event) => {
    if (event.nativeEvent.state === State.END) {
      onPress();
    }
  };
  return (
    <TapGestureHandler
      style={StyleSheet.absoluteFill}
      onHandlerStateChange={tapClose}
    >
      <View style={StyleSheet.absoluteFill} />
    </TapGestureHandler>
  );
};
