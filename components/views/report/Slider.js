import React, { useEffect, useRef } from "react";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { View, StyleSheet, Animated, Easing } from "react-native";
import {clamp} from '../../../hooks/helpers'

const THUMB_RADIUS = 22.5 / 2;
const SLIDER_HEIGHT = 347;
const SLIDER_CONTAINER_HEIGHT = SLIDER_HEIGHT + 2*THUMB_RADIUS;
const THUMB_COLORS = ['#F5B345', '#E8D13F', '#C4E055', '#80E268', '#3EDF7E']
const DURATION = 200;
const LINE_OPACITY = 0.15;

const clampAnimationValue = (p) => {
  if (p < 0.33) {
    return 0;
  } else if (p < 0.66) {
    return 0.5;
  } else {
    return 1;
  }
}

export const Slider = ({startUpAnimation = false, initialValue, animationProgress}) => {

  useEffect(()=>{
    animationProgress.setValue(initialValue);
    if (startUpAnimation) {
      startThumbAnimation();
    }
  }, [])

  const currentOffset = useRef(initialValue);
  const progress = useRef(new Animated.Value(initialValue)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const startUpTranslateY = useRef(new Animated.Value(0)).current;
  const lineOpacity = useRef(new Animated.Value(LINE_OPACITY)).current;

  const thumbColor = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: THUMB_COLORS,
    extrapolate: 'clamp',
    useNativeDriver: true
  })

  const thumbTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SLIDER_HEIGHT],
    extrapolate: 'clamp',
    useNativeDriver: true
  })

  const panHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      currentOffset.current = progress._value;
      scaleThumb(1);
      clampAnimation();
    } else if (event.nativeEvent.state === State.BEGAN) {
      scaleThumb(0.8);
    }
  }

  const clampAnimation = () => {
    let p = clampAnimationValue(progress._value);
    currentOffset.current = p;
    Animated.parallel([
      Animated.timing(progress, {
        toValue: p,
        duration: DURATION,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(animationProgress, {
        toValue: p,
        duration: DURATION,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease)
      })
    ]).start();
  }

  const startThumbAnimation = () => {
    lineOpacity.setValue(0);
    startUpTranslateY.setValue(0);
    Animated.timing(startUpTranslateY, {
      delay: 1000,
      toValue: -40,
      duration: 400,
      useNativeDriver: false
    }).start(()=>{
      Animated.timing(startUpTranslateY, {
        toValue: 60,
        duration: 500,
        useNativeDriver: false
      }).start(()=>{
        Animated.timing(startUpTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false
        }).start(()=>{
          Animated.timing(lineOpacity, {
            toValue: LINE_OPACITY,
            useNativeDriver: true
          }).start();
        })
      })
    })
  }

  const panHandlerEvent = (event) => {
    let p = clamp(0, currentOffset.current + (-event.nativeEvent.translationY/SLIDER_HEIGHT), 1);
    progress.setValue(p);
    animationProgress.setValue(p);
  }

  const scaleThumb = (toValue) => {
    Animated.timing(scale, {
      toValue,
      duration: 100,
      useNativeDriver: false
    }).start();
  }

  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.sliderContainer}>
        <Animated.View style={sliderStyles.middleLine(lineOpacity)} />
        <PanGestureHandler onHandlerStateChange={panHandlerStateChange} onGestureEvent={panHandlerEvent}>
          <Animated.View style={sliderStyles.thumbContainer(thumbTranslateY)}>
            <Animated.View style={sliderStyles.thumb(thumbColor, scale, startUpTranslateY)} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  )
}

const sliderStyles = StyleSheet.create({

  container: {
    position: 'absolute',
    right: 16,
    bottom: 147,
  },

  sliderContainer: {
    height: SLIDER_CONTAINER_HEIGHT,
    width: THUMB_RADIUS*2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  middleLine: (opacity) => ({
    opacity,
    height: SLIDER_HEIGHT,
    backgroundColor: '#202224',
    width: 1,
  }),
  thumbContainer: (thumbTranslateY) => ({
    alignItems: 'center',
    justifyContent: 'center',
    height: 2*THUMB_RADIUS,
    width: 2*THUMB_RADIUS,
    position: 'absolute',
    bottom: 0,
    transform: [
      {translateY: thumbTranslateY}
    ]
  }),
  thumb: (thumbColor, scale, translateY) => ({
    height: 2*THUMB_RADIUS,
    width: 2*THUMB_RADIUS,
    borderRadius: THUMB_RADIUS,
    backgroundColor: thumbColor,
    transform: [{scale}, {translateY}]
  })
})