import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { View, StyleSheet, Animated, Easing, Image } from "react-native";
import { colors } from "../../values/colors";

export const LoadingImage = ({ source, style }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (animating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.5,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
            duration: 500
          }),
          Animated.timing(opacity, {
            toValue: 1,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
            duration: 500
          }),
        ])
      ).start();
    } else {
      opacity.stopAnimation();
    }
  }, [animating]);

  const onLoad = () => {
    setAnimating(true);
  };
  const onLoadEnd = () => {
    setAnimating(false);
  };

  return (
    <View style={[style, { backgroundColor: 'white' }]}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFill,
          opacity,
          backgroundColor: colors.imageBg,
        }}
      />
      <Image
        onLoad={onLoad}
        onLoadEnd={onLoadEnd}
        style={{
          ...StyleSheet.absoluteFill,
        }}
        source={source}
      />
    </View>
  );
};
