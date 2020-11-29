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

const SPACING = 40;
const CARD_TRANSLATE_Y = 20;
const ITEM_WIDTH = width - 2 * SPACING;
// const ITEM_WIDTH = width * 0.79;
const ITEM_HEIGHT = ITEM_WIDTH * 0.466;
const SPACER_ITEM_SIZE = (width - ITEM_WIDTH) / 2;

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
          alignItems: "center",
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e)=>console.log(e.nativeEvent)}
        keyExtractor={(item) => item.key}
        snapToInterval={ITEM_WIDTH}
        decelerationRate={0}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          if (index == 0 || index == places.length - 1) {
            return <View style={{width: SPACER_ITEM_SIZE}} />
          }
          return <PlaceCard index={index} item={item} scrollX={scrollX} />;
        }}
      />
    </View>
  );
};

const PlaceCard = ({ item, index, scrollX }) => {
  const inputRange = [
    (index - 2) * ITEM_WIDTH,
    (index - 1) * ITEM_WIDTH,
    (index) * ITEM_WIDTH,
  ];

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [0, -CARD_TRANSLATE_Y, 0],
  });
  return (
    <View
      style={{
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
      }}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          margin: 8,
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
          backgroundColor: "red",
          transform: [{ translateY }],
        }}
      >
        <Image
          style={{ width: 50, height: 50, backgroundColor: "black" }}
          source={{ uri: item.image }}
        />
        <Text
          style={{
            fontSize: 20,
            color: "white",
          }}
        >
          {item.title}
        </Text>
      </Animated.View>
    </View>
  );
};
