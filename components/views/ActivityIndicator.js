import React from "react";
import LottieView from "lottie-react-native";

export const ActivityIndicator = ({ style = {}, animating = true, color }) => {
  return (
    <LottieView
      style={[style, { height: 20, width: 20, opacity: animating ? 1 : 0 }]}
      source={require("../../assets/animations/buy_spin.json")}
      loop={true}
      resizeMode='contain'
      autoPlay={animating}
    />
  );
};