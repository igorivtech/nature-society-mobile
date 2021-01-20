import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { strings } from "../../values/strings";
import { globalStyles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";
import { width, height, SPLASH_HIDE_DELAY, statusBarHeight, TOP_BUTTONS_CONTAINER_WIDTH } from "../../values/consts";
import { colors } from "../../values/colors";
import { OnboardingButton, CoolButton } from "../views/onboarding/views";
import AsyncStorage from "@react-native-community/async-storage";
import { ONBOARDING_SHOWN_KEY } from "../../hooks/memory";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextsView, FirstButton, SkipButton } from "../views/onboarding/texts";
import useIsMounted from "ismounted";
import {TapView} from "../views/general"

const TRAVEL_DURATION = 600;

const TRANSLATE_Y_VALUE = -height * 0.2;
const TEXT_TRANSLATE_Y = 40;
const inputRange = [TRANSLATE_Y_VALUE, 0];

const BOTTOM = {y: (height-statusBarHeight)*0.5 - 165}
const TOP = {y: 0}
const buttonsWidth = TOP_BUTTONS_CONTAINER_WIDTH;
const LEFT = {x: 0};
const MIDDLE_LEFT = {x:width*buttonsWidth*0.33-55/2};
const MIDDLE = {x:width*buttonsWidth/2-55/2};
const MIDDLE_RIGHT = {x:width*buttonsWidth*0.66-55/2};
const RIGHT = {x:width*buttonsWidth-55};

const BOTTOM_MIDDLE_LEFT = {...BOTTOM, ...MIDDLE_LEFT};
const BOTTOM_MIDDLE = {...BOTTOM, ...MIDDLE};
const BOTTOM_MIDDLE_RIGHT = {...BOTTOM, ...MIDDLE_RIGHT};

const TOP_LEFT = {...TOP, ...LEFT};
const TOP_MIDDLE = {...TOP, ...MIDDLE};
const TOP_RIGHT = {...TOP, ...RIGHT};

export const OnboardingScreen = ({ navigation }) => {
 
  const {bottom: bottomSafeAreaInset, top: topSafeAreaHeight} = useSafeAreaInsets();
  const isMounted = useIsMounted();

  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const logoScale = logoTranslateY.interpolate({
    inputRange,
    outputRange: [0.7, 1],
    extrapolate: 'clamp'
  })
  const labelOpacity = logoTranslateY.interpolate({
    inputRange,
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })

  const textTranslateY = useRef(new Animated.Value(TEXT_TRANSLATE_Y)).current;
  const textOpacity = textTranslateY.interpolate({
    inputRange: [0, TEXT_TRANSLATE_Y],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

  const firstButtonScale = useRef(new Animated.Value(0)).current;
  const secondButtonScale = useRef(new Animated.Value(0)).current;
  const skipButtonScale = useRef(new Animated.Value(0)).current;

  const exploreButtonTransform = useRef(new Animated.ValueXY(BOTTOM_MIDDLE)).current;
  const reportButtonTransform = useRef(new Animated.ValueXY(BOTTOM_MIDDLE_LEFT)).current;
  const progressButtonTransform = useRef(new Animated.ValueXY(BOTTOM_MIDDLE_LEFT)).current;

  const exploreButtonScale = useRef(new Animated.Value(0)).current;
  const reportButtonScale = useRef(new Animated.Value(0)).current;
  const progressButtonScale = useRef(new Animated.Value(0)).current;

  const exploreButtonOpacity = exploreButtonTransform.y.interpolate({
    inputRange: [TOP_MIDDLE.y, BOTTOM_MIDDLE.y],
    outputRange: [0.5, 1],
    extrapolate: 'clamp'
  })
  const reportButtonOpacity = reportButtonTransform.y.interpolate({
    inputRange: [TOP_MIDDLE.y, BOTTOM_MIDDLE.y],
    outputRange: [0.5, 1],
    extrapolate: 'clamp'
  })
  const progressButtonOpacity = progressButtonTransform.y.interpolate({
    inputRange: [TOP_MIDDLE.y, BOTTOM_MIDDLE.y],
    outputRange: [0.5, 1],
    extrapolate: 'clamp'
  })

  const [secondContainerVisible, setSecondContainerVisible] = useState(false);
  const secondContainerOpacity = useRef(new Animated.Value(0)).current;
  const textsScale = useRef(new Animated.Value(0)).current;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const animating = useRef(true);
  const customAnimating = useRef(false);
  const allShown = useRef(false);

  // SPLASH
  useEffect(()=>{
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(logoTranslateY, {
        useNativeDriver: true,
        toValue: TRANSLATE_Y_VALUE,
        easing: Easing.inOut(Easing.ease),
        duration: 1000
      }),
      Animated.delay(300),
      Animated.timing(textTranslateY, {
        useNativeDriver: true,
        toValue: 0,
        easing: Easing.inOut(Easing.ease),
        duration: 600
      }),
      Animated.delay(2000),
      Animated.timing(firstButtonScale, {
        useNativeDriver: true,
        toValue: 1,
        easing: Easing.inOut(Easing.ease),
      })
    ]).start()
  }, [])

  // ONBOARDING
  const fancyAnimate = () => {
    Animated.parallel([
      Animated.timing(exploreButtonTransform, {
        duration: TRAVEL_DURATION,
        useNativeDriver: false,
        toValue: BOTTOM_MIDDLE_RIGHT,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(reportButtonScale, {
        duration: TRAVEL_DURATION,
        useNativeDriver: true,
        toValue: 1,
        easing: Easing.inOut(Easing.ease)
      }),
    ]).start(()=>animating.current = false);
  }

  useEffect(()=>{
    if (customAnimating.current) {return}
    if (allShown.current) {return}
    //
    if (selectedIndex === 1) {
      animating.current = true;
      Animated.sequence([
        Animated.parallel([
          Animated.timing(exploreButtonTransform, {
            duration: TRAVEL_DURATION,
            useNativeDriver: false,
            toValue: TOP_RIGHT,
            easing: Easing.inOut(Easing.ease)
          }),
          Animated.timing(reportButtonTransform, {
            duration: TRAVEL_DURATION,
            useNativeDriver: false,
            toValue: BOTTOM_MIDDLE,
            easing: Easing.inOut(Easing.ease)
          }),
        ]),
        Animated.delay(2000),
        Animated.parallel([
          Animated.timing(reportButtonTransform, {
            duration: TRAVEL_DURATION,
            useNativeDriver: false,
            toValue: BOTTOM_MIDDLE_RIGHT,
            easing: Easing.inOut(Easing.ease)
          }),
          Animated.timing(progressButtonScale, {
            duration: TRAVEL_DURATION,
            useNativeDriver: true,
            toValue: 1,
            easing: Easing.inOut(Easing.ease)
          })
        ])
      ]).start(()=>{
        animating.current = false;
      });
    } else if (selectedIndex === 2) {
      allShown.current = true;
      animating.current = true;
      Animated.parallel([
        Animated.timing(reportButtonTransform, {
          duration: TRAVEL_DURATION,
          useNativeDriver: false,
          toValue: TOP_MIDDLE,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(progressButtonTransform, {
          duration: TRAVEL_DURATION,
          useNativeDriver: false,
          toValue: BOTTOM_MIDDLE,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(skipButtonScale, {
          duration: TRAVEL_DURATION,
          useNativeDriver: true,
          toValue: 0,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(secondButtonScale, {
          duration: TRAVEL_DURATION,
          useNativeDriver: true,
          toValue: 1,
          easing: Easing.inOut(Easing.ease)
        }),
      ]).start(()=>{
        animating.current = false;
      });
    }
  }, [selectedIndex])

  useEffect(()=>{
    if (secondContainerVisible) {
      Animated.sequence([
        Animated.timing(secondContainerOpacity, {
          toValue: 1,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
          duration: 600
        }),
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(textsScale, {
            toValue: 1,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
            duration: 500
          }),
          Animated.timing(exploreButtonScale, {
            toValue: 1,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
            duration: 500
          }),
        ]),
        Animated.timing(skipButtonScale, {
          toValue: 1,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
          duration: 300
        }),
      ]).start(({finished})=>{
        if (finished) {
          setTimeout(() => {
            fancyAnimate();
          }, 2000);
        }
      })
    }
  }, [secondContainerVisible])

  const finish = () => {
    animating.current = true;
    setSelectedIndex(1000);
    [textsScale, firstButtonScale, secondButtonScale].forEach(a=>a.stopAnimation());
    animateIcons(
      TOP_RIGHT, 1,
      TOP_MIDDLE, 1,
      TOP_LEFT, 1
    )
    Animated.parallel([
      Animated.timing(textsScale, {
        duration: TRAVEL_DURATION,
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(firstButtonScale, {
        duration: TRAVEL_DURATION,
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(secondButtonScale, {
        duration: TRAVEL_DURATION,
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }),
    ]).start((data)=>{
      if (data.finished) {
        navigation.navigate("Home");
      }
    });
    AsyncStorage.setItem(ONBOARDING_SHOWN_KEY, (new Date()).toString()).then(()=>{});
  };

  const next = () => {
    if (animating.current) {return}
    setIndex((selectedIndex+1)%3);
  }

  const setIndex = useCallback((i) => {
    if (animating.current) {return}
    if (i === selectedIndex) {return}
    if (allShown.current) {
      if (i === 0) {
        animateIcons(
          BOTTOM_MIDDLE, 1,
          TOP_MIDDLE, 1,
          TOP_LEFT, 1,
        )
      } else if (i === 1) {
        animateIcons(
          TOP_RIGHT, 1,
          BOTTOM_MIDDLE, 1,
          TOP_LEFT, 1,
        )
      } else if (i === 2) {
        animateIcons(
          TOP_RIGHT, 1,
          TOP_MIDDLE, 1,
          BOTTOM_MIDDLE, 1,
        )
      }
      setSelectedIndex(i);
    } else {
      if (i === 0 && selectedIndex === 1) {
        animateIcons(
          BOTTOM_MIDDLE_RIGHT, 1,
          BOTTOM_MIDDLE_LEFT, 1,
          BOTTOM_MIDDLE_LEFT, 0,
        )
        setSelectedIndex(0);
      } else {
        setSelectedIndex(i);
      }
    }
  }, [selectedIndex])

  const firstContinue = () => {
    setSecondContainerVisible(true);
  }

  const animateIcons = (exploreTransform, exploreScale, reportTransform, reportScale, progressTransform, progressScale, callback = null) => {
    customAnimating.current = true;
    animating.current = true;
    [exploreButtonScale, reportButtonScale, progressButtonScale, 
      exploreButtonTransform, reportButtonTransform, progressButtonTransform].forEach(a=>a.stopAnimation());
    Animated.parallel([
      Animated.timing(exploreButtonTransform, {
        duration: TRAVEL_DURATION,
        useNativeDriver: false,
        toValue: exploreTransform,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(exploreButtonScale, {
        duration: TRAVEL_DURATION,
        useNativeDriver: true,
        toValue: exploreScale,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(reportButtonTransform, {
        duration: TRAVEL_DURATION,
        useNativeDriver: false,
        toValue: reportTransform,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(reportButtonScale, {
        duration: TRAVEL_DURATION,
        useNativeDriver: true,
        toValue: reportScale,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(progressButtonTransform, {
        duration: TRAVEL_DURATION,
        useNativeDriver: false,
        toValue: progressTransform,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(progressButtonScale, {
        duration: TRAVEL_DURATION,
        useNativeDriver: true,
        toValue: progressScale,
        easing: Easing.inOut(Easing.ease)
      }),
    ]).start((data)=>{
      if (data.finished) {
        animating.current = false;
        customAnimating.current = false;
        if (callback != null) {
          callback();
        }
      }
    });
  }

  return (
    <View style={styles.container}>
      <Animated.Image style={styles.logo(logoTranslateY, logoScale)} source={require("../../assets/images/splash_top.png")} />
      <Animated.Image style={styles.label(labelOpacity)} source={require("../../assets/images/splash_bottom.png")} />
      <Animated.View style={styles.textContainer(textTranslateY, textOpacity)}>
        <Text style={textStyles.boldOfSize(25, colors.darkWithTone, 'center')}>{strings.onboardingScreen.newTitle}</Text>
        <View style={globalStyles.spacer(4)} />
        <Text style={styles.desc} >{strings.onboardingScreen.newDescription}</Text>
      </Animated.View>
      <FirstButton scale={firstButtonScale} bottomSafeAreaInset={bottomSafeAreaInset} onPress={firstContinue} />
      <Animated.View style={styles.secondContainer(secondContainerOpacity, secondContainerVisible)}>
        <TapView onPress={selectedIndex === 1000 ? null : next} />
        <Animated.View style={styles.buttonsContainer(topSafeAreaHeight)}>
          <OnboardingButton
            alpha={progressButtonOpacity}
            scale={progressButtonScale}
            transform={progressButtonTransform}
            index={2}
            selected={selectedIndex === 2}
            setIndex={setIndex}
          />
          <OnboardingButton
            alpha={reportButtonOpacity}
            scale={reportButtonScale}
            transform={reportButtonTransform}
            index={1}
            selected={selectedIndex === 1}
            setIndex={setIndex}
          />
          <OnboardingButton
            alpha={exploreButtonOpacity}
            scale={exploreButtonScale}
            transform={exploreButtonTransform}
            index={0}
            selected={selectedIndex === 0}
            setIndex={setIndex}
          />
        </Animated.View>
        <TextsView scale={textsScale} index={selectedIndex === 1000 ? 2 : selectedIndex} />
        <FirstButton altTitle={true} scale={secondButtonScale} bottomSafeAreaInset={bottomSafeAreaInset} onPress={finish} />
        <SkipButton scale={skipButtonScale} bottomSafeAreaInset={bottomSafeAreaInset} onPress={finish} />
      </Animated.View>
    </View>
  )
};


const styles = StyleSheet.create({

  buttonsContainer: (topSafeAreaHeight) => ({
    position: 'absolute',
    top: topSafeAreaHeight + 16,
    ...globalStyles.onboardingButtonsContainer,
    height: 55,
  }),

  secondContainer: (opacity, secondContainerVisible) => ({
    opacity,
    zIndex: secondContainerVisible ? 4 : -4,
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.grass,
    justifyContent: 'center',
    alignItems: 'center'
  }),
  textContainer: (translateY, opacity) => ({
    transform: [{translateY}],
    opacity,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 21,
  }),
  label: (opacity) => ({
    opacity,
    resizeMode: 'contain',
    position: 'absolute',
    height,
    width
  }),
  logo: (translateY, scale) => ({
    transform: [{translateY}, {scale}],
    resizeMode: 'contain',
    position: 'absolute',
    height,
    width
  }),
  desc: {
    ...textStyles.normalOfSize(26, colors.darkWithTone, 'center'),
    lineHeight: 26,
  },
  container: {
    backgroundColor: '#FEFEFE',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})