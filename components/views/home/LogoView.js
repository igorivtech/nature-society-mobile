import React, {memo} from "react";
import { Animated, SafeAreaView, StyleSheet } from "react-native";
import { CARD_TRANSLATE_Y, ITEM_HEIGHT, SPACER_ITEM_SIZE } from "./PlaceCard";

export const LogoView = memo(() => {
  return (
    <SafeAreaView
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
      }}
    >
      <Animated.Image
        source={require("../../../assets/images/hala_logo.png")}
        style={{
          marginBottom: ITEM_HEIGHT + CARD_TRANSLATE_Y*2,
          marginLeft: SPACER_ITEM_SIZE * 1.25,
        }}
      />
    </SafeAreaView>
  );
});
