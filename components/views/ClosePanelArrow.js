import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { globalStyles } from "../../values/styles";
import { EXIT_SIZE } from "../screens/ExploreScreen";

const images = {
  left: require("../../assets/images/close_panel_left.png"),
  right: require("../../assets/images/close_panel_right.png"),
  bottom: require("../../assets/images/close_panel_bottom.png"),
};

export const ClosePanelArrow = ({ direction, topHeight = 0, topMargin = 0 }) => {
  return (
    <View pointerEvents='none' style={styles[direction](topHeight, topMargin)}>
      <Image style={globalStyles.imageJustContain} source={images[direction]} />
    </View>
  );
};

const styles = StyleSheet.create({
  left: () => ({
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    top: 0,
    bottom: 0,
    right: -EXIT_SIZE,
    width: EXIT_SIZE
  }),
  right: () => ({
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    top: 0,
    bottom: 0,
    left: -EXIT_SIZE,
    width: EXIT_SIZE
  }),
  bottom: (height, marginTop) => ({
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    left: 0,
    right: 0,
    top: marginTop,
    height
  }),
});
