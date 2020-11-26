import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { strings } from "../../../values/strings";
import { styles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";

const images = {
  0: require("../../../assets/images/Explore.png"),
  1: require("../../../assets/images/Report.png"),
  2: require("../../../assets/images/Progress.png"),
};

const titles = {
  0: strings.onboardingScreen.item1,
  1: strings.onboardingScreen.item2,
  2: strings.onboardingScreen.item3,
};

const Button = ({ index, selected, setIndex }) => {
  const onPress = () => {
    setIndex(index);
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

export const OnboardingPagination = () => {
  const [currText, setCurrText] = useState(strings.onboardingScreen.item1);
  const [currIndex, setIndex] = useState(0);

  const next = () => {
    if (currIndex < 2) {
      setIndex(currIndex + 1);
    }
  };

  useEffect(() => {
    setCurrText(titles[currIndex]);
  }, [currIndex]);

  return (
    <View style={styles.onboardingMainContainer}>
      <View style={styles.onboardingButtonsContainer}>
        <Button index={2} selected={currIndex == 2} setIndex={setIndex} />
        <Button index={1} selected={currIndex == 1} setIndex={setIndex} />
        <Button index={0} selected={currIndex == 0} setIndex={setIndex} />
      </View>
      <Text style={textStyles.onboardingText}>{currText}</Text>
    </View>
  );
};
