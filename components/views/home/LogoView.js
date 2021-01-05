import React, { memo, useRef, useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { SPACER_ITEM_SIZE } from "./PlaceCard";
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from "react-native-animatable";
import {Popup} from "../Popup"
import { strings } from "../../../values/strings";

export const LogoView = memo(() => {

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
      <Animatable.Image animation='fadeIn' delay={2000} source={require("../../../assets/images/hala_logo.png")} />
      <Popup permissions={true} textData={strings.popups.halaWebsite} popupVisible={popupVisible} setPopupVisible={setPopupVisible} actionRef={actionRef} />
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