import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, Easing, TouchableOpacity, Image } from "react-native";
import { colors } from "../../../values/colors";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";

const images = {
  0: require("../../../assets/images/Explore.png"),
  1: require("../../../assets/images/Report.png"),
  2: require("../../../assets/images/Progress.png"),
};


export const HomeButton = ({ index, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Image
          source={images[index]}
        />
      </TouchableOpacity>
    );
  };