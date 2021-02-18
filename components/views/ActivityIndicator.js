import React from "react";
import LottieView from "lottie-react-native";
import { Animated, Easing, StyleSheet } from "react-native";
import { useRef } from "react";
import { useEffect } from "react";
import { memo } from "react";

export const ActivityIndicator = memo(({style = {}, animating = true, color, customKey = ""}) => {
  const opacity = useRef(new Animated.Value(animating ? 1 : 0)).current;
  useEffect(()=>{
    Animated.timing(opacity, {
      toValue: animating ? 1 : 0,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }, [animating]);
  return (
    <Animated.View style={styles.container(opacity)}>
      <LottieView
        key={customKey}
        style={styles.lottie(style)}
        source={require("../../assets/animations/buy_spin.json")}
        loop={true}
        resizeMode="contain"
        autoPlay={true}
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: (opacity) => ({
    opacity
  }),
  lottie: (style) => ({
    ...style,
    height: 20,
    width: 20,
  }),
});
