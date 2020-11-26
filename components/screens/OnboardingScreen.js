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

const CoolButton = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor: colors.treeBlues,
          height: 44,
          width: 222,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={textStyles.onboardingCoolButton}>
          {strings.onboardingScreen.coolButton}
        </Text>
      </View>
    </Pressable>
  );
};

export const OnboardingScreen = () => {
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

  const next = () => {
    if (doneVisible) {
      return;
    }
    if (currIndex < 2) {
      setIndex(currIndex + 1);
    }
  };

  const finish = () => {
    console.log("finish");
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
    //
    Animated.timing(finishButtonAlpha, {
      toValue: 1,
      duration: duration/2,
      useNativeDriver: true,
      delay: 2*duration
    }).start();
    Animated.spring(finishButtonScale, {
      toValue: 1,
      duration: duration/2,
      useNativeDriver: true,
      delay: 2*duration
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
