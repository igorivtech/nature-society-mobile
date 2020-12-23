import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import { strings } from "../../values/strings";
import { globalStyles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";
import { width, height } from "../../values/consts";
import { colors } from "../../values/colors";
import { OnboardingButton, CoolButton } from "../views/onboarding/views";
import AsyncStorage from "@react-native-community/async-storage";
import { ONBOARDING_SHOWN_KEY } from "../../hooks/memory";

const doneDuration = 1600;

const titles = {
  0: strings.onboardingScreen.item1,
  1: strings.onboardingScreen.item2,
  2: strings.onboardingScreen.item3,
};

export const OnboardingScreen = ({ navigation }) => {
  const [currText, setCurrText] = useState(strings.onboardingScreen.item1);
  const [currIndex, setIndex] = useState(0);
  const [doneVisible, setDoneVisible] = useState(false);
  const [finishVisible, setFinishVisible] = useState(false);

  //

  const buttonsYTranslate = useRef(new Animated.Value(0)).current;
  const doneButtonYTranslate = useRef(new Animated.Value(0)).current;
  const doneButtonAlpha = useRef(new Animated.Value(0)).current;
  const doneButtonScale = useRef(new Animated.Value(0)).current;
  const finishButtonAlpha = useRef(new Animated.Value(0)).current;
  const finishButtonScale = useRef(new Animated.Value(0.5)).current;
  const textAlpha = useRef(new Animated.Value(1)).current;
  const textScale = useRef(new Animated.Value(0)).current;

  useEffect(()=>{
    Animated.timing(textScale, {
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
      setIndex(currIndex + 1);
    }
  };

  const finish = () => {
    navigation.navigate("Home");
    AsyncStorage.setItem(ONBOARDING_SHOWN_KEY, "true").then(()=>{});
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

  return (
    <View style={globalStyles.onboardingContainer}>

      <TouchableWithoutFeedback onPress={next} style={globalStyles.halfLeft}>
        <View style={globalStyles.halfLeftInner} />
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

        <Animated.Text style={{
          ...textStyles.onboardingText, 
          opacity: textAlpha,
          height: 100,
          transform: [
            {scale: textScale}
          ]
          }}>{currText}</Animated.Text>

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
