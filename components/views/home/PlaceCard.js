import React, {useCallback, memo, useState} from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import { SharedElement } from "react-navigation-shared-element";
import { placeLocked } from "../../../hooks/helpers";
import { colors } from "../../../values/colors";
import { smallScreen, width } from "../../../values/consts";
import { strings } from "../../../values/strings";
import { globalStyles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";
import { RatingView, RecentVisitor } from "./views";

export const SPACING = smallScreen ? 20 : 40;
export const CARD_TRANSLATE_Y = 20;
export const ITEM_WIDTH = width - 2 * SPACING;
// const ITEM_WIDTH = width * 0.79;
export const ITEM_HEIGHT = ITEM_WIDTH * 0.466;
export const SPACER_ITEM_SIZE = (width - ITEM_WIDTH) / 2;
export const spacerStyle = { width: SPACER_ITEM_SIZE };

// title: "בריכת נמרוד",
// distance: 34,
// lastVisitor: "איגור",
// cleanness: 4.4,
// crowdness: 3.6,
// image:

export const PlaceCard = memo(({ settings, user, item, index, scrollX, callback }) => {
  const inputRange = [
    (index - 2) * ITEM_WIDTH,
    (index - 1) * ITEM_WIDTH,
    index * ITEM_WIDTH,
  ];

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [0, -CARD_TRANSLATE_Y, 0],
  });

  const showPlace = useCallback((tap) => {
    if (tap.nativeEvent.state === State.END) {
      callback(item);
    }
  });

  // const [loadingImage, setLoadingImage] = useState(true);
  // const turnOffLoading = () => {
  //   setLoadingImage(false);
  // }

  return (
    <View style={styles.card}>
      <TapGestureHandler onHandlerStateChange={showPlace}>
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
              <View style={styles.titleContainer}>
                <Text numberOfLines={2} minimumFontScale={0.7} adjustsFontSizeToFit={true} style={textStyles.cardTitle}>{item.title}</Text>
                {item.distance && (
                  <Text style={textStyles.cardDetail}>
                    {strings.distanceFromYou(item.distance)}
                  </Text>
                )}
              </View>
              <Image
                style={globalStyles.cardDetailIcon}
                source={require("../../../assets/images/Marker.png")}
              />
            </View>

            {item.lastVisitors.length > 0 && (
              <RecentVisitor
                title={item.lastVisitors[0].lastVisitorName}
                details={strings.homeScreen.recentVisitor(
                  // item.lastVisitorGender === 0
                  true
                )}
                image={item.lastVisitors[0].lastVisitorImage}
              />
            )}

            <View style={globalStyles.cardLocationContainer}>
              <RatingView
                settings={settings}
                locked={placeLocked(user, item)}
                item={item}
                image={require("../../../assets/images/HowBusy.png")}
                rating={item.crowdness}
                color={item.crowdnessColor}
              />

              <View style={globalStyles.spacer(16)} />

              <RatingView
                image={require("../../../assets/images/Heart.png")}
                rating={item.cleanness}
                color={item.cleannessColor}
              />

              <View style={globalStyles.spacer(2)} />
            </View>
          </View>

          <View style={globalStyles.cardMainImage}>
            {/* <Image style={[styles.image, {
              resizeMode: 'contain',
              backgroundColor: colors.imageBg
              }]} source={require("../../../assets/images/default_place_bg.png")} />
            <Image style={[styles.image, {position: 'absolute'}]} source={{ uri: item.image }} /> */}
            {/* <Image onLoad={turnOffLoading} onError={turnOffLoading} style={styles.image} source={{ uri: item.image }} /> */}
            <Image style={styles.image} source={{ uri: item.image }} />
            {/* <View style={[StyleSheet.absoluteFill, globalStyles.centerChildren]}>
              <ActivityIndicator animating={loadingImage} />
            </View> */}
          </View>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT+CARD_TRANSLATE_Y,
    paddingTop: CARD_TRANSLATE_Y,
    overflow: 'visible'
  },
  image: {
    ...globalStyles.cardMainImage, 
    width: "100%"
  },
  titleContainer: {
    flexShrink: 1
  }
})