import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../../values/colors";
import { smallScreen } from "../../../values/consts";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";

const DURATION = 300;
const TEXT_SCALE = 0.7;

export const Input = ({ autoCapitalize = 'words', keyboardType = 'default', title, value, onChange, secure = false, extraMargin = false, passwordHint = false }) => {
  
  const textTranslateY = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(1)).current;
  const placeholderWidth = useRef();
  const placeholderHeight = useRef();

  useEffect(()=>{
    if (value.length > 0 && textTranslateY._value === 0) {
      setTimeout(() => {
        textTranslateY.setValue(-30);
        textTranslateX.setValue((placeholderWidth.current ?? title.length * 7.4) * (1 - TEXT_SCALE)/2);
        textScale.setValue(TEXT_SCALE);  
      }, DURATION/3);
    }
  }, [value])

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

  const passwordHintOpacity = useRef(new Animated.Value(value.length < 8 ? 1 : 0)).current;
  useEffect(()=>{
    if (passwordHint) {
      Animated.timing(passwordHintOpacity, {
        duration: 200,
        toValue: value.length < 8 ? 1 : 0,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }).start();
    }
  }, [value])

  return (
    <View style={styles.animatedTextContainer(extraMargin ? (smallScreen ? 44 : 64) : (smallScreen ? 26 : 32))}>
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
      {passwordHint ? (
        <Animated.Text style={styles.passwordHint(passwordHintOpacity)}>{strings.loginScreen.passwordLength}</Animated.Text>
      ) : null}
    </View>
  );
};


const styles = StyleSheet.create({

    passwordHint: (opacity) => ({
      opacity,
      position: 'absolute',
      right: 3,
      bottom: -22,
      ...textStyles.normalOfSize(12, colors.treeBlues),
    }),

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
  