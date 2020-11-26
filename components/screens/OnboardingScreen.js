import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { strings } from "../../values/strings";
import { styles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";

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

const Button = ({ index, selected, setIndex, onDone, style, doneVisible = false }) => {
  const onPress = () => {
    if (setIndex != null) {
      if (doneVisible) {
        return;
      }
      setIndex(index);
    } else if (onDone != null) {
      onDone();
    }
  };

  return (
    <Pressable onPress={onPress} style={style}>
      <Image
        style={{
          opacity: selected ? 1 : 0.5,
          transform: [{ scale: selected ? 1 : 0.8 }],
        }}
        source={
          index != null
            ? images[index]
            : require("../../assets/images/onboarding_done.png")
        }
      />
    </Pressable>
  );
};

export const OnboardingScreen = () => {
  const [currText, setCurrText] = useState(strings.onboardingScreen.item1);
  const [currIndex, setIndex] = useState(0);
  const [doneActive, setDoneActive] = useState(false);
  const [doneVisible, setDoneVisible] = useState(false);

  const next = () => {
    if (currIndex < 2) {
      setIndex(currIndex + 1);
    }
  };

  useEffect(() => {
    if (currIndex >= 0) {
      setCurrText(titles[currIndex]);
    }
    if (currIndex == 2) {
      setTimeout(() => {
        setDoneVisible(true);
      }, 2000);
    }
  }, [currIndex]);

  const doneOnPress = () => {
    setDoneActive(true);
    setIndex(-1);
    setCurrText(strings.onboardingScreen.done);
  };

  return (
    <View style={styles.onboardingContainer}>
      <TouchableWithoutFeedback onPress={next} style={styles.halfLeft}>
        <View style={styles.fillParent} />
      </TouchableWithoutFeedback>

      <View style={styles.onboardingMainContainer}>
        <View style={styles.onboardingButtonsContainer}>
          <Button index={2} selected={currIndex == 2} setIndex={setIndex} doneVisible={doneVisible} />
          <Button index={1} selected={currIndex == 1} setIndex={setIndex} doneVisible={doneVisible} />
          <Button index={0} selected={currIndex == 0} setIndex={setIndex} doneVisible={doneVisible} />
        </View>
        <Text style={textStyles.onboardingText}>{currText}</Text>

        {doneVisible ? (
          <Button selected={doneActive} onDone={doneOnPress} style={{marginTop: 50}} />
        ) : null}
      </View>
    </View>
  );
};
