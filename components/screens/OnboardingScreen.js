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
import { styles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";
import { width, height } from "../../values/consts";
import { colors } from "../../values/colors";
import { Button, CoolButton } from "../views/onboarding/views";

const duration = 1200;

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
    navigation.push("Home");
  };

  useEffect(() => {
    if (currIndex >= 0) {
      fadeText(titles[currIndex]);
    }
    if (currIndex == 2) {
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
    setIndex(-1);
    fadeText(strings.onboardingScreen.done);
    setFinishVisible(true);
    Animated.timing(buttonsYTranslate, {
      toValue: -(height / 2 - 100),
      duration: duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    Animated.timing(doneButtonYTranslate, {
      toValue: -200,
      duration: duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    Animated.timing(doneButtonAlpha, {
      toValue: 1,
      duration: duration/2,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    Animated.timing(doneButtonScale, {
      toValue: 1,
      duration: duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    //
    Animated.timing(finishButtonAlpha, {
      toValue: 1,
      duration: duration / 2,
      useNativeDriver: true,
      delay: 2 * duration,
    }).start();
    Animated.spring(finishButtonScale, {
      toValue: 1,
      duration: duration / 2,
      useNativeDriver: true,
      delay: 2 * duration,
    }).start();
  };

  const fadeText = (text) => {
    // out
    Animated.timing(textAlpha, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start();
    // change
    setTimeout(() => {
      setCurrText(text);
      // in
      Animated.timing(textAlpha, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 200);
  };

  return (
    <View style={styles.onboardingContainer}>

      <TouchableWithoutFeedback onPress={next} style={styles.halfLeft}>
        <View style={styles.fillParent} />
      </TouchableWithoutFeedback>

      <View style={styles.onboardingMainContainer}>
        <Animated.View
          style={{
            ...styles.onboardingButtonsContainer,
            transform: [{ translateY: buttonsYTranslate }],
          }}
        >
          <Button
            index={2}
            selected={currIndex == 2}
            setIndex={setIndex}
            doneVisible={doneVisible}
          />
          <Button
            index={1}
            selected={currIndex == 1}
            setIndex={setIndex}
            doneVisible={doneVisible}
          />
          <Button
            index={0}
            selected={currIndex == 0}
            setIndex={setIndex}
            doneVisible={doneVisible}
          />
        </Animated.View>

        <Animated.Text style={{
          ...textStyles.onboardingText, 
          opacity: textAlpha,
          transform: [
            {scale: textScale}
          ]
          }}>{currText}</Animated.Text>

        {doneVisible ? (
          <Animated.View
            style={{
              opacity: doneButtonAlpha,
              marginTop: 40,
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
          <CoolButton onPress={finish} />
        </Animated.View>
      ) : null}
    </View>
  );
};
