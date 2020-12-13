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

const opacity = (on) => ({
  0: {
    opacity: on ? 0 : 1,
  },
  1: {
    opacity: on ? 1 : 0,
  },
});

const TEXT_DURATION = 600;

export const GrowthPoints = () => {
  const {state} = useContext(UserContext);
  const {user} = state;

  useEffect(()=>{
    if (user) {
      if (user.points !== points) {
        setTimeout(() => {
          textRef.current.animate(opacity(false), TEXT_DURATION).then(() => {
            setPoints(user.points);
            textRef.current.animate(opacity(true), TEXT_DURATION).then(() => {
              setTimeout(() => {
                containerRef.current.animate(animation, 800);
              }, 2500);
            });
          });
        }, 2000);
      }
    }
  }, [user]);

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
