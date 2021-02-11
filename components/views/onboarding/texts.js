import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet, TouchableOpacity, Text } from "react-native";
import { strings } from "../../../values/strings";
import { globalStyles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";
import { colors } from "../../../values/colors";
import Highlighter from "react-native-highlight-words";
import { smallScreen } from "../../../values/consts";

export const TextsView = ({ index, scale }) => {
  const opacity_0 = useRef(new Animated.Value(1)).current;
  const opacity_1 = useRef(new Animated.Value(0)).current;
  const opacity_2 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel(
      [opacity_0, opacity_1, opacity_2].map((v, i) =>
        Animated.timing(v, {
          useNativeDriver: true,
          toValue: i === index ? 1 : 0,
          easing: Easing.inOut(Easing.ease),
        })
      )
    ).start();
  }, [index]);
  return (
    <Animated.View style={styles.textsContainer(scale)}>
      <Text1 opacity={opacity_0} />
      <Text2 opacity={opacity_1} />
      <Text3 opacity={opacity_2} />
    </Animated.View>
  );
};

const fontSize = smallScreen ? 18 : 24

const Highlight = ({
  regular,
  highlight,
  text,
  words,
  position = "relative",
}) => {
  return (
    <Highlighter
      adjustsFontSizeToFit={true} 
      numberOfLines={smallScreen ? 4 : 3}
      style={[regular, { position, lineHeight: regular.fontSize }]}
      highlightStyle={highlight}
      searchWords={words}
      textToHighlight={text}
    />
  );
};

export const Text1 = ({ opacity }) => {
  return (
    <Animated.View style={{ opacity, ...globalStyles.centerChildren }}>
      <Highlight
        regular={textStyles.normalOfSize(fontSize, colors.darkWithTone, "center")}
        highlight={textStyles.normalOfSize(fontSize, colors.clear, "center")}
        text={strings.onboardingScreen.newItem1}
        words={[
          'חפשו',
          "נקיים", "ריקים מאדם",
          "מלוכלכים", "עמוסים במבקרים"
        ]}
      />
      <Highlight
        position="absolute"
        regular={textStyles.normalOfSize(fontSize, colors.clear, "center")}
        highlight={textStyles.boldOfSize(fontSize, colors.darkWithTone, "center")}
        text={strings.onboardingScreen.newItem1}
        words={["חפשו"]}
      />
      <Highlight
        position="absolute"
        regular={textStyles.normalOfSize(fontSize, colors.clear, "center")}
        highlight={textStyles.normalOfSize(fontSize, colors.treeBlues, "center")}
        text={strings.onboardingScreen.newItem1}
        words={["נקיים", "ריקים מאדם"]}
      />
      <Highlight
        position="absolute"
        regular={textStyles.normalOfSize(fontSize, colors.clear, "center")}
        highlight={textStyles.normalOfSize(fontSize, colors.desertRock, "center")}
        text={strings.onboardingScreen.newItem1}
        words={["מלוכלכים", "עמוסים במבקרים"]}
      />
    </Animated.View>
  );
};

export const Text2 = ({ opacity }) => {
  return (
    <Animated.View
      style={{
        ...globalStyles.centerChildren,
        opacity,
      }}
    >
      <Highlight
        regular={textStyles.normalOfSize(fontSize, colors.darkWithTone, "center")}
        highlight={textStyles.boldOfSize(fontSize, colors.darkWithTone, "center")}
        text={strings.onboardingScreen.newItem2}
        words={["דווחו"]}
      />
    </Animated.View>
  );
};

export const Text3 = ({ opacity }) => {
  return (
    <Animated.View
      style={{
        ...globalStyles.centerChildren,
        opacity,
      }}
    >
      <Highlight
        regular={textStyles.normalOfSize(fontSize, colors.darkWithTone, "center")}
        highlight={textStyles.boldOfSize(fontSize, colors.darkWithTone, "center")}
        text={strings.onboardingScreen.newItem3}
        words={["התקדמו"]}
      />
    </Animated.View>
  );
};

export const SkipButton = ({zIndex, scale, onPress, bottomSafeAreaInset}) => {
  return (
    <View style={styles.firstButtonOuterOuterContainer(zIndex, bottomSafeAreaInset)}>
      <Animated.View style={styles.firstButtonOuterContainer(scale)}>
        <TouchableOpacity onPress={onPress}>
          <Text style={textStyles.normalOfSize(14, colors.darkWithTone, "center")}>
            {strings.onboardingScreen.skipButton}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export const FirstButton = ({ zIndex, altTitle=false, scale, onPress, bottomSafeAreaInset, altTitleString = null }) => {
  return (
    <View style={styles.firstButtonOuterOuterContainer(zIndex, bottomSafeAreaInset)}>
      <Animated.View style={styles.firstButtonOuterContainer(scale)}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.firstButtonContainer(altTitle)}>
            <Text style={textStyles.boldOfSize(26, altTitle ? colors.treeBlues : "white", "center")}>
              {altTitle ? (altTitleString ?? strings.onboardingScreen.secondButton) : strings.onboardingScreen.firstButton}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  textsContainer: (scale) => ({
    opacity: scale,
    transform: [{scale}],
    ...globalStyles.shadow,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 16,
  }),
  firstButtonOuterOuterContainer: (zIndex, bottomSafeAreaInset) => ({
    zIndex,
    position: 'absolute',
    bottom: bottomSafeAreaInset + 75,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  firstButtonOuterContainer: (scale) => ({
    transform: [{scale}],
  }),
  firstButtonContainer: (alt) => ({
    borderWidth: alt ? 2 : 0,
    borderColor: alt ? colors.treeBlues : colors.clear,
    height: 42,
    width: 231,
    borderRadius: 7.5,
    backgroundColor: alt ? 'white' : colors.treeBlues,
    justifyContent: 'center',
    alignItems: 'center',
    ...(alt ? globalStyles.shadow : {})
  }),
});
