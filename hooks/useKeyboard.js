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
    const action1 = Keyboard.addListener(showKey, onKeyboardShow);
    const action2 = Keyboard.addListener(hideKey, onKeyboardHide);
    return () => {
      action1.remove();
      action2.remove();
    };
  }, []);

  return [keyboardHeight];
};
