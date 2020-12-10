import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  Easing,
} from "react-native";
import { colors } from "../../values/colors";
import { width } from "../../values/consts";
import { strings } from "../../values/strings";
import { globalStyles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";

const DURATION = 300;

export const Popup = ({ title, popupVisible, setPopupVisible, action }) => {
  const close = () => {
    setPopupVisible(false);
  };

  const doAction = () => {
    setPopupVisible(false);
    action();
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        useNativeDriver: true,
        duration: DURATION,
        toValue: popupVisible ? 1 : 0.5,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(opacity, {
        useNativeDriver: true,
        duration: DURATION,
        toValue: popupVisible ? 1 : 0,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  }, [popupVisible]);

  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  return (
    <Modal transparent={true} animationType="fade" visible={popupVisible}>
      <View style={popupStyles.bg}>
        <TouchableWithoutFeedback
          style={StyleSheet.absoluteFill}
          onPress={close}
        >
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        <Animated.View style={popupStyles.cardContainer(scale, opacity)}>
          <Text style={popupStyles.title}>{title}</Text>
          <PopupButton
            title={strings.reportScreen.popupNo}
            onPress={close}
            filled={true}
          />
          <PopupButton
            title={strings.reportScreen.popupYes}
            onPress={doAction}
            filled={false}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const PopupButton = ({ filled, title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={popupStyles.buttonContainer(filled)}>
        <Text style={popupStyles.buttonTitle(filled)}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const popupStyles = StyleSheet.create({
  title: {
    marginBottom: 20,
    ...textStyles.normalOfSize(18),
    color: colors.treeBlues,
  },

  cardContainer: (scale, opacity) => ({
    opacity,
    transform: [{ scale }],
    marginHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 24,
    ...globalStyles.shadow,
    paddingHorizontal: 40,
    width: 314,
    maxWidth: width - 2 * 30,
    alignSelf: "center",
    paddingVertical: 34,
  }),

  bg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(196, 224, 85, 0.5)",
    justifyContent: "center",
    alignItems: "stretch",
  },

  buttonTitle: (filled) => ({
    ...textStyles.boldOfSize(24),
    color: filled ? "white" : colors.treeBlues,
    textAlign: "center",
  }),

  buttonContainer: (filled) => ({
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.treeBlues,
    marginTop: 12,
    backgroundColor: filled ? colors.treeBlues : "white",
    height: 45,
    width: "100%",
  }),
});
