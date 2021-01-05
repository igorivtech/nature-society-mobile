import React, {memo} from "react";
import { Animated, SafeAreaView, StyleSheet } from "react-native";
import { CARD_TRANSLATE_Y, ITEM_HEIGHT, SPACER_ITEM_SIZE } from "./PlaceCard";

export const LogoView = memo(() => {
  return (
    <Animated.Image
        pointerEvents='none'
        source={require("../../../assets/images/hala_logo.png")}
        style={{
          position: 'absolute',
          top: -(38 + 12),
          left: SPACER_ITEM_SIZE * 1.25,
        }}
      />
  );
});
