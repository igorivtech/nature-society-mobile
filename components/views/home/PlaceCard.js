import React from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { colors } from "../../../values/colors";
import { width } from "../../../values/consts";
import { strings } from "../../../values/strings";
import { globalStyles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";
import { RatingView, RecentVisitor } from "./views";

export const SPACING = 40;
export const CARD_TRANSLATE_Y = 20;
export const ITEM_WIDTH = width - 2 * SPACING;
// const ITEM_WIDTH = width * 0.79;
export const ITEM_HEIGHT = ITEM_WIDTH * 0.466;
export const SPACER_ITEM_SIZE = (width - ITEM_WIDTH) / 2;
export const spacerStyle = { width: SPACER_ITEM_SIZE };

const cardStyle = {
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
};

// title: "בריכת נמרוד",
// distance: 34,
// lastVisitor: "איגור",
// cleanness: 4.4,
// crowdness: 3.6,
// image:

export const PlaceCard = ({ item, index, scrollX, callback }) => {
  const inputRange = [
    (index - 2) * ITEM_WIDTH,
    (index - 1) * ITEM_WIDTH,
    index * ITEM_WIDTH,
  ];

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [0, -CARD_TRANSLATE_Y, 0],
  });

  const showPlace = () => {
    callback(item);
  };

  return (
    <View style={cardStyle}>
      <TouchableWithoutFeedback onPress={showPlace}>
        <Animated.View style={globalStyles.mainCardContainer(translateY)}>
          <SharedElement
            style={StyleSheet.absoluteFill}
            id={`place.${item.key}.bg`}
          >
            <View
              style={{
                ...StyleSheet.absoluteFill,
                borderRadius: 15,
              }}
            />
          </SharedElement>

          <View style={globalStyles.cardDetailsContainer}>
            <View style={globalStyles.cardLocationContainer}>
              <View>
                <Text style={textStyles.cardTitle}>{item.title}</Text>
                <Text style={textStyles.cardDetail}>
                  {strings.distanceFromYou(item.distance)}
                </Text>
              </View>
              <Image
                style={globalStyles.cardDetailIcon}
                source={require("../../../assets/images/Marker.png")}
              />
            </View>

            <RecentVisitor
              title={item.lastVisitorName}
              details={strings.homeScreen.recentVisitor(
                item.lastVisitorGender === 0
              )}
              image={item.lastVisitorImage}
            />

            <View style={globalStyles.cardLocationContainer}>
              <RatingView
                image={require("../../../assets/images/HowBusy.png")}
                rating={item.crowdness}
                color={colors.grass}
              />

              <View style={globalStyles.spacer(16)} />

              <RatingView
                image={require("../../../assets/images/Heart.png")}
                rating={item.cleanness}
                color={colors.treeBlues}
              />

              <View style={globalStyles.spacer(2)} />
            </View>
          </View>

          <SharedElement
            style={globalStyles.cardMainImage}
            id={`place.${item.key}.image`}
          >
            <Image
              style={{ ...globalStyles.cardMainImage, width: "100%" }}
              source={{ uri: item.image }}
            />
          </SharedElement>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};
