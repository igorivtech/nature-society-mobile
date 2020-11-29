import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Animated,
  Image,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { HomeButton } from "../views/home/views";
import { styles } from "../../values/styles";
import { height, width, DATA } from "../../values/consts";
import { colors } from "../../values/colors";
import { fonts } from "../../values/fonts";
import { textStyles } from "../../values/textStyles";
import { MAP_STYLE } from "../../values/map_style";
import { SharedElement } from "react-navigation-shared-element";
import { strings } from "../../values/strings";

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

export const HomeScreen = ({ navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const listYTranslate = useRef(new Animated.Value(height * 0.25)).current;

  const mapRef = useRef(null);

  const [places, setPlaces] = useState([]);
  const [hideList, setHideList] = useState(true);

  useEffect(() => {
    Animated.timing(listYTranslate, {
      toValue: hideList ? height * 0.25 : 0,
      duration: 700,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [hideList]);

  useEffect(() => {
    setPlaces([{ key: "left-spacer" }, ...DATA, { key: "right-spacer" }]);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setHideList(false);
      if (places.length > 1) {
        animateToItem(places[1]);
      }
    }, 1000);
  }, [places]);

  const progress = () => {
    console.log("progress pressed");
  };

  const report = () => {
    console.log("report pressed");
  };

  const explore = () => {
    console.log("explore pressed");
  };

  const animateToItem = (item) => {
    mapRef.current.animateCamera(
      {
        center: {
          latitude: item.location[0],
          longitude: item.location[1],
        },
      },
      1000
    );
  };

  const showPlace = (place) => {
    navigation.navigate("Place", { place, locked: false });
  };

  return (
    <View style={styles.homeContainer}>
      <MapView
        customMapStyle={MAP_STYLE}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
      />
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.homeTopContainer}>
          <HomeButton index={2} onPress={progress} />
          <HomeButton index={1} onPress={report} />
          <HomeButton index={0} onPress={explore} />
        </View>
        <Animated.FlatList
          data={places}
          horizontal
          style={styles.mainListStyle(CARD_TRANSLATE_Y, listYTranslate)}
          contentContainerStyle={styles.mainListContainer}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => {
            const index = e.nativeEvent.contentOffset.x / ITEM_WIDTH;
            animateToItem(DATA[index]);
          }}
          keyExtractor={(item) => item.key}
          snapToInterval={ITEM_WIDTH}
          decelerationRate={0}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            if (index == 0 || index == places.length - 1) {
              return <View style={spacerStyle} />;
            }
            return (
              <PlaceCard
                callback={showPlace}
                index={index}
                item={item}
                scrollX={scrollX}
              />
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
};

// title: "בריכת נמרוד",
// distance: 34,
// lastVisitor: "איגור",
// cleanness: 4.4,
// crowdness: 3.6,
// image:

const PlaceCard = ({ item, index, scrollX, callback }) => {
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
        <Animated.View style={styles.mainCardContainer(translateY)}>
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

          <View style={styles.cardDetailsContainer}>
            <View style={styles.cardLocationContainer}>
              <View>
                <Text style={textStyles.cardTitle}>{item.title}</Text>
                <Text style={textStyles.cardDetail}>
                  {strings.distanceFromYou(item.distance)}
                </Text>
              </View>
              <Image
                style={styles.cardDetailIcon}
                source={require("../../assets/images/Marker.png")}
              />
            </View>

            <RecentVisitor
              title={item.lastVisitorName}
              details={
                item.lastVisitorGender == 0 ? "ביקר לאחרונה" : "ביקרה לאחרונה"
              }
              image={item.lastVisitorImage}
            />

            <View style={styles.cardLocationContainer}>
              <RatingView
                image={require("../../assets/images/HowBusy.png")}
                rating={item.crowdness}
                color={colors.grass}
              />

              <View style={styles.spacer(16)} />

              <RatingView
                image={require("../../assets/images/Heart.png")}
                rating={item.cleanness}
                color={colors.treeBlues}
              />

              <View style={styles.spacer(2)} />
            </View>
          </View>

          <SharedElement
            style={styles.cardMainImage}
            id={`place.${item.key}.image`}
          >
            <Image
              style={{ ...styles.cardMainImage, width: "100%" }}
              source={{ uri: item.image }}
            />
          </SharedElement>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export const RecentVisitor = ({ title, details, image, large = false }) => {
  return (
    <View style={{...styles.cardLocationContainer, marginLeft: large ? 30 : 0}}>
      <View
        style={{
          marginRight: large ? 12 : 8,
        }}
      >
        <Text style={textStyles.cardTitle}>{title}</Text>
        <Text style={textStyles.cardDetail}>{details}</Text>
      </View>
      <Image style={styles.cardVisitorPic(large)} source={{ uri: image }} />
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
