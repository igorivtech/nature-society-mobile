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
import { width, height, SPLASH_HIDE_DELAY, statusBarHeight, TOP_BUTTONS_CONTAINER_WIDTH, smallScreen } from "../../values/consts";
import { colors } from "../../values/colors";
import { OnboardingButton, CoolButton } from "../views/onboarding/views";
import AsyncStorage from "@react-native-community/async-storage";
import { ONBOARDING_SHOWN_KEY } from "../../hooks/memory";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text1, Text2, Text3, FirstButton, SkipButton } from "../views/onboarding/texts";
import useIsMounted from "ismounted";
import {TapView} from "../views/general"
import Carousel from 'react-native-snap-carousel';
import LottieView from 'lottie-react-native';

const animations = {
  0: require("../../assets/animations/map.json"),
  1: require("../../assets/animations/scores.json"),
  2: require("../../assets/animations/progress.json"),
}

const TRAVEL_DURATION = 600;

const TRANSLATE_Y_VALUE = -height * 0.2;
const TEXT_TRANSLATE_Y = 40;
const inputRange = [TRANSLATE_Y_VALUE, 0];

const TOP = {y: 0}
const buttonsWidth = TOP_BUTTONS_CONTAINER_WIDTH;
const LEFT = {x: 0};
const MIDDLE = {x:width*buttonsWidth/2-55/2};
const RIGHT = {x:width*buttonsWidth-55};

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

  const exploreButtonTransform = useRef(new Animated.ValueXY(TOP_RIGHT)).current;
  const reportButtonTransform = useRef(new Animated.ValueXY(TOP_MIDDLE)).current;
  const progressButtonTransform = useRef(new Animated.ValueXY(TOP_LEFT)).current;

  const exploreButtonScale = useRef(new Animated.Value(0)).current;
  const reportButtonScale = useRef(new Animated.Value(0)).current;
  const progressButtonScale = useRef(new Animated.Value(0)).current;

  const [skipButtonVisible, setSkipButtonVisible] = useState(true);
  const [secondContainerVisible, setSecondContainerVisible] = useState(false);
  const secondContainerOpacity = useRef(new Animated.Value(0)).current;
  const textsScale = useRef(new Animated.Value(0)).current;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const animating = useRef(true);

  const carouselTranslateX = useRef(new Animated.Value(-width)).current;
  const carouselOpacity = useRef(new Animated.Value(1)).current;
  const carousel = useRef();

  const [finished, setFinished] = useState(false);

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
          Animated.parallel(
            [exploreButtonScale, reportButtonScale, progressButtonScale].map(a => Animated.timing(a, {
              useNativeDriver: true,
              toValue: 1,
              easing: Easing.inOut(Easing.ease)
            }))
          ),
          Animated.timing(carouselTranslateX, {
            delay: 200,
            duration: 500,
            useNativeDriver: true,
            toValue: 0,
            easing: Easing.inOut(Easing.ease)
          }),
          Animated.timing(skipButtonScale, {
            delay: 500,
            toValue: 1,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
            duration: 300
          }),
          Animated.timing(secondButtonScale, {
            delay: 500,
            toValue: 1,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
            duration: 300
          }),
        ])
      ]).start(({finished})=>{
        // if (finished) {
        //   setTimeout(() => {
        //     fancyAnimate();
        //   }, 2000);
        // }
      })
    }
  }, [secondContainerVisible])

  const finish = () => {
    setSelectedIndex(1000);
    setFinished(true);
    [textsScale, firstButtonScale, secondButtonScale].forEach(a=>a.stopAnimation());
    Animated.parallel([
      Animated.timing(carouselOpacity, {
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
      Animated.timing(skipButtonScale, {
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

  const setIndex = useCallback((i) => {
    setSelectedIndex(i);
    carousel.current.snapToItem(i);
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
        <Animated.View style={{
            opacity: carouselOpacity,
            transform: [{translateX: carouselTranslateX}]
          }}>
          <Carousel
            inverted={true}
            onBeforeSnapToItem={(i)=>setSelectedIndex(i)}
            ref={carousel}
            loop={true}
            containerCustomStyle={styles.carousel(topSafeAreaHeight)}
            data={[0, 1, 2]}
            renderItem={({item, index})=>{
              return (
                <View style={styles.itemContainer}>
                  <View style={styles.itemInnerContainaer}>
                    <View style={styles.textsContainer}>
                      {item === 0 ? (<Text1 opacity={1} />) : (item === 1 ? (<Text2 opacity={1} />) : (<Text3 opacity={1} />))}
                    </View>
                    <View style={styles.lottieContainer}>
                      <LottieView source={animations[item]} loop={true} autoPlay={true} resizeMode={item === 0 ? 'contain' : 'cover'} />
                    </View>
                  </View>
                </View>
              )
            }}
            sliderWidth={width}
            itemWidth={width}
          />
        </Animated.View>
        <Animated.View style={styles.buttonsContainer(topSafeAreaHeight)}>
          <OnboardingButton
            finished={finished}
            scale={progressButtonScale}
            transform={progressButtonTransform}
            index={2}
            selected={selectedIndex === 2}
            setIndex={setIndex}
          />
          <OnboardingButton
            finished={finished}
            scale={reportButtonScale}
            transform={reportButtonTransform}
            index={1}
            selected={selectedIndex === 1}
            setIndex={setIndex}
          />
          <OnboardingButton
            finished={finished}
            scale={exploreButtonScale}
            transform={exploreButtonTransform}
            index={0}
            selected={selectedIndex === 0}
            setIndex={setIndex}
          />
        </Animated.View>
        <FirstButton altTitle={true} scale={secondButtonScale} bottomSafeAreaInset={bottomSafeAreaInset-32} onPress={finish} />
        <SkipButton scale={skipButtonScale} bottomSafeAreaInset={bottomSafeAreaInset-62} onPress={finish} />
      </Animated.View>
    </View>
  )
};


const styles = StyleSheet.create({

  textsContainer: {
    alignItems: 'center',
  },

  lottieContainer: {
    marginTop: 16,
    flexGrow: 1,
    flexShrink: 1
  },

  itemInnerContainaer: {
    ...StyleSheet.absoluteFill,
    margin: 16,
    padding: 32,
    backgroundColor: 'white',
    ...globalStyles.shadow,
    borderRadius: 30
  },

  itemContainer: {
    width: '100%',
    height: '100%',
  },

  carousel: (topSafeAreaHeight) => ({
    marginTop: topSafeAreaHeight + 16 + (smallScreen ? 50 : 58),
    marginBottom: smallScreen ? 90 : 150
  }),

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