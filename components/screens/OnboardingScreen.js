import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { strings } from "../../values/strings";
import { globalStyles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";
import { width, height, SPLASH_HIDE_DELAY } from "../../values/consts";
import { colors } from "../../values/colors";
import { OnboardingButton, CoolButton } from "../views/onboarding/views";
import AsyncStorage from "@react-native-community/async-storage";
import { ONBOARDING_SHOWN_KEY } from "../../hooks/memory";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Highlighter from 'react-native-highlight-words';
import { TextsView, FirstButton } from "../views/onboarding/texts";

const doneDuration = 1600;
const TRANSLATE_Y_VALUE = -height * 0.2;
const TEXT_TRANSLATE_Y = 40;
const inputRange = [TRANSLATE_Y_VALUE, 0];

const titles = {
  0: strings.onboardingScreen.item1,
  1: strings.onboardingScreen.item2,
  2: strings.onboardingScreen.item3,
};

export const OnboardingScreen = ({ navigation }) => {
  const [currText, setCurrText] = useState(strings.onboardingScreen.item1);
  const [currIndex, setIndex] = useState(-1);
  const [doneVisible, setDoneVisible] = useState(false);
  const [finishVisible, setFinishVisible] = useState(false);

  //

  const {bottomSafeAreaInset} = useSafeAreaInsets();

  const buttonsYTranslate = useRef(new Animated.Value(0)).current;
  const doneButtonYTranslate = useRef(new Animated.Value(0)).current;
  const doneButtonAlpha = useRef(new Animated.Value(0)).current;
  const doneButtonScale = useRef(new Animated.Value(0)).current;
  const finishButtonAlpha = useRef(new Animated.Value(0)).current;
  const finishButtonScale = useRef(new Animated.Value(0.5)).current;
  const textAlpha = useRef(new Animated.Value(1)).current;
  const textScale = useRef(new Animated.Value(0)).current;

  useEffect(()=>{
    setTimeout(() => {
      setIndex(0);
    }, SPLASH_HIDE_DELAY);
    Animated.timing(textScale, {
      delay: SPLASH_HIDE_DELAY,
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true
    }).start();
  }, []);
  
  const next = () => {
    if (doneVisible) {
      return;
    }
    if (currIndex < 2) {
      setIndex(v=>v+1);
    }
  };

  const previous = () => {
    if (doneVisible) {
      return;
    }
    if (currIndex > 0) {
      setIndex(v=>v-1);
    }
  };

  const finish = () => {
    navigation.navigate("Home");
    AsyncStorage.setItem(ONBOARDING_SHOWN_KEY, (new Date()).toString()).then(()=>{});
  };

  useEffect(() => {
    if (currIndex >= 0) {
      fadeText(titles[currIndex]);
    }
    if (currIndex === 2) {
      setDoneVisible(true);
      Animated.timing(doneButtonAlpha, {
        toValue: 0.5,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
        delay: 1500,
      }).start();
      Animated.timing(doneButtonScale, {
        toValue: 0.8,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
        delay: 1500,
      }).start();
    }
  }, [currIndex]);

  const doneOnPress = () => {
    if (currIndex === -1) {
      return;
    }
    setIndex(-1);
    setTimeout(()=>{
      fadeText(strings.onboardingScreen.done);
    }, 100);
    setFinishVisible(true);
    // Hstack buttons
    Animated.timing(buttonsYTranslate, {
      toValue: -(height / 2 - 100),
      duration: doneDuration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    // done button
    Animated.timing(doneButtonYTranslate, {
      toValue: -200,
      duration: doneDuration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    Animated.timing(doneButtonAlpha, {
      toValue: 1,
      duration: doneDuration/2,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    Animated.timing(doneButtonScale, {
      toValue: 1,
      duration: doneDuration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    // finish button
    Animated.timing(finishButtonAlpha, {
      toValue: 1,
      duration: doneDuration / 2,
      useNativeDriver: true,
      delay: 2 * doneDuration,
    }).start();
    Animated.spring(finishButtonScale, {
      toValue: 1,
      duration: doneDuration / 2,
      useNativeDriver: true,
      delay: 2 * doneDuration,
    }).start();
  };

  const fadeText = (text) => {
    // out
    Animated.timing(textAlpha, {
      toValue: 0.1,
      duration: 200,
      useNativeDriver: true,
    }).start(()=>{
      setCurrText(text);
      Animated.timing(textAlpha, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

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

  const [secondContainerVisible, setSecondContainerVisible] = useState(false);
  const secondContainerOpacity = useRef(new Animated.Value(0)).current;
  const textsScale = useRef(new Animated.Value(0)).current;
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
        Animated.timing(textsScale, {
          toValue: 1,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
          duration: 500
        }),
      ]).start(({finished})=>{
        if (finished) {
          loopTexts();
        }
      })
    }
  }, [secondContainerVisible])

  const loopTexts = () => {
    setTimeout(() => {
      setSelectedIndex(v=>(v+1)%3);
      loopTexts();
    }, 6000);
  }

  const firstContinue = () => {
    setSecondContainerVisible(true);
  }

  const [selectedIndex, setSelectedIndex] = useState(0);

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
        <Animated.View
            style={{
              marginBottom: 16,
              ...globalStyles.onboardingButtonsContainer,
              transform: [{ scale: textsScale }],
            }}
          >
          <OnboardingButton
            index={2}
            selected={selectedIndex === 2}
            setIndex={setSelectedIndex}
          />
          <OnboardingButton
            index={1}
            selected={selectedIndex === 1}
            setIndex={setSelectedIndex}
          />
          <OnboardingButton
            index={0}
            selected={selectedIndex === 0}
            setIndex={setSelectedIndex}
          />
        </Animated.View>
        <TextsView scale={textsScale} index={selectedIndex} />
      </Animated.View>
    </View>
  )

  return (
    <View style={globalStyles.onboardingContainer}>

      <TouchableWithoutFeedback onPress={next} style={globalStyles.halfLeft}>
        <View style={globalStyles.halfLeftInner} />
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={previous} style={globalStyles.halfRight}>
        <View style={globalStyles.halfRightInner} />
      </TouchableWithoutFeedback>

      <View style={globalStyles.onboardingMainContainer}>
        <Animated.View
          style={{
            ...globalStyles.onboardingButtonsContainer,
            transform: [{ translateY: buttonsYTranslate }],
          }}
        >
          <OnboardingButton
            index={2}
            selected={currIndex === 2}
            setIndex={setIndex}
            doneVisible={doneVisible}
          />
          <OnboardingButton
            index={1}
            selected={currIndex === 1}
            setIndex={setIndex}
            doneVisible={doneVisible}
          />
          <OnboardingButton
            index={0}
            selected={currIndex === 0}
            setIndex={setIndex}
            doneVisible={doneVisible}
          />
        </Animated.View>

        <View pointerEvents='none'>
          <Animated.Text numberOfLines={3} adjustsFontSizeToFit={true} style={{
            ...textStyles.onboardingText, 
            opacity: textAlpha,
            height: 80,
            transform: [
              {scale: textScale}
            ]
          }}>
            {currText}
          </Animated.Text>
        </View>

        {doneVisible ? (
          <Animated.View
            style={{
              opacity: doneButtonAlpha,
              transform: [
                { translateY: doneButtonYTranslate },
                { scale: doneButtonScale },
              ],
            }}
          >
            <Pressable onPress={doneOnPress}>
              <Image
                source={require("../../assets/images/onboarding_done.png")}
              />
            </Pressable>
          </Animated.View>
        ) : null}
      </View>

      {finishVisible ? (
        <Animated.View
          style={{
            transform: [{ scale: finishButtonScale }],
            opacity: finishButtonAlpha,
            position: "absolute",
            bottom: 50,
          }}
        >
          <CoolButton title={strings.onboardingScreen.coolButton} onPress={finish} />
        </Animated.View>
      ) : null}
    </View>
  );
};


const styles = StyleSheet.create({
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