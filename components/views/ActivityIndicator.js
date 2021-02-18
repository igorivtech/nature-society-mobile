import React from "react";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

export const ActivityIndicator = ({ style = {}, animating = true, color, key = null }) => {
  return (
    <View key={key}>
      <LottieView
        style={styles.lottie(style, animating)}
        source={require("../../assets/animations/buy_spin.json")}
        loop={true}
        resizeMode="contain"
        autoPlay={animating}
      />
    </View>
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
