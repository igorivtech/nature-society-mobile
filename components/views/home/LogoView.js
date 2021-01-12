import React, { memo, useRef, useState } from "react";
import { Animated, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SPACER_ITEM_SIZE } from "./PlaceCard";
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from "react-native-animatable";
import {Popup} from "../Popup"
import { strings } from "../../../values/strings";
import { smallScreen } from "../../../values/consts";

export const LogoView = memo(({listYTranslate, bottomHeight, bottomSafeAreaHeight}) => {

  const opacity = listYTranslate.interpolate({
    inputRange: [0, bottomHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })
  const scale = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })

  const [popupVisible, setPopupVisible] = useState(false);

  const onPress = () => {
    WebBrowser.openBrowserAsync('https://www.teva.org.il');
  }

  const actionRef = useRef(onPress);

  const localOnPress = () => {
    setPopupVisible(true);
  }
  return (
    <View pointerEvents='none' style={styles.logo(bottomSafeAreaHeight)} onPress={localOnPress}>
      <Animated.Image style={[styles.image, {opacity, transform: [{scale}]}]} source={require("../../../assets/images/hala_logo.png")} />
    </View>
  );
});

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain'
  },
  logo: (bottomSafeAreaHeight) => ({
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    bottom: bottomSafeAreaHeight + 48
  })
})