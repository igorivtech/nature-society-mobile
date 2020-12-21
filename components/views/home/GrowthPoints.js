import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, Easing, Image } from "react-native";
import { UserContext } from "../../../context/context";
import { globalStyles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";

const HIDDEN_TRANSLATE_X = 130/2;
const TEXT_DURATION = 600;

export const GrowthPoints = ({isFocused, popupVisible}) => {
  
  const {state} = useContext(UserContext);
  const {user} = state;

  const [points, setPoints] = useState(0);

  const translateX = useRef(new Animated.Value(HIDDEN_TRANSLATE_X)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;

  useEffect(()=>{
    if (!isFocused || popupVisible) {
      return;
    }
    if (user && user.points !== points) {
      show(true, 1000).start(()=>{
        Animated.timing(textOpacity, {
          delay: 1000,
          toValue: 0,
          useNativeDriver: true,
          duration: TEXT_DURATION,
          easing: Easing.inOut(Easing.ease)
        }).start(()=>{
          setPoints(user.points);
          Animated.timing(textOpacity, {
            toValue: 1,
            useNativeDriver: true,
            duration: TEXT_DURATION,
            easing: Easing.inOut(Easing.ease)
          }).start(()=>{
            show(false, 3500).start();
          })
        })
      })
    }
  }, [user, isFocused, popupVisible]);

  const show = (show, delay) => {
    return Animated.parallel([
      Animated.timing(opacity, {
        delay,
        toValue: show ? 1 : 0,
        useNativeDriver: true,
        duration: 800,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(scale, {
        delay,
        toValue: show ? 1 : 0,
        useNativeDriver: true,
        duration: 800,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(translateX, {
        delay,
        toValue: show ? 0 : HIDDEN_TRANSLATE_X,
        useNativeDriver: true,
        duration: 800,
        easing: Easing.inOut(Easing.ease)
      })
    ])
  }

  return (
    <Animated.View style={globalStyles.pointsGrowthContainer(opacity, scale, translateX)}>
      <Animated.Text
        adjustsFontSizeToFit={true}
        numberOfLines={1}
        style={textStyles.pointsGrowthText(textOpacity)}
      >
        {points}
      </Animated.Text>
      <Image source={require("../../../assets/images/growth_icon.png")} />
    </Animated.View>
  );
};
