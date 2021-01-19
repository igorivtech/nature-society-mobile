import React, { useEffect, useRef, memo } from "react";
import { View, Text, Pressable, Animated, Easing, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../../../values/colors";
import { textStyles } from "../../../values/textStyles";
import * as Animatable from "react-native-animatable";

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
  2: 'wobble'
}

const delays = {
  0: 0,
  1: 2000,
  2: 3000
}

const iterationDelay = {
  0: 0,
  1: 0,
  2: 500
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const OnboardingButton = ({ scale, index, selected, setIndex, doneVisible = false, transform }) => {
  const alpha = useRef(new Animated.Value(0)).current;
  const innerScale = useRef(new Animated.Value(SMALL_SCALE)).current;
  const ref = useRef();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(alpha, {
        toValue: selected ? 1 : 0.5,
        duration: buttonAnimation,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(innerScale, {
        toValue: selected ? 1 : SMALL_SCALE,
        duration: buttonAnimation,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();
    if (selected) {
      ref.current?.stopAnimation();
    }
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
    <AnimatedPressable style={[transform.getLayout(), {position:  'absolute'}]} onPress={onPress}>
      <Animatable.View 
        ref={ref} 
        useNativeDriver={true}
        easing='ease-out'
        iterationCount='infinite'
        iterationDelay={iterationDelay[index]} 
        delay={delays[index]} 
        animation={animations[index]}
      >
        <Animated.View style={{
          transform: [{scale}]
        }}>
          <Animated.Image
            style={styles.buttonContainer(alpha, innerScale)}
            source={images[index]}
          />
        </Animated.View>
      </Animatable.View>
    </AnimatedPressable>
  );
};

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