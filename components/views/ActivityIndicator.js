import React from "react";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

export const ActivityIndicator = ({ style = {}, animating = true, color }) => {
  return (
    <LottieView
      style={styles.lottie(style, animating)}
      source={require("../../assets/animations/buy_spin.json")}
      loop={true}
      resizeMode="contain"
      autoPlay={animating}
    />
  );
};

const styles = StyleSheet.create({
  lottie: (style, animating) => ({
    ...style,
    height: 20,
    width: 20,
    opacity: animating ? 1 : 0,
  }),
});
