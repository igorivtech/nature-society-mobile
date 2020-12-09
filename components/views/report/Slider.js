import React, { memo, useEffect, useRef, useState } from "react";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { View, StyleSheet, Animated, Easing, Text, TouchableOpacity, TouchableWithoutFeedback, Image } from "react-native";
import {clamp} from '../../../hooks/helpers'
import {textStyles} from "../../../values/textStyles"
import { height } from "../../../values/consts";
import LottieView from 'lottie-react-native';
import * as Animatable from "react-native-animatable";
import { strings } from "../../../values/strings";
import { colors } from "../../../values/colors";
import { globalStyles } from "../../../values/styles";

const THUMB_RADIUS = 24.5 / 2;
const SLIDER_HEIGHT = 347;
const SLIDER_CONTAINER_HEIGHT = SLIDER_HEIGHT + 2*THUMB_RADIUS;
const THUMB_COLORS = ['#F5B345', '#E8D13F', '#C4E055', '#80E268', '#3EDF7E']
const DURATION = 200;
const LINE_OPACITY = 0.15;
const TITLE_TRANSLATE_Y = 4;

const clampAnimationValue = (p) => {
  if (p < 0.33) {
    return 0;
  } else if (p < 0.66) {
    return 0.5;
  } else {
    return 1;
  }
}

export const Slider = memo(({item, location, startUpAnimation = false, initialValue = 0.5, onPress}) => {

  const {animation, title, titles} = item;

  useEffect(()=>{
    if (startUpAnimation) {
      startThumbAnimation();
    }
  }, [])

  const [dragEnabled, setDragEnabled] = useState(true);
  const currentOffset = useRef(initialValue);
  const progress = useRef(new Animated.Value(initialValue)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const startUpTranslateY = useRef(new Animated.Value(0)).current;
  const lineOpacity = useRef(new Animated.Value(LINE_OPACITY)).current;
  const textContainerOpacity = useRef(new Animated.Value(1)).current;
  const bottomTopContainersOpacity = useRef(new Animated.Value(1)).current;

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

  const topTextOpacity = progress.interpolate({
    inputRange: [0.75, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
    useNativeDriver: true
  })

  const centerTextOpacity = progress.interpolate({
    inputRange: [0.25, 0.5, 0.75],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
    useNativeDriver: true
  })

  const bottomTextOpacity = progress.interpolate({
    inputRange: [0, 0.25],
    outputRange: [1, 0],
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

  const panHandlerEvent = (event) => {
    let p = clamp(0, currentOffset.current + (-event.nativeEvent.translationY/SLIDER_HEIGHT), 1);
    progress.setValue(p);
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
    ]).start();
  }

  const startThumbAnimation = () => {
    textContainerOpacity.setValue(0);
    setDragEnabled(false);
    lineOpacity.setValue(0);
    startUpTranslateY.setValue(0);
    Animated.timing(startUpTranslateY, {
      delay: 1200,
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
          Animated.parallel([
            Animated.timing(lineOpacity, {
              toValue: LINE_OPACITY,
              useNativeDriver: true
            }),
            Animated.timing(textContainerOpacity, {
              toValue: 1,
              useNativeDriver: true
            })
          ]).start(()=>{
            setDragEnabled(true);
          });
        })
      })
    })
  }

  const scaleThumb = (toValue) => {
    Animated.timing(scale, {
      toValue,
      duration: 100,
      useNativeDriver: false
    }).start();
  }

  const localOnPress = () => {
    onPress();
  }

  const pickLocation = () => {
    console.log("pickLocation");
  }

  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.animationSliderContainer}>
        <Animatable.View style={StyleSheet.absoluteFill} duration={1000} delay={600} animation='fadeIn'>
          <LottieView source={animation} progress={progress} resizeMode='contain' />
        </Animatable.View>
        <View style={sliderStyles.sliderTextContainer}>
          <Animated.View style={sliderStyles.textContainer(textContainerOpacity)}>
            <Animated.Text style={sliderStyles.text(topTextOpacity, TITLE_TRANSLATE_Y)}>{titles[2]}</Animated.Text>
            <Animated.Text style={sliderStyles.text(centerTextOpacity, 0)}>{titles[1]}</Animated.Text>
            <Animated.Text style={sliderStyles.text(bottomTextOpacity, -TITLE_TRANSLATE_Y)}>{titles[0]}</Animated.Text>
          </Animated.View>
          <View style={sliderStyles.sliderContainer}>
            <Animated.View style={sliderStyles.middleLine(lineOpacity)} />
            <PanGestureHandler enabled={dragEnabled} onHandlerStateChange={panHandlerStateChange} onGestureEvent={panHandlerEvent}>
              <Animated.View style={sliderStyles.thumbContainer(thumbTranslateY)}>
                <Animated.View style={sliderStyles.thumb(thumbColor, scale, startUpTranslateY)} />
              </Animated.View>
            </PanGestureHandler>
          </View>
        </View>
      </View>
      
      <TouchableOpacity onPress={localOnPress}>
        <Animated.View style={sliderStyles.buttonContainer(bottomTopContainersOpacity)}>
          <Text style={sliderStyles.buttonText}>{strings.continue}</Text>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={sliderStyles.topContainer(bottomTopContainersOpacity)}>
        {location && (
          <TouchableWithoutFeedback onPress={pickLocation}>
            <View style={sliderStyles.locationContainer}>
              <Text style={sliderStyles.locationText}>{location.name}</Text>
              <Image source={require("../../../assets/images/location_small_marker.png")} /> 
            </View>
          </TouchableWithoutFeedback>
        )}
        <Text style={sliderStyles.title}>{title}</Text>
      </Animated.View>
      
      
    </View>
  )
});

const sliderStyles = StyleSheet.create({

  title: {
    ...textStyles.normalOfSize(30),
    alignSelf: 'stretch'
  },

  topContainer: (opacity) => ({
    opacity,
    position: 'absolute',
    top: 38,
    left: 30,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }),

  locationText: {
    ...textStyles.normalOfSize(18),
    color: colors.treeBlues
  },

  locationContainer: {
    borderBottomColor: colors.treeBlues,
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    marginBottom: 21,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 2
  },

  animationSliderContainer: {
    flex: 1,
  },

  buttonText: {
    ...textStyles.normalOfSize(18),
    textAlign: 'center',
    color: colors.treeBlues,
  },

  buttonContainer: (opacity) => ({
    opacity,
    borderRadius: 10,
    borderColor: colors.treeBlues,
    height: 45,
    alignSelf: 'stretch',
    borderWidth: 1,
    marginBottom: 22,
    marginHorizontal: 30,
    marginTop: 16,
    justifyContent: 'center'
  }),

  container: {
    height: '50%'
  },

  sliderTextContainer: {
    position: 'absolute',
    right: 16,
    bottom: height * 0.04,
    flexDirection: 'row',
  },

  text: (opacity, translateY) => ({
    ...textStyles.normalOfSize(18),
    opacity,
    transform: [{translateY}]
  }),

  textContainer: (opacity) => ({
    marginRight: 14,
    justifyContent: 'space-between',
    opacity
  }),

  sliderContainer: {
    height: SLIDER_CONTAINER_HEIGHT,
    width: THUMB_RADIUS*2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  middleLine: (opacity) => ({
    // zIndex: -1,
    opacity,
    height: SLIDER_HEIGHT,
    backgroundColor: '#202224',
    width: 1,
  }),
  thumbContainer: (thumbTranslateY) => ({
    // zIndex: 1,
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
    // zIndex: 1,
    height: 2*THUMB_RADIUS,
    width: 2*THUMB_RADIUS,
    borderRadius: THUMB_RADIUS,
    backgroundColor: thumbColor,
    transform: [{scale}, {translateY}]
  })
})