import React, { useEffect, memo, useRef } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { height } from "../../../values/consts";

export const CenterMapButton = memo(({ onPress, userMarkerVisible }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: userMarkerVisible ? 0 : 1,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [userMarkerVisible]);
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
