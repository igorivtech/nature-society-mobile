import React, { useEffect, useRef, useState } from "react";
import { Image, Text } from "react-native";
import * as Animatable from "react-native-animatable";
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
  const [points, setPoints] = useState(0);
  const containerRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      textRef.current.animate(opacity(false), TEXT_DURATION).then(() => {
        setPoints(100);
        textRef.current.animate(opacity(true), TEXT_DURATION).then(() => {
          setTimeout(() => {
            containerRef.current.animate(animation, 800);
          }, 2500);
        });
      });
    }, 2000);
  }, []);

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
