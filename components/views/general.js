import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

export const TapView = ({ onPress, numberOfTaps = 1 }) => {
  const tapClose = () => {
    if (onPress != null) {
      onPress();
    }
  };
  return (
    <TouchableWithoutFeedback
      style={StyleSheet.absoluteFill}
      onPress={tapClose}
    >
      <View style={StyleSheet.absoluteFill} />
    </TouchableWithoutFeedback>
  );
};
