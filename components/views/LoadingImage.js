import React, { memo, useEffect, useCallback, useState, useRef } from "react";
import { View, StyleSheet, Animated, Easing, Image } from "react-native";
import { colors } from "../../values/colors";

export const LoadingImage = memo(({ source, style }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (animating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.5,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
            duration: 750,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
            duration: 750,
          }),
        ])
      ).start();
    } else {
      opacity.stopAnimation();
    }
  }, [animating]);

  const onLoadStart = useCallback(() => {
    setAnimating(true);
  }, []);
  const onLoadEnd = useCallback(() => {
    setAnimating(false);
    Animated.timing(imageOpacity, {
      toValue: 1,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
      duration: 300
    }).start();
  }, []);

  return (
    <View style={styles.container(style)}>
      <Animated.View style={styles.background(opacity)} />
      <Animated.Image
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        style={styles.image(imageOpacity)}
        source={source}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  image: (opacity) => ({
    ...StyleSheet.absoluteFill,
    opacity,
    overflow: 'hidden'
  }),
  container: (style) => ({
    ...style,
    backgroundColor: "white",
    overflow: 'hidden'
  }),
  background: (opacity) => ({
    ...StyleSheet.absoluteFill,
    opacity,
    backgroundColor: colors.imageBg,
    overflow: 'hidden'
  }),
});
