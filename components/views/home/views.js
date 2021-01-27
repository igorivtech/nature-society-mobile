import React, { useEffect, useRef, memo } from "react";
import { View, TouchableOpacity, Image, Text, Animated, StyleSheet, Easing } from "react-native";
import { formatRating } from "../../../hooks/helpers";
import { colors } from "../../../values/colors";
import { globalStyles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";

const images = {
  0: require("../../../assets/images/Explore.png"),
  1: require("../../../assets/images/Report.png"),
  2: require("../../../assets/images/Progress.png"),
};

export const HomeButton = memo(({ index, onPress, notification }) => {

  const opacity = useRef(new Animated.Value(0)).current;

  // useEffect(()=>{
  //   if (index === 2) {
  //     Animated.timing(opacity, {
  //       useNativeDriver: true,
  //       duration: 300,
  //       toValue: notification != null ? 1 : 0,
  //       timing: Easing.inOut(Easing.ease)
  //     }).start();
  //   }
  // }, [notification])

  return (
    <TouchableOpacity style={globalStyles.centerChildren} onPress={onPress}>
      {index === 2 && (
        <Animated.View style={s.bg(opacity)} />
      )}
      <Image source={images[index]} />
    </TouchableOpacity>
  );
});

const ICON_SIZE = 42.5;
const BG_SIZE = ICON_SIZE + 6;

const s = StyleSheet.create({
  bg: (opacity) => ({
    position: 'absolute',
    opacity,
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.desertRock,
    height: BG_SIZE,
    width: BG_SIZE,
    borderRadius: BG_SIZE/2,
    selfAlign: 'center',
    left: 2,
    top: 0
  })
})

export const RecentVisitor = ({ title, details, image, large = false }) => {
  return (
    <View
      style={{ ...globalStyles.cardLocationContainer, marginLeft: large ? 30 : 0 }}
    >
      <View
        style={{
          marginRight: large ? 12 : 8,
        }}
      >
        <Text style={textStyles.cardTitle}>{title}</Text>
        <Text style={textStyles.cardDetail}>{details}</Text>
      </View>
      <Image style={globalStyles.cardVisitorPic(large)} source={image != null ? { uri: image } : require("../../../assets/images/default_profile_pic.png")} />
    </View>
  );
};

export const RatingView = ({ settings, rating, color, image, locked = false, item, isCleanness }) => {
  return (
    <View style={globalStyles.ratingContainer}>
      {locked ? (
        <View style={ratingStyles.buyContainer(true)}>
          <Text style={ratingStyles.buyPoints}>{settings.pointsForUnlock}</Text>
          <Image style={globalStyles.imageContain(true)} source={require("../../../assets/images/buy_it_small.png")} />
        </View>
      ): (
        <Text style={textStyles.rating(color)}>{formatRating(rating, isCleanness)}</Text>
      )}

      <Image style={{tintColor: locked ? colors.lighterShade : color}} source={image} />
    </View>
  );
};
const ratingStyles = StyleSheet.create({

  buyPoints: {
    marginHorizontal: 4,
    ...textStyles.normalOfSize(14),
    textAlign: 'center',
    color: colors.treeBlues,
  },

  buyContainer: (small) => ({
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.treeBlues,
    borderRadius: small ? 11 : 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'row'
  }),
})