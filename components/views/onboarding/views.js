import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, Easing, TouchableOpacity } from "react-native";
import { colors } from "../../../values/colors";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";

const images = {
  0: require("../../../assets/images/Explore.png"),
  1: require("../../../assets/images/Report.png"),
  2: require("../../../assets/images/Progress.png"),
};

const buttonAnimation = 300;

export const OnboardingButton = ({ index, selected, setIndex, doneVisible = false }) => {
  const alpha = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.timing(alpha, {
      toValue: selected ? 1 : 0.5,
      duration: buttonAnimation,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    Animated.timing(scale, {
      toValue: selected ? 1 : 0.8,
      duration: buttonAnimation,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [selected]);

  const onPress = () => {
    if (setIndex != null) {
      if (doneVisible) {
        return;
      }
      setIndex(index);
    }
  };

  return (
    <Pressable onPress={onPress}>
      <Animated.Image
        style={{
          opacity: alpha,
          transform: [{ scale: scale }],
        }}
        source={images[index]}
      />
    </Pressable>
  );
};

export const CoolButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: colors.treeBlues,
          height: 44,
          width: 222,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={textStyles.onboardingCoolButton}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
