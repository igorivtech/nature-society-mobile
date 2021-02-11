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

const AnimatedCarousel = Animated.createAnimatedComponent(Carousel);

const animations = {
  0: require("../../assets/animations/map.json"),
  1: require("../../assets/animations/scores.json"),
  2: require("../../assets/animations/progress.json"),
}

const TRAVEL_DURATION = 600;

const TRANSLATE_Y_VALUE = -height * 0.2;
const TEXT_TRANSLATE_Y = 40;
const inputRange = [TRANSLATE_Y_VALUE, 0];

const BOTTOM = {y: (height-statusBarHeight)*0.5 - (smallScreen ? 145 : 165)}
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
  const customAnimating = useRef(false);
  const allShown = useRef(false);

  const carouselTranslateX = useRef(new Animated.Value(-width)).current;
  const carousel = useRef();

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
    
  }

  useEffect(()=>{
    // if (customAnimating.current) {return}
    // if (allShown.current) {return}
    // //
    // if (selectedIndex === 1) {
    //   animating.current = true;
    //   Animated.sequence([
    //     Animated.parallel([
    //       Animated.timing(exploreButtonTransform, {
    //         duration: TRAVEL_DURATION,
    //         useNativeDriver: true,
    //         toValue: TOP_RIGHT,
    //         easing: Easing.inOut(Easing.ease)
    //       }),
    //       Animated.timing(reportButtonTransform, {
    //         duration: TRAVEL_DURATION,
    //         useNativeDriver: true,
    //         toValue: BOTTOM_MIDDLE,
    //         easing: Easing.inOut(Easing.ease)
    //       }),
    //     ]),
    //     Animated.delay(2000),
    //     Animated.parallel([
    //       Animated.timing(reportButtonTransform, {
    //         duration: TRAVEL_DURATION,
    //         useNativeDriver: true,
    //         toValue: BOTTOM_MIDDLE_RIGHT,
    //         easing: Easing.inOut(Easing.ease)
    //       }),
    //       Animated.timing(progressButtonScale, {
    //         duration: TRAVEL_DURATION,
    //         useNativeDriver: true,
    //         toValue: 1,
    //         easing: Easing.inOut(Easing.ease)
    //       })
    //     ])
    //   ]).start(()=>{
    //     animating.current = false;
    //   });
    // } else if (selectedIndex === 2) {
    //   allShown.current = true;
    //   animating.current = true;
    //   setSkipButtonVisible(false);
    //   Animated.parallel([
    //     Animated.timing(reportButtonTransform, {
    //       duration: TRAVEL_DURATION,
    //       useNativeDriver: true,
    //       toValue: TOP_MIDDLE,
    //       easing: Easing.inOut(Easing.ease)
    //     }),
    //     Animated.timing(progressButtonTransform, {
    //       duration: TRAVEL_DURATION,
    //       useNativeDriver: true,
    //       toValue: BOTTOM_MIDDLE,
    //       easing: Easing.inOut(Easing.ease)
    //     }),
    //     Animated.timing(skipButtonScale, {
    //       duration: TRAVEL_DURATION,
    //       useNativeDriver: true,
    //       toValue: 0,
    //       easing: Easing.inOut(Easing.ease)
    //     }),
    //     Animated.timing(secondButtonScale, {
    //       duration: TRAVEL_DURATION,
    //       useNativeDriver: true,
    //       toValue: 1,
    //       easing: Easing.inOut(Easing.ease)
    //     }),
    //   ]).start(()=>{
    //     animating.current = false;
    //   });
    // }
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
          })
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
    // if (animating.current) {return}
    const index = (selectedIndex+1)%3;
    setIndex(index);
    carousel.current.snapToItem(index);
  }

  const setIndex = useCallback((i) => {
    setSelectedIndex(i);
    carousel.current.snapToItem(i);
    // if (animating.current) {return}
    // if (i === selectedIndex) {return}
    // if (allShown.current) {
    //   if (i === 0) {
    //     animateIcons(
    //       BOTTOM_MIDDLE, 1,
    //       TOP_MIDDLE, 1,
    //       TOP_LEFT, 1,
    //     )
    //   } else if (i === 1) {
    //     animateIcons(
    //       TOP_RIGHT, 1,
    //       BOTTOM_MIDDLE, 1,
    //       TOP_LEFT, 1,
    //     )
    //   } else if (i === 2) {
    //     animateIcons(
    //       TOP_RIGHT, 1,
    //       TOP_MIDDLE, 1,
    //       BOTTOM_MIDDLE, 1,
    //     )
    //   }
    //   setSelectedIndex(i);
    // } else {
    //   if (i === 0 && selectedIndex === 1) {
    //     animateIcons(
    //       BOTTOM_MIDDLE_RIGHT, 1,
    //       BOTTOM_MIDDLE_LEFT, 1,
    //       BOTTOM_MIDDLE_LEFT, 0,
    //     )
    //     setSelectedIndex(0);
    //   } else {
    //     setSelectedIndex(i);
    //   }
    // }
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
        useNativeDriver: true,
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
        useNativeDriver: true,
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
        useNativeDriver: true,
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

  const renderText = (item) => {

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
        <Animated.View style={{
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
                      <LottieView source={animations[item]} loop={true} autoPlay={true} />
                    </View>
                  </View>
                </View>
              )
            }}
            sliderWidth={width}
            itemWidth={width}
          />
        </Animated.View>
        <FirstButton zIndex={skipButtonVisible ? 2 : 3} altTitle={true} scale={secondButtonScale} bottomSafeAreaInset={bottomSafeAreaInset} onPress={finish} />
        <SkipButton zIndex={skipButtonVisible ? 3 : 2} scale={skipButtonScale} bottomSafeAreaInset={bottomSafeAreaInset} onPress={finish} />
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
    marginTop: topSafeAreaHeight + 16 + 64,
    marginBottom: 160
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