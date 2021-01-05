import React, { memo } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { SPACER_ITEM_SIZE } from "./PlaceCard";
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from "react-native-animatable";

export const LogoView = memo(() => {
  const onPress = () => {
    WebBrowser.openBrowserAsync('https://www.teva.org.il');
  }
  return (
    <TouchableOpacity style={styles.logo} onPress={onPress}>
      <Animatable.Image animation='fadeIn' delay={2000} source={require("../../../assets/images/hala_logo.png")} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  logo: {
    position: "absolute",
    top: -(38 + 12),
    left: SPACER_ITEM_SIZE * 1.25,
  }
})