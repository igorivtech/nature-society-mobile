import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, Platform } from "react-native";

const showKey = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
const hideKey = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onKeyboardDidShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    Keyboard.addListener(showKey, onKeyboardDidShow);
    Keyboard.addListener(hideKey, onKeyboardDidHide);
    return () => {
      Keyboard.removeListener(showKey, onKeyboardDidShow);
      Keyboard.removeListener(hideKey, onKeyboardDidHide);
    };
  }, []);

  return [keyboardHeight];
};
