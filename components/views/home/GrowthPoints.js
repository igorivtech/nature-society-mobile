import React, { useEffect, useRef, useState } from "react";
import { Image, Text } from "react-native";
import * as Animatable from "react-native-animatable";
import { styles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";

const animation = {
    0: {
      opacity: 1,
      transform: [
        {translateX: 0},
        {scale: 1},
      ]
    },
    1: {
      opacity: 0,
      transform: [
        {translateX: 130/2},
        {scale: 0},
      ]
    }
  }

export const GrowthPoints = () => {

    const [points, setPoints] = useState(0);
    const ref = useRef();
  
    useEffect(()=>{
      setTimeout(() => {
        setPoints(100);
        setTimeout(() => {
          ref.current.animate(animation, 800);
        }, 2000);
      }, 2000);
    }, [])
  
    return (<Animatable.View ref={ref} style={styles.pointsGrowthContainer}>
      <Text 
      adjustsFontSizeToFit={true}
      numberOfLines={1}
      style={textStyles.pointsGrowthText} >{points}</Text>
      <Image source={require("../../../assets/images/growth_icon.png")} />
  
    </Animatable.View>)
  }