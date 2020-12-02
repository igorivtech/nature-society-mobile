import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent } from "react-native";

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onKeyboardDidShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", onKeyboardDidShow);
    Keyboard.addListener("keyboardWillHide", onKeyboardDidHide);
    return () => {
      Keyboard.removeListener("keyboardWillShow", onKeyboardDidShow);
      Keyboard.removeListener("keyboardWillHide", onKeyboardDidHide);
    };
  }, []);

  return [keyboardHeight];
};
