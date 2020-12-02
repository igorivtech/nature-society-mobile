import React, { useRef } from "react";
import { Animated, Easing, StyleSheet, TextInput, View } from "react-native";
import { colors } from "../../../values/colors";
import { textStyles } from "../../../values/textStyles";

const DURATION = 300;
const TEXT_SCALE = 0.7;

export const Input = ({ autoCapitalize = 'words', keyboardType = 'default', title, value, onChange, secure = false, extraMargin = false }) => {
  
  const textTranslateY = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(1)).current;
  const placeholderWidth = useRef();
  const placeholderHeight = useRef();

  const onBlur = () => {
    if (value.length === 0) {
      Animated.parallel([
        Animated.timing(textTranslateY, {
          duration: DURATION,
          useNativeDriver: true,
          toValue: 0,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(textTranslateX, {
          duration: DURATION,
          useNativeDriver: true,
          toValue: 0,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(textScale, {
          duration: DURATION,
          useNativeDriver: true,
          toValue: 1,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start();
    } else {
      // ?
    }
  };

  const onFocus = () => {
    Animated.parallel([
      Animated.timing(textTranslateY, {
        duration: DURATION,
        useNativeDriver: true,
        toValue: -30, // -placeholderHeight.current - 12,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(textTranslateX, {
        duration: DURATION,
        useNativeDriver: true,
        toValue: placeholderWidth.current * (1 - TEXT_SCALE)/2,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(textScale, {
        duration: DURATION,
        useNativeDriver: true,
        toValue: TEXT_SCALE,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  };

  return (
    <View style={styles.animatedTextContainer(extraMargin ? 64 : 32)}>
      <Animated.Text onLayout={(e) => {
        placeholderWidth.current = e.nativeEvent.layout.width;
        placeholderHeight.current = e.nativeEvent.layout.height;
      }} style={styles.animatedPlaceholder(textTranslateX, textTranslateY, textScale)}>
        {title}
      </Animated.Text>
      <TextInput
        underlineColorAndroid={colors.clear}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChange}
        secureTextEntry={secure}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        style={styles.textInput}
        selectionColor={colors.desertRock}
      />
    </View>
  );
};


const styles = StyleSheet.create({

    textInput: {
      ...textStyles.normalOfSize(18),
      color: colors.treeBlues,
    },
  
    animatedPlaceholder: (translateX, translateY, scale) => ({
      transform: [{ translateX }, { translateY }, { scale }],
      position: "absolute",
      right: 4,
      bottom: 4,
      ...textStyles.normalOfSize(18),
      color: colors.treeBlues,
      textDecorationLine: "underline",
    }),
  
    animatedTextContainer: (marginBottom) => ({
      width: "100%",
      paddingTop: 8,
      borderBottomColor: colors.treeBlues,
      borderBottomWidth: 1,
      paddingBottom: 4,
      marginBottom,
    }),
  
  });
  