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
import { width, height, SPLASH_HIDE_DELAY, statusBarHeight } from "../../values/consts";
import { colors } from "../../values/colors";
import { OnboardingButton, CoolButton } from "../views/onboarding/views";
import AsyncStorage from "@react-native-community/async-storage";
import { ONBOARDING_SHOWN_KEY } from "../../hooks/memory";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextsView, FirstButton, SkipButton } from "../views/onboarding/texts";
import useIsMounted from "ismounted";
import {TapView} from "../views/general"

const TRANSLATE_Y_VALUE = -height * 0.2;
const TEXT_TRANSLATE_Y = 40;
const inputRange = [TRANSLATE_Y_VALUE, 0];

const BOTTOM = {y: 0}
const TOP = {y: -(height-statusBarHeight)*0.34}
const buttonsWidth = 0.7;
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
 
  const {bottomSafeAreaInset} = useSafeAreaInsets();
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

  const exploreButtonScale = useRef(new Animated.Value(1)).current;
  const reportButtonScale = useRef(new Animated.Value(0)).current;
  const progressButtonScale = useRef(new Animated.Value(0)).current;

  const exploreButtonTransform = useRef(new Animated.ValueXY(BOTTOM_MIDDLE)).current;
  const reportButtonTransform = useRef(new Animated.ValueXY(BOTTOM_MIDDLE_LEFT)).current;
  const progressButtonTransform = useRef(new Animated.ValueXY(BOTTOM_MIDDLE_LEFT)).current;

  const [secondContainerVisible, setSecondContainerVisible] = useState(false);
  const secondContainerOpacity = useRef(new Animated.Value(0)).current;
  const textsScale = useRef(new Animated.Value(0)).current;
  const buttonsScale = useRef(new Animated.Value(0)).current;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const finishedRound = useRef(false);
  const animating = useRef(true);

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
        useNativeDriver: false,
        toValue: BOTTOM_MIDDLE_RIGHT,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(reportButtonScale, {
        useNativeDriver: true,
        toValue: 1,
        easing: Easing.inOut(Easing.ease)
      }),
    ]).start(()=>animating.current = false);
  }

  useEffect(()=>{
    if (selectedIndex === 1) {
      animating.current = true;
      Animated.sequence([
        Animated.parallel([
          Animated.timing(exploreButtonTransform, {
            useNativeDriver: false,
            toValue: TOP_RIGHT,
            easing: Easing.inOut(Easing.ease)
          }),
          Animated.timing(reportButtonTransform, {
            useNativeDriver: false,
            toValue: BOTTOM_MIDDLE,
            easing: Easing.inOut(Easing.ease)
          }),
        ]),
        Animated.delay(2000),
        Animated.parallel([
          Animated.timing(reportButtonTransform, {
            useNativeDriver: false,
            toValue: BOTTOM_MIDDLE_RIGHT,
            easing: Easing.inOut(Easing.ease)
          }),
          Animated.timing(progressButtonScale, {
            useNativeDriver: true,
            toValue: 1,
            easing: Easing.inOut(Easing.ease)
          })
        ])
      ]).start(()=>{
        animating.current = false;
      });
    } else if (selectedIndex === 2) {
      animating.current = true;
      Animated.parallel([
        Animated.timing(reportButtonTransform, {
          useNativeDriver: false,
          toValue: TOP_MIDDLE,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(progressButtonTransform, {
          useNativeDriver: false,
          toValue: BOTTOM_MIDDLE,
          easing: Easing.inOut(Easing.ease)
        }),
      ]).start(()=>{
        finishedRound.current=true;
        animating.current = false;
      });
    } else if (selectedIndex === 0 && finishedRound.current) {
      animating.current = true;
      finishedRound.current = false;
      setSelectedIndex(1000);
      Animated.parallel([
        Animated.timing(progressButtonTransform, {
          useNativeDriver: false,
          toValue: TOP_LEFT,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(skipButtonScale, {
          useNativeDriver: true,
          toValue: 0,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(secondButtonScale, {
          useNativeDriver: true,
          toValue: 1,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(textsScale, {
          toValue: 0,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
      ]).start(()=>{
        // finishedRound.current=true;
        // animating.current = false;
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
          Animated.timing(buttonsScale, {
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
    navigation.navigate("Home");
    AsyncStorage.setItem(ONBOARDING_SHOWN_KEY, (new Date()).toString()).then(()=>{});
  };

  const next = () => {
    if (animating.current) {return}
    setSelectedIndex(v=>(v+1)%3);
  }

  const setIndex = useCallback((i) => {
    if (animating.current) {return}
    if (i < selectedIndex) {return}
    setSelectedIndex(i);
  }, [selectedIndex])

  const firstContinue = () => {
    setSecondContainerVisible(true);
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
        <Animated.View style={styles.buttonsContainer(buttonsScale)}>
          <OnboardingButton
            scale={progressButtonScale}
            transform={progressButtonTransform}
            index={2}
            selected={selectedIndex === 2}
            setIndex={setIndex}
          />
          <OnboardingButton
            scale={reportButtonScale}
            transform={reportButtonTransform}
            index={1}
            selected={selectedIndex === 1}
            setIndex={setIndex}
          />
          <OnboardingButton
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

  buttonsContainer: (scale) => ({
    marginBottom: 16,
    ...globalStyles.onboardingButtonsContainer,
    transform: [{ scale }],
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