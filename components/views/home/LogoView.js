import React, { memo, useRef, useState } from "react";
import { Animated, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SPACER_ITEM_SIZE } from "./PlaceCard";
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from "react-native-animatable";
import {Popup} from "../Popup"
import { strings } from "../../../values/strings";
import { smallScreen } from "../../../values/consts";

export const LogoView = memo(({listYTranslate}) => {

  const opacity = listYTranslate.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
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
    <TouchableOpacity style={styles.logo} onPress={localOnPress}>
      <Animated.View style={{opacity}}>
        <Animatable.Image style={styles.image} animation='fadeIn' delay={2000} source={require("../../../assets/images/hala_logo.png")} />
      </Animated.View>
      <Popup website={true} textData={strings.popups.halaWebsite} popupVisible={popupVisible} setPopupVisible={setPopupVisible} actionRef={actionRef} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain'
  },
  logo: {
    position: "absolute",
    top: -(38 + 12),
    left: SPACER_ITEM_SIZE * (smallScreen ? 1.5 : 1.25),
  }
})