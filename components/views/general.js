import React from "react";
import { StyleSheet, View } from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";

export const TapView = ({ onPress, numberOfTaps = 1 }) => {
  const tapClose = (event) => {
    if (event.nativeEvent.state === State.END) {
      onPress();
    }
  };
  return (
    <TapGestureHandler
      numberOfTaps={numberOfTaps}
      style={StyleSheet.absoluteFill}
      onHandlerStateChange={tapClose}
    >
      <View style={StyleSheet.absoluteFill} />
    </TapGestureHandler>
  );
};
