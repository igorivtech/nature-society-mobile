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

const duration = 1200;

const images = {
  0: require("../../assets/images/Explore.png"),
  1: require("../../assets/images/Report.png"),
  2: require("../../assets/images/Progress.png"),
};

const titles = {
  0: strings.onboardingScreen.item1,
  1: strings.onboardingScreen.item2,
  2: strings.onboardingScreen.item3,
};

const Button = ({ index, selected, setIndex, doneVisible = false }) => {
  const onPress = () => {
    if (setIndex != null) {
      if (doneVisible) {
        return;
      }
      setIndex(index);
    }
  };

  return (
    <Pressable onPress={onPress}>
      <Image
        style={{
          opacity: selected ? 1 : 0.5,
          transform: [{ scale: selected ? 1 : 0.8 }],
        }}
        source={images[index]}
      />
    </Pressable>
  );
};

export const OnboardingScreen = () => {
  const [currText, setCurrText] = useState(strings.onboardingScreen.item1);
  const [currIndex, setIndex] = useState(0);
  const [doneVisible, setDoneVisible] = useState(false);

  //

  const buttonsYTranslate = useRef(new Animated.Value(0)).current;
  const doneButtonYTranslate = useRef(new Animated.Value(0)).current;
  const doneButtonAlpha = useRef(new Animated.Value(0)).current;
  const doneButtonScale = useRef(new Animated.Value(0)).current;

  const next = () => {
    if (doneVisible) {
      return;
    }
    if (currIndex < 2) {
      setIndex(currIndex + 1);
    }
  };

  useEffect(() => {
    if (currIndex >= 0) {
      setCurrText(titles[currIndex]);
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
    setCurrText(strings.onboardingScreen.done);

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
      duration: duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    Animated.timing(doneButtonScale, {
      toValue: 1,
      duration: duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
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
        <Text style={textStyles.onboardingText}>{currText}</Text>

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
      </View>
    </View>
  );
};
