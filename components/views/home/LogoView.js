import React, { memo } from "react";
import { Image } from "react-native";
import { SPACER_ITEM_SIZE } from "./PlaceCard";

export const LogoView = memo(() => {
  return (
    <Image
      pointerEvents="none"
      source={require("../../../assets/images/hala_logo.png")}
      style={{
        position: "absolute",
        top: -(38 + 12),
        left: SPACER_ITEM_SIZE * 1.25,
      }}
    />
  );
});
