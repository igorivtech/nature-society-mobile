import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, Platform } from "react-native";

const showKey = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
const hideKey = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onKeyboardShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const onKeyboardHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    Keyboard.addListener(showKey, onKeyboardShow);
    Keyboard.addListener(hideKey, onKeyboardHide);
    return () => {
      // Keyboard.removeListener(showKey, onKeyboardShow);
      // Keyboard.removeListener(hideKey, onKeyboardHide);
    };
  }, []);

  return [keyboardHeight];
};
