import React, { useEffect, memo, useRef } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { height, NAV_DURATION, NAV_DURATION_CLOSE } from "../../../values/consts";

export const CenterMapButton = memo(({ onPress, userMarkerVisible, progressVisible }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: userMarkerVisible ? 0 : 1,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [userMarkerVisible]);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: progressVisible ? 60 : 0,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
      // duration: progressVisible ? NAV_DURATION : NAV_DURATION_CLOSE
    }).start();
  }, [progressVisible]);

  return (
    <Animated.View style={styles.container(opacity, translateX)}>
      <TouchableOpacity onPress={onPress}>
        <Image source={require("../../../assets/images/center_map_icon.png")} />
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: (opacity, translateX) => ({
    transform: [{translateX}],
    opacity,
    position: "absolute",
    right: 13,
    bottom: height * 0.3,
  }),
});
