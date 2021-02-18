import React, { useEffect, useRef, memo } from "react";
import { View, Text, Pressable, Animated, Easing, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../../values/colors";
import { textStyles } from "../../../values/textStyles";
import * as Animatable from "react-native-animatable";
import {ActivityIndicator} from "../ActivityIndicator";

const images = {
  0: require("../../../assets/images/Explore.png"),
  1: require("../../../assets/images/Report.png"),
  2: require("../../../assets/images/Progress.png"),
};

const buttonAnimation = 300;

const SMALL_SCALE = 0.8;

const animations = {
  0: null,
  1: 'pulse',
  2: 'pulse'
}

const delays = {
  0: 0,
  1: 0,
  2: 0
}

const iterationDelay = {
  0: 0,
  1: 0,
  2: 0
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const OnboardingButton = memo(({ alpha, scale, index, selected, setIndex, doneVisible = false, transform, finished }) => {

  const opacity = useRef(new Animated.Value(selected ? 1 : 0.5)).current;
  const innerScale = useRef(new Animated.Value(selected ? 1 : 0.75)).current;

  useEffect(() => {
    if (finished) {
      Animated.parallel([
        Animated.timing(opacity, {
          useNativeDriver: true,
          toValue: 1,
          easing: Easing.inOut(Easing.ease),
          duration: 600
        }),
        Animated.timing(innerScale, {
          useNativeDriver: true,
          toValue: 1,
          easing: Easing.inOut(Easing.ease),
          duration: 600
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          useNativeDriver: true,
          toValue: selected ? 1 : 0.5,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(innerScale, {
          useNativeDriver: true,
          toValue: selected ? 1 : 0.75,
          easing: Easing.inOut(Easing.ease)
        }),
      ]).start()
    }
  }, [finished, selected]);

  const onPress = () => {
    if (setIndex != null) {
      if (doneVisible) {
        return;
      }
      setIndex(index);
    }
  };

  return (
    <AnimatedPressable onPress={onPress}>
      <Animated.View style={{
          opacity,
          transform: [{scale}]
        }}>
          <Animated.Image
            style={styles.buttonContainer(alpha, innerScale)}
            source={images[index]}
          />
        </Animated.View>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  buttonContainer: (opacity, scale) => ({
    opacity,
    transform: [{ scale }],
  })
})

export const CoolButton = memo(({ textStyle = {}, title, onPress, loading = false }) => {

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(()=>{
    Animated.timing(opacity, {
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
      toValue: loading ? 0.7 : 1
    }).start();
  }, [loading]);
  
  return (
    <TouchableOpacity activeOpacity={0.7} disabled={loading} onPress={onPress}>
      <Animated.View
        style={coolStyles.container(opacity)}
      >
        <View>
          <View style={coolStyles.indicatorContainer}>
            <ActivityIndicator animating={loading} style={coolStyles.indicator} color='white'  />
          </View>
          <Text style={{...textStyles.onboardingCoolButton, ...textStyle}}>
            {title}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

const coolStyles = StyleSheet.create({
  container: (opacity) => ({
    opacity,
    backgroundColor: colors.treeBlues,
    height: 44,
    width: 222,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  }),
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
  },
  indicator: {
    transform: [{translateX: -24}]
  }
})