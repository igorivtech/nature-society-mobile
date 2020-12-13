import React, { useContext, useEffect, useRef, useState } from "react";
import { View, SafeAreaView, Animated, Easing } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { HomeButton } from "../views/home/views";
import { globalStyles } from "../../values/styles";
import {
  height,
  DEFAULT_NOTIFICATION,
  DEFAULT_PLACES,
} from "../../values/consts";
import { MAP_STYLE } from "../../values/map_style";
import {
  CARD_TRANSLATE_Y,
  ITEM_WIDTH,
  PlaceCard,
  spacerStyle,
} from "../views/home/PlaceCard";
import { GrowthPoints } from "../views/home/GrowthPoints";
import { UserContext } from "../../context/context";
import { SAVE_NOTIFICATION, SAVE_PLACES } from "../../context/userReducer";
import { Popup } from "../views/Popup";
import { strings } from "../../values/strings";
import { useLocationPermissions } from "../../hooks/usePermissions";

const SCREEN_WAIT_DURATION = 400;
const leftSpacer = { key: "left-spacer" };
const rightSpacer = { key: "right-spacer" };

export const HomeScreen = ({ navigation, route }) => {
  const { state, dispatch } = useContext(UserContext);
  const { user, notification, serverPlaces } = state;

  const { askLocation, locationPermission } = useLocationPermissions();

  const [places, setPlaces] = useState([]);
  const [hideList, setHideList] = useState(true);
  const firstTime = useRef(true);
  const selectedPlace = useRef();

  const scrollX = useRef(new Animated.Value(0)).current;
  const listYTranslate = useRef(new Animated.Value(height * 0.25)).current;

  const [popupVisible, setPopupVisible] = useState(false);

  const mapRef = useRef(null);

  // STARTUP POINT
  useEffect(() => {
    // places
    setTimeout(() => {
      dispatch({
        type: SAVE_PLACES,
        payload: DEFAULT_PLACES,
      });
    }, 1000);
    // notification - DEBUG
    // setTimeout(() => {
    //   dispatch({
    //     type: SAVE_NOTIFICATION,
    //     payload: DEFAULT_NOTIFICATION
    //   })
    // }, 2000);
  }, []);

  useEffect(() => {
    // permissions popup
    if (locationPermission != null && !locationPermission.granted) {
      setTimeout(() => {
        setPopupVisible(true);
      }, 4000);
    }
  }, [locationPermission]);

  useEffect(() => {
    if (serverPlaces.length > 0) {
      setPlaces([leftSpacer, ...serverPlaces, rightSpacer]);
      selectedPlace.current = serverPlaces[0];
      // setTimeout(() => {
      setHideList(false);
      animateToItem(serverPlaces[0]);
      // }, 1000);
    } else {
      // somthing i guess?
    }
  }, [serverPlaces]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (firstTime.current) {
        firstTime.current = false;
      } else {
        setHideList(false);
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    Animated.timing(listYTranslate, {
      toValue: hideList ? height * 0.25 : 0,
      duration: 700,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [hideList]);

  useEffect(() => {
    const params = route.params;
    if (params != null) {
      if (params.searchItem != null) {
        const s = { ...params.searchItem };
        setTimeout(() => {
          showPlace(s);
        }, 500);
        params.searchItem = null;
      }
    }
  }, [route]);

  const progress = () => {
    setHideList(true);
    setTimeout(() => {
      navigation.navigate("Progress");
    }, SCREEN_WAIT_DURATION);
  };

  const report = () => {
    if (selectedPlace?.current) {
      const location = selectedPlace?.current;
      navigation.navigate("Report", { location });
    }
  };

  const explore = () => {
    setHideList(true);
    setTimeout(() => {
      navigation.navigate("Explore");
    }, SCREEN_WAIT_DURATION);
  };

  const animateToItem = (item) => {
    mapRef.current.animateCamera({
      center: {
        latitude: item.location[0],
        longitude: item.location[1],
      },
    }, 1000);
  };

  const showPlace = (place) => {
    navigation.navigate("Place", { place });
  };

  const askLocationPermissions = () => {
    askLocation();
  };

  return (
    <View style={globalStyles.homeContainer}>
      <MapView
        customMapStyle={MAP_STYLE}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={globalStyles.mapStyle}
      />
      <SafeAreaView>
        <View style={globalStyles.homeTopContainer}>
          <HomeButton index={2} notification={notification} onPress={progress} />
          <HomeButton index={1} onPress={report} />
          <HomeButton index={0} onPress={explore} />
        </View>
      </SafeAreaView>
      <SafeAreaView>
        <Animated.FlatList
          data={places}
          horizontal
          style={globalStyles.mainListStyle(CARD_TRANSLATE_Y, listYTranslate)}
          contentContainerStyle={globalStyles.mainListContainer}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => {
            const index = e.nativeEvent.contentOffset.x / ITEM_WIDTH;
            selectedPlace.current = serverPlaces[index];
            animateToItem(serverPlaces[index]);
          }}
          keyExtractor={(item) => item.key}
          snapToInterval={ITEM_WIDTH}
          decelerationRate={0}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            if (index === 0 || index === places.length - 1) {
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
      <GrowthPoints />
      <Popup
        textData={strings.popups.locationPermissions}
        action={askLocationPermissions}
        popupVisible={popupVisible}
        setPopupVisible={setPopupVisible}
      />
    </View>
  );
};
