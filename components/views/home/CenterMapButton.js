import React, { useEffect, memo, useRef } from "react";
import { Image, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { height } from "../../../values/consts";

export const CenterMapButton = memo(({ onPress }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={styles.container(opacity)}>
      <TouchableOpacity>
        <Image source={require("../../../assets/images/center_map_icon.png")} />
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: (opacity) => ({
    opacity,
    position: "absolute",
    right: 13,
    bottom: height * 0.3,
  }),
});
