import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, Text } from "react-native";
import * as Animatable from "react-native-animatable";
import { UserContext } from "../../../context/context";
import { globalStyles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";

const animation = {
  0: {
    opacity: 1,
    transform: [{ translateX: 0 }, { scale: 1 }],
  },
  1: {
    opacity: 0,
    transform: [{ translateX: 130 / 2 }, { scale: 0 }],
  },
};

const enterAnimation = {
  0: {
    opacity: 0,
    transform: [{ translateX: 130 / 2 }, { scale: 0 }],
  },
  1: {
    opacity: 1,
    transform: [{ translateX: 0 }, { scale: 1 }],
  },
};

const opacity = (on) => ({
  0: {
    opacity: on ? 0 : 1,
  },
  1: {
    opacity: on ? 1 : 0,
  },
});

const TEXT_DURATION = 600;

export const GrowthPoints = ({isFocused, popupVisible}) => {
  const {state} = useContext(UserContext);
  const {user} = state;

  useEffect(()=>{
    if (!isFocused || popupVisible) {
      return;
    }
    if (user) {
      if (user.points !== points) {
        if (points === 0) { // first time
          setTimeout(() => {
            if (textRef.current == null) {return}
            textRef.current.animate(opacity(false), TEXT_DURATION).then(() => {
              if (textRef.current == null) {return}
              setPoints(user.points);
              textRef.current.animate(opacity(true), TEXT_DURATION).then(() => {
                disappear(2500);
              });
            });
          }, 2000);
        } else {
          setTimeout(() => {
            if (containerRef.current == null) {return}
            containerRef.current.animate(enterAnimation, 800).then(()=>{
              setTimeout(() => {
                if (textRef.current == null) {return}
                textRef.current.animate(opacity(false), TEXT_DURATION).then(() => {
                  if (textRef.current == null) {return}
                  setPoints(user.points);
                  textRef.current.animate(opacity(true), TEXT_DURATION).then(() => {
                    disappear(3500);
                  });
                });
              }, 1000);
            });
          }, 1000);
        }
      }
    }
  }, [user, isFocused, popupVisible]);

  const disappear = (delay) => {
    setTimeout(() => {
      containerRef.current.animate(animation, 800);
    }, delay);
  }

  const [points, setPoints] = useState(0);
  const containerRef = useRef();
  const textRef = useRef();

  return (
    <Animatable.View ref={containerRef} style={globalStyles.pointsGrowthContainer}>
      <Animatable.Text
        ref={textRef}
        adjustsFontSizeToFit={true}
        numberOfLines={1}
        style={textStyles.pointsGrowthText}
      >
        {points}
      </Animatable.Text>
      <Image source={require("../../../assets/images/growth_icon.png")} />
    </Animatable.View>
  );
};
