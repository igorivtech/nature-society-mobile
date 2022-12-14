import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { Directions, FlingGestureHandler, PanGestureHandler, State } from "react-native-gesture-handler";
import { View, StyleSheet, Animated, Easing, Text, TouchableOpacity, TouchableWithoutFeedback, Image } from "react-native";
import {clamp} from '../../../hooks/helpers'
import {textStyles} from "../../../values/textStyles"
import { height, pureHeight, smallScreen, THUMB_COLORS } from "../../../values/consts";
import LottieView from 'lottie-react-native';
import { strings } from "../../../values/strings";
import { colors } from "../../../values/colors";
import useIsMounted from 'ismounted';
import AsyncStorage from "@react-native-community/async-storage";
import { globalStyles } from "../../../values/styles";
import {ActivityIndicator} from "../ActivityIndicator";

const THUMB_RADIUS = 26.5 / 2;
let SLIDER_HEIGHT = Math.min(347, (pureHeight-45*2)*0.5);
if (smallScreen) {
  SLIDER_HEIGHT = 220;
}
const SLIDER_CONTAINER_HEIGHT = SLIDER_HEIGHT + 2*THUMB_RADIUS;

const DURATION = 200;
const LINE_OPACITY = 0.15;
const TITLE_TRANSLATE_Y = 4;
const ANIMATION_OPACITY = 0.35;

const clampAnimationValue = (p) => {
  if (p < 0.2) {
    return 0;
  } else if (p < 0.4) {
    return 0.25;
  } else if (p < 0.6) {
    return 0.5;
  } else if (p < 0.8) {
    return 0.75;
  } else {
    return 1;
  }
}

const TITLES_DELTA = 1/7;
const ALREADY_SHOWN = "ALREADY_SHOWN_SLIDER"

export const Slider = memo(({fetchingPlace = false, loaded, autoPlay, valueRef, item, location, showLocation = false, startUpAnimation = false, initialValue = 0.5, onPress, goBack, setSearchVisible}) => {

  const {animation, introAnimation, title, titles} = item;

  const isMounted = useIsMounted();

  useEffect(()=>{
    if (startUpAnimation) {
      AsyncStorage.getItem(ALREADY_SHOWN).then(alreadyShown => {
        if (alreadyShown === null) {
          setMiddleText(strings.reportScreen.scrollHint);
          lineOpacity.setValue(0);
        }
      })
    }
    //
    progress.addListener(({value})=>{
      colorsProgress.setValue(value);
    })
  }, [])

  useEffect(()=>{
    if (startUpAnimation && loaded) {
      startThumbAnimation();
    }
  }, [loaded])

  useEffect(()=>{
    if (autoPlay && loaded) {
      introAnimationRef.current.play();
    }
  }, [autoPlay, loaded])

  const [titleTranslateY, setTitleTranslateY] = useState(TITLE_TRANSLATE_Y);
  const [topText, setTopText] = useState(titles[4]);
  const [middlePlusText, setMiddlePlusText] = useState(titles[3]);
  const [middleText, setMiddleText] = useState(titles[2]);
  const [middleMinusText, setMiddleMinusText] = useState(titles[1]);
  const [bottomText, setBottomText] = useState(titles[0]);

  const titlesMap = {
    0: setBottomText,
    0.25: setMiddleMinusText,
    0.5: setMiddleText,
    0.75: setMiddlePlusText,
    1: setTopText
  };

  const resetTitles = () => {
    if (!isMounted.current) {
      return;
    }
    setTopText(titles[4]);
    setMiddlePlusText(titles[3]);
    setMiddleText(titles[2]);
    setMiddleMinusText(titles[1]);
    setBottomText(titles[0]);
  }

  const looping = useRef(false);
  const alreadyAnswered = useRef(false);

  const [flingEnabled, setFlingEnabled] = useState(false);
  const [continueEnabled, setContinueEnabled] = useState(true);
  const [dragEnabled, setDragEnabled] = useState(true);
  const currentOffset = useRef(initialValue);
  const progress = useRef(new Animated.Value(initialValue)).current;
  const colorsProgress = useRef(new Animated.Value(initialValue)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const startUpTranslateY = useRef(new Animated.Value(0)).current;
  const lineOpacity = useRef(new Animated.Value(LINE_OPACITY)).current;
  const textContainerOpacity = useRef(new Animated.Value(1)).current;
  const bottomTopContainersOpacity = useRef(new Animated.Value(1)).current;
  const indicatorOpacity = useRef(new Animated.Value(1)).current;
  const animationsContainerOpacity = useRef(new Animated.Value(1)).current;
  const [animationOpacity, setAnimationOpacity] = useState(0);
  const [introAnimationOpacity, setIntroAnimationOpacity] = useState(1);
  const introAnimationRef = useRef();

  const animationProgress = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: item.outputRange,
    extrapolate: 'clamp'
  })

  const thumbColor = colorsProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: THUMB_COLORS,
    extrapolate: 'clamp',
  })
  const thumbTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SLIDER_HEIGHT],
    extrapolate: 'clamp',
  })

  const topTextOpacity = progress.interpolate({
    inputRange: [1-TITLES_DELTA, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })
  const centerPlusTextOpacity = progress.interpolate({
    inputRange: [0.75-TITLES_DELTA, 0.75, 0.75+TITLES_DELTA],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  })
  const centerTextOpacity = progress.interpolate({
    inputRange: [0.5-TITLES_DELTA, 0.5, 0.5+TITLES_DELTA],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  })
  const centerMinusTextOpacity = progress.interpolate({
    inputRange: [0.25-TITLES_DELTA, 0.25, 0.25+TITLES_DELTA],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  })
  const bottomTextOpacity = progress.interpolate({
    inputRange: [0, 0+TITLES_DELTA],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const continueButtonOpacity = useRef(new Animated.Value(1)).current;

  useEffect(()=>{
    const disabled = (showLocation && location == null) || !continueEnabled || !autoPlay;
    Animated.timing(continueButtonOpacity, {
      toValue: disabled ? 0.5 : 1,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }, [showLocation, location, continueEnabled, autoPlay]);

  const panHandlerStateChange = (event) => {
    finishGesture(event, true);
  }

  const panHandlerStateChangeFling = (event) => {
    finishGesture(event, false);
  }

  const finishGesture = (event, thumbAnimation) => {
    if (event.nativeEvent.state === State.END) {
      const velocity = event.nativeEvent.velocityY/7400;
      const p = clampAnimationValue(progress._value-velocity);
      currentOffset.current = p;
      valueRef.current = p;
      Animated.timing(progress, {
        toValue: p,
        duration: DURATION,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease)
      }).start();
      if (thumbAnimation) {
        scaleThumb(1);
      }
    } else if (event.nativeEvent.state === State.BEGAN) {
      if (thumbAnimation) {
        scaleThumb(0.8);
      }
      onIntroFinish();
    }
  }

  const panHandlerEvent = (event) => {
    const p = clamp(0, currentOffset.current + (-event.nativeEvent.translationY/SLIDER_HEIGHT), 1);
    progress.setValue(p);
  }

  const startThumbAnimation = async () => {
    if (!isMounted.current) {return}
    const alreadyShown = await AsyncStorage.getItem(ALREADY_SHOWN);
    if (alreadyShown === null) {
      AsyncStorage.setItem(ALREADY_SHOWN, "1").then(()=>{})
      firstTimeAnimation();
    } else {
      regularAnimation();
    }
  }

  const regularAnimation = () => {
    // lineOpacity.setValue(0);
    // // animationOpacity.setValue(ANIMATION_OPACITY);
    // Animated.parallel([
    //   Animated.timing(lineOpacity, {
    //     toValue: LINE_OPACITY,
    //     useNativeDriver: true,
    //     easing: Easing.inOut(Easing.ease)
    //   }),
    //   // Animated.timing(animationOpacity, {
    //   //   toValue: 1,
    //   //   useNativeDriver: true,
    //   //   easing: Easing.inOut(Easing.ease)
    //   // }),
    // ]).start();
  }

  const firstTimeAnimation = () => {
    setMiddleText(strings.reportScreen.scrollHint);
    setDragEnabled(false);
    setContinueEnabled(false);
    lineOpacity.setValue(0);
    startUpTranslateY.setValue(0);
    //
    looping.current = true;
    Animated.sequence([
      Animated.timing(startUpTranslateY, {
        delay: 200,
        toValue: -50,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }),
      createAnimation(true),
      createAnimation(false),
      createAnimation(true),
      createAnimation(false),
      Animated.timing(startUpTranslateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }),
    ]).start(()=>{
      if (!isMounted.current) {return}
      finishLoop();
    });
  }

  const createAnimation = (up) => {
    return Animated.timing(startUpTranslateY, {
      toValue: up ? 50 : -50,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    })
  }

  const finishLoop = () => {
    startUpTranslateY.stopAnimation();
    Animated.sequence([
      Animated.timing(startUpTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(lineOpacity, {
        toValue: LINE_OPACITY,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(textContainerOpacity, {
        toValue: 0,
        useNativeDriver: true
      })
    ]).start(()=>{
      resetTitles();
      Animated.timing(textContainerOpacity, {
        toValue: 1,
        useNativeDriver: true
      }).start(()=>{
        if (!isMounted.current) {return}
        setDragEnabled(true);
        setContinueEnabled(true);
      })
    })
  }

  const scaleThumb = (toValue) => {
    Animated.timing(scale, {
      toValue,
      duration: 100,
      useNativeDriver: true
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
        }, 2500);
      });
      // animation opacity? - yes, probably animation opacity.
      Animated.timing(animationsContainerOpacity, {
        useNativeDriver: true,
        toValue: ANIMATION_OPACITY,
        duration: 400,
        easing: Easing.inOut(Easing.ease)
      }).start();
      // animating title? - yes, animating title.
      const setTitle = titlesMap[progress._value];
      Animated.timing(textContainerOpacity, {
        toValue: 0,
        useNativeDriver: true
      }).start(()=>{
        setTitleTranslateY(0);
        const otherReporters = location.similarReports[`${1 + Math.round(4*valueRef.current)}`];
        setTitle(strings.reportScreen.otherPeople(otherReporters));
        Animated.timing(textContainerOpacity, {
          toValue: 1,
          useNativeDriver: true
        }).start(()=>{
          
        })
      })
    }
  }

  const backToNormal = () => {
    if (!isMounted.current) {return}
    setAnimationOpacity(1);
    setIntroAnimationOpacity(0);
    animationsContainerOpacity.setValue(1);
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

  const onIntroFinish = useCallback(() => {
    setFlingEnabled(true);
    setIntroAnimationOpacity(0);
    setAnimationOpacity(1);
  }, [])

  const onTouchStart = useCallback(()=>{
    if (looping.current) {
      looping.current = false;
      finishLoop();
    }
  }, [])

  return (
    <View style={sliderStyles.container}>

      <Animated.View style={sliderStyles.topContainer(bottomTopContainersOpacity)}>
        {showLocation ? (
          <TouchableWithoutFeedback onPress={pickLocation}>
            <View style={sliderStyles.locationContainer}>
              <ActivityIndicator style={globalStyles.scale(0.8)} animating={fetchingPlace} color={colors.treeBlues} />
              <Text numberOfLines={1} style={sliderStyles.locationText}>{location != null ? location.title : strings.pleaseSelectLocation(fetchingPlace)}</Text>
              <Image source={require("../../../assets/images/location_small_marker.png")} /> 
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        <View style={sliderStyles.titlePaginationContainer}>
          <Pagination index={goBack ? 1 : 0} />
          <Text style={sliderStyles.title}>{title}</Text>
        </View>
      </Animated.View>

      <PanGestureHandler 
        id={`${item.key}_down`} 
        enabled={flingEnabled && location != null && dragEnabled}
        onHandlerStateChange={panHandlerStateChangeFling}
        onGestureEvent={panHandlerEvent}
      >
        <View style={sliderStyles.animationSliderContainer}>
          {loaded ? (
            <Animated.View style={sliderStyles.animationsContainer(animationsContainerOpacity)}>
              <Animated.View style={sliderStyles.animation(animationOpacity)}>
                <LottieView source={animation} progress={animationProgress} resizeMode={item.resizeMode} />
              </Animated.View>
              <Animated.View style={sliderStyles.introAnimation(introAnimationOpacity)}>
                <LottieView ref={introAnimationRef} source={introAnimation} loop={false} autoPlay={false} resizeMode={item.resizeMode} onAnimationFinish={onIntroFinish} />
              </Animated.View>
            </Animated.View>
          ) : null}
          <View style={sliderStyles.sliderTextContainer}>
            <Animated.View style={sliderStyles.textContainer(textContainerOpacity)}>
              <Animated.Text style={sliderStyles.text(topTextOpacity, titleTranslateY)}>{topText}</Animated.Text>
              <Animated.Text style={sliderStyles.text(centerPlusTextOpacity, titleTranslateY/2)}>{middlePlusText}</Animated.Text>
              <Animated.Text style={sliderStyles.text(centerTextOpacity, 0)}>{middleText}</Animated.Text>
              <Animated.Text style={sliderStyles.text(centerMinusTextOpacity, -titleTranslateY/2)}>{middleMinusText}</Animated.Text>
              <Animated.Text style={sliderStyles.text(bottomTextOpacity, -titleTranslateY)}>{bottomText}</Animated.Text>
            </Animated.View>
            <View style={sliderStyles.sliderContainer}>
              <Animated.View style={sliderStyles.middleLine(lineOpacity)} />
              <PanGestureHandler id={`${item.key}_pan`} enabled={location != null && dragEnabled} onHandlerStateChange={panHandlerStateChange} onGestureEvent={panHandlerEvent}>
                <Animated.View style={sliderStyles.thumbContainer(thumbTranslateY)}>
                  <Animated.View style={sliderStyles.thumb(scale, startUpTranslateY)}>
                    <Animated.View style={sliderStyles.thumbBg(thumbColor)} />
                  </Animated.View>
                </Animated.View>
              </PanGestureHandler>
            </View>
          </View>
        </View>
      </PanGestureHandler>
      
      <Animated.View style={sliderStyles.continueButton(bottomTopContainersOpacity)}>
        <TouchableOpacity disabled={(showLocation && location == null) || !continueEnabled || !autoPlay} onPress={localOnPress}>
          <Animated.View style={sliderStyles.buttonContainer(continueButtonOpacity)}>
            <Text style={sliderStyles.buttonText}>{strings.continue}</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>     

      <Animated.View style={sliderStyles.indicatorContainer(indicatorOpacity)}>
        {goBack ? (
          <TouchableOpacity onPress={goBack} style={sliderStyles.goBackButton}>
            <Image source={require("../../../assets/images/scroll_back_icon.png")} />
            <Text style={sliderStyles.goBack}>{strings.reportScreen.goBack}</Text>
          </TouchableOpacity>
        ) : (
          <NewReportLabel />
        )}
      </Animated.View>
      
    </View>
  )
});

// <View onTouchStart={onTouchStart} style={sliderStyles.sliderContainer}>

export const NewReportLabel = () => {
  return (
    <View style={sliderStyles.newReportContainer}>
      <Text style={sliderStyles.newReport}>{strings.reportScreen.newReport}</Text>
      <Image style={globalStyles.imageJustContain} source={require("../../../assets/images/new_report_small_icon.png")} />
    </View>
  )
}

const PAG_SIZE = 6.5;
const indices = [0, 1, 2];

export const Pagination = ({index}) => {
  return (
    <View??style={pagStyles.container}>
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

  backgroundMaskImage: (item) => ({
    ...item.thumbSize,
    ...globalStyles.imageJustContain,
    position: 'absolute'
  }),

  maskedViewContainer: (scale, translateY) => ({
    ...StyleSheet.absoluteFill,
    transform: [{scale}, {translateY}]
  }),

  maskedViewBackground: (item, thumbColor) => ({
    ...item.thumbSize,
    backgroundColor: thumbColor
  }),
  
  overlay:  {
    ...StyleSheet.absoluteFill,
    borderRadius: 22.5, overflow: 'hidden'
  },

  thumbBg: (color) => ({
    ...StyleSheet.absoluteFill,
    backgroundColor: color
  }),

  introAnimation: (opacity) => ({
    ...StyleSheet.absoluteFill,
    opacity
  }),

  animationsContainer: (opacity) => ({
    opacity,
    ...StyleSheet.absoluteFill
  }),

  animation: (opacity) => ({
    ...StyleSheet.absoluteFill,
    opacity,
    overflow: 'hidden'
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

  newReportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    width: 66,
  },

  newReport: {
    ...textStyles.normalOfSize(12),
    textAlign: 'center',
    color: colors.lighterShade,
    marginRight: 4
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
    ...textStyles.normalOfSize(smallScreen ? 24 : 30),
    alignSelf: 'stretch'
  },

  topContainer: (opacity) => ({
    opacity,
    marginBottom: 0,
    marginTop: 44,
    marginLeft: 30,
    marginRight: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }),

  locationText: {
    ...textStyles.normalOfSize(18),
    color: colors.treeBlues,
    flexGrow: 1,
    flexShrink: 1
  },

  locationContainer: {
    borderBottomColor: colors.treeBlues,
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    marginBottom: smallScreen ? 14 : 21,
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
    marginTop: 0,
    justifyContent: 'center'
  }),

  container: {
    height: '33.3333333333333%'
  },

  sliderTextContainer: {
    position: 'absolute',
    right: 16,
    bottom: smallScreen ? 0 : height * 0.04,
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
  thumbContainer: (thumbTranslateY, thumbSize) => ({
    // zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: THUMB_RADIUS*2,
    width: THUMB_RADIUS*2,
    position: 'absolute',
    bottom: 0,
    transform: [
      {translateY: thumbTranslateY}
    ]
  }),
  thumb: (scale, translateY) => ({
    // zIndex: 1,
    height: 2*THUMB_RADIUS,
    width: 2*THUMB_RADIUS,
    borderRadius: THUMB_RADIUS,
    overflow: 'hidden',
    transform: [{scale}, {translateY}]
  })
})