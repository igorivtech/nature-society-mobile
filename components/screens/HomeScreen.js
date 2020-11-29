import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Animated,
  Image,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { HomeButton } from "../views/home/views";
import { styles } from "../../values/styles";
import { height, width, DATA } from "../../values/consts";
import { colors } from "../../values/colors";
import { fonts } from "../../values/fonts";
import { textStyles } from "../../values/textStyles";

const SPACING = 40;
const CARD_TRANSLATE_Y = 20;
const ITEM_WIDTH = width - 2 * SPACING;
// const ITEM_WIDTH = width * 0.79;
const ITEM_HEIGHT = ITEM_WIDTH * 0.466;
const SPACER_ITEM_SIZE = (width - ITEM_WIDTH) / 2;

const cardStyle = {
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
};

const spacerStyle = { width: SPACER_ITEM_SIZE };

export const HomeScreen = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setPlaces([{ key: "left-spacer" }, ...DATA, { key: "right-spacer" }]);
  }, []);

  const scrollX = useRef(new Animated.Value(0)).current;

  const progress = () => {
    console.log("progress pressed");
  };

  const report = () => {
    console.log("report pressed");
  };

  const explore = () => {
    console.log("explore pressed");
  };

  return (
    <View style={styles.homeContainer}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.mapStyle} />
      <SafeAreaView style={styles.homeContainer}>
        <View style={styles.homeTopContainer}>
          <HomeButton index={2} onPress={progress} />
          <HomeButton index={1} onPress={report} />
          <HomeButton index={0} onPress={explore} />
        </View>
      </SafeAreaView>

      <Animated.FlatList
        data={places}
        horizontal
        style={{
          paddingTop: CARD_TRANSLATE_Y,
          // backgroundColor: 'yellow',
          right: 0,
          left: 0,
          position: "absolute",
          bottom: 0,
        }}
        contentContainerStyle={{
          paddingBottom: 8,
          alignItems: "center",
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => console.log(e.nativeEvent)}
        keyExtractor={(item) => item.key}
        snapToInterval={ITEM_WIDTH}
        decelerationRate={0}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          if (index == 0 || index == places.length - 1) {
            return <View style={spacerStyle} />;
          }
          return <PlaceCard index={index} item={item} scrollX={scrollX} />;
        }}
      />
    </View>
  );
};

// title: "בריכת נמרוד",
// distance: 34,
// lastVisitor: "איגור",
// cleanness: 4.4,
// crowdness: 3.6,
// image:

const PlaceCard = ({ item, index, scrollX }) => {
  const inputRange = [
    (index - 2) * ITEM_WIDTH,
    (index - 1) * ITEM_WIDTH,
    index * ITEM_WIDTH,
  ];

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [0, -CARD_TRANSLATE_Y, 0],
  });
  return (
    <View style={cardStyle}>
      <Animated.View style={styles.mainCardContainer(translateY)}>
        <View style={styles.cardDetailsContainer}>
          <View style={styles.cardLocationContainer}>
            <View
              style={{
                marginRight: 8,
              }}
            >
              <Text style={textStyles.cardTitle}>{item.title}</Text>
              <Text style={textStyles.cardDetail}>
                {`${item.distance} ק״מ ממך`}
              </Text>
            </View>
            <Image
              style={{
                width: 22,
              }}
              source={require("../../assets/images/Marker.png")}
            />
          </View>

          <View style={styles.cardLocationContainer}>
            <View
              style={{
                marginRight: 8,
              }}
            >
              <Text style={textStyles.cardTitle}>{item.lastVisitorName}</Text>
              <Text style={textStyles.cardDetail}>
                {item.lastVisitorGender == 0 ? "ביקר לאחרונה" : "ביקרה לאחרונה"}
              </Text>
            </View>
            <Image
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
              }}
              source={{ uri: item.lastVisitorImage }}
            />
          </View>
          <View style={styles.cardLocationContainer}>
            <RatingView
              image={require("../../assets/images/HowBusy.png")}
              rating={item.crowdness}
              color={colors.grass}
            />

            <RatingView
              image={require("../../assets/images/Heart.png")}
              rating={item.cleanness}
              color={colors.treeBlues}
            />
          </View>
        </View>

        <Image style={styles.cardMainImage} source={{ uri: item.image }} />
      </Animated.View>
    </View>
  );
};

const RatingView = ({ rating, color, image }) => {
  return (
    <View style={styles.ratingContainer}>
      <Text style={textStyles.rating(color)}>{rating}</Text>

      <Image source={image} />
    </View>
  );
};
