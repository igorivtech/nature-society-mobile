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
const SLIDER_HEIGHT = Math.min(347, (height-45*2)*0.5);
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

export const Slider = memo(({item, location, startUpAnimation = false, initialValue = 0.5, onPress, goBack, setSearchVisible}) => {

  const {animation, title, titles} = item;

  useEffect(()=>{
    if (startUpAnimation) {
      startThumbAnimation();
    }
  }, [])

  const [titleTranslateY, setTitleTranslateY] = useState(TITLE_TRANSLATE_Y);
  const [topText, setTopText] = useState(titles[2]);
  const [middleText, setMiddleText] = useState(titles[1]);
  const [bottomText, setBottomText] = useState(titles[0]);

  const titlesMap = {
    0: setBottomText,
    0.5: setMiddleText,
    1: setTopText
  };

  const resetTitles = () => {
    setTopText(titles[2]);
    setMiddleText(titles[1]);
    setBottomText(titles[0]);
  }

  const alreadyAnswered = useRef(false);

  const [continueEnabled, setContinueEnabled] = useState(true);
  const [dragEnabled, setDragEnabled] = useState(true);
  const currentOffset = useRef(initialValue);
  const progress = useRef(new Animated.Value(initialValue)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const startUpTranslateY = useRef(new Animated.Value(0)).current;
  const lineOpacity = useRef(new Animated.Value(LINE_OPACITY)).current;
  const textContainerOpacity = useRef(new Animated.Value(1)).current;
  const bottomTopContainersOpacity = useRef(new Animated.Value(1)).current;
  const indicatorOpacity = useRef(new Animated.Value(1)).current;
  const animationOpacity = useRef(new Animated.Value(1)).current;

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
    Animated.timing(progress, {
      toValue: p,
      duration: DURATION,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }

  const startThumbAnimation = () => {
    // textContainerOpacity.setValue(1);
    setMiddleText(strings.reportScreen.scrollHint);
    setDragEnabled(false);
    setContinueEnabled(false);
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
          ]).start(()=>{
            Animated.timing(textContainerOpacity, {
              toValue: 0,
              useNativeDriver: true
            }).start(()=>{
              resetTitles();
              Animated.timing(textContainerOpacity, {
                toValue: 1,
                useNativeDriver: true
              }).start(()=>{
                setDragEnabled(true);
                setContinueEnabled(true);
              })
            })
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
    if (alreadyAnswered.current) {
      onPress(); // next please
    } else {
      alreadyAnswered.current = true;
      setContinueEnabled(false);
      setDragEnabled(false);
      Animated.parallel(
        [indicatorOpacity, bottomTopContainersOpacity, lineOpacity].map(v => Animated.timing(v, {
          toValue: 0,
          useNativeDriver: true,
          duration: 400,
          easing: Easing.inOut(Easing.ease)
        }))
      ).start(()=>{
        setTimeout(() => {
          onPress(); // next please
          setTimeout(() => {
            backToNormal();
          }, 1000);
        }, 2000);
      });
      // animation opacity? - yes, probably animation opacity.
      Animated.timing(animationOpacity, {
        useNativeDriver: true,
        toValue: 0.35,
        easing: Easing.inOut(Easing.ease)
      }).start();
      // animating title? - yes, animating title.
      const setTitle = titlesMap[progress._value];
      Animated.timing(textContainerOpacity, {
        toValue: 0,
        useNativeDriver: true
      }).start(()=>{
        setTitleTranslateY(0);
        setTitle(strings.reportScreen.otherPeople(8));
        Animated.timing(textContainerOpacity, {
          toValue: 1,
          useNativeDriver: true
        }).start(()=>{
          
        })
      })
    }
  }

  const backToNormal = () => {
    animationOpacity.setValue(1);
    setTitleTranslateY(TITLE_TRANSLATE_Y);
    resetTitles();
    setContinueEnabled(true);
    setDragEnabled(true);
    [indicatorOpacity, bottomTopContainersOpacity].forEach(v => {
      v.setValue(1);
    });
    lineOpacity.setValue(LINE_OPACITY);
  };

  const pickLocation = () => {
    setSearchVisible(true);
  }

  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.animationSliderContainer}>
        <Animatable.View style={sliderStyles.animation(animationOpacity)} duration={1000} delay={600} animation='fadeIn'>
          <LottieView source={animation} progress={progress} resizeMode='contain' />
        </Animatable.View>
        <View style={sliderStyles.sliderTextContainer}>
          <Animated.View style={sliderStyles.textContainer(textContainerOpacity)}>
            <Animated.Text style={sliderStyles.text(topTextOpacity, titleTranslateY)}>{topText}</Animated.Text>
            <Animated.Text style={sliderStyles.text(centerTextOpacity, 0)}>{middleText}</Animated.Text>
            <Animated.Text style={sliderStyles.text(bottomTextOpacity, -titleTranslateY)}>{bottomText}</Animated.Text>
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
      
      <Animated.View style={sliderStyles.continueButton(bottomTopContainersOpacity)}>
        <TouchableOpacity disabled={!continueEnabled} onPress={localOnPress}>
          <Animated.View style={sliderStyles.buttonContainer}>
            <Text style={sliderStyles.buttonText}>{strings.continue}</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={sliderStyles.topContainer(bottomTopContainersOpacity)}>
        {location && (
          <TouchableWithoutFeedback onPress={pickLocation}>
            <View style={sliderStyles.locationContainer}>
              <Text style={sliderStyles.locationText}>{location.title}</Text>
              <Image source={require("../../../assets/images/location_small_marker.png")} /> 
            </View>
          </TouchableWithoutFeedback>
        )}
        <View style={sliderStyles.titlePaginationContainer}>
          <Pagination index={goBack ? 1 : 0} />
          <Text style={sliderStyles.title}>{title}</Text>
        </View>
      </Animated.View>

      <Animated.View style={sliderStyles.indicatorContainer(indicatorOpacity)}>
        {goBack ? (
          <TouchableOpacity onPress={goBack} style={sliderStyles.goBackButton}>
            <Image source={require("../../../assets/images/scroll_back_icon.png")} />
            <Text style={sliderStyles.goBack}>{strings.reportScreen.goBack}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={sliderStyles.newReport}>{strings.reportScreen.newReport}</Text>
        )}
      </Animated.View>
      
    </View>
  )
});

const PAG_SIZE = 6.5;
const indices = [0, 1, 2];

export const Pagination = ({index}) => {
  return (
    <View style={pagStyles.container}>
      {indices.map((v)=>{
        return <View key={v.toString()} style={pagStyles.pag(v === index)} />
      })}
    </View>
  )
}

const pagStyles = StyleSheet.create({
  pag: (current) => ({
    marginVertical: 6.5/2,
    width: PAG_SIZE,
    height: PAG_SIZE,
    borderRadius: PAG_SIZE/2,
    backgroundColor: colors.treeBlues,
    opacity: current ? 1 : 0.35
  }),
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

const sliderStyles = StyleSheet.create({


  animation: (opacity) => ({
    ...StyleSheet.absoluteFill,
    opacity
  }),

  titlePaginationContainer: {
    alignSelf: 'stretch'
  },

  goBackButton: {
    alignItems: 'center'
  },

  goBack: {
    marginTop: 0,
    ...textStyles.normalOfSize(12),
    textAlign: 'center',
    color: colors.lighterShade
  },

  newReport: {
    ...textStyles.normalOfSize(12),
    textAlign: 'center',
    color: colors.lighterShade,
    paddingTop: 6
  },

  indicatorContainer: (opacity) => ({
    opacity,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 12
  }),

  continueButton: (opacity) => ({
    opacity
  }),

  title: {
    ...textStyles.normalOfSize(30),
    alignSelf: 'stretch'
  },

  topContainer: (opacity) => ({
    opacity,
    position: 'absolute',
    top: 44,
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

  buttonContainer: {
    borderRadius: 10,
    borderColor: colors.treeBlues,
    height: 45,
    alignSelf: 'stretch',
    borderWidth: 1,
    marginBottom: 22,
    marginHorizontal: 30,
    marginTop: 16,
    justifyContent: 'center'
  },

  container: {
    height: '33.3333333333333%'
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