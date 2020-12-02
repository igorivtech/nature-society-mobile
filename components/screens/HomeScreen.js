import React, { useEffect, useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { HomeButton } from "../views/home/views";
import { styles } from "../../values/styles";
import { height, DATA } from "../../values/consts";
import { MAP_STYLE } from "../../values/map_style";
import { CARD_TRANSLATE_Y, ITEM_WIDTH, PlaceCard, spacerStyle } from '../views/home/PlaceCard'
import { GrowthPoints } from "../views/home/GrowthPoints";

export const HomeScreen = ({ navigation, route }) => {

  const [places, setPlaces] = useState([{ key: "left-spacer" }, ...DATA, { key: "right-spacer" }]);
  const [hideList, setHideList] = useState(true);
  const firstTime = useRef(true);

  const scrollX = useRef(new Animated.Value(0)).current;
  const listYTranslate = useRef(new Animated.Value(height * 0.25)).current;

  const mapRef = useRef(null);

  useEffect(() => {
    Animated.timing(listYTranslate, {
      toValue: hideList ? height * 0.25 : 0,
      duration: 700,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [hideList]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (firstTime.current) {
        setTimeout(() => {
          setHideList(false);
          animateToItem(DATA[0]);
          firstTime.current = false;
        }, 1000);
      } else {
        setHideList(false);
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const params = route.params
    if (params != null && params.searchItem != null) {
      setTimeout(() => {
        showPlace(params.searchItem);  
      }, 500);
    }
  }, [route]);

  const progress = () => {
    setHideList(true);
    setTimeout(() => {
      navigation.navigate("Progress");
    }, 400);
  };

  const report = () => {
    navigation.navigate("Report");
  };

  const explore = () => {
    setHideList(true);
    setTimeout(() => {
      navigation.navigate("Explore");
    }, 400);
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
    navigation.navigate("Place", { place });
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

        <GrowthPoints />
      </SafeAreaView>
    </View>
  );
};

