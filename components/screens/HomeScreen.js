import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { View, SafeAreaView, Animated, Easing, Image, StyleSheet, FlatList } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { HomeButton } from "../views/home/views";
import { globalStyles } from "../../values/styles";
import {
  SCREEN_ASPECT_RATIO,
  height,
  DEFAULT_NOTIFICATION,
  DEFAULT_PLACES,
  INITIAL_REGION,
  DEFAULT_COOR_DELTA,
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
import { useIsFocused } from '@react-navigation/native';
import { PlaceMarker } from "../views/home/PlaceMarker";
import * as Location from 'expo-location';
import { useServer } from "../../hooks/useServer";
import _ from "lodash";
import { objectLength } from "../../hooks/helpers";
import { UserMarker } from "../views/home/UserMarker";

const SCREEN_WAIT_DURATION = 400;
const leftSpacer = { key: "left-spacer" };
const rightSpacer = { key: "right-spacer" };

export const HomeScreen = ({ navigation, route }) => {
  const { state, dispatch } = useContext(UserContext);
  const { user, notification, serverPlaces, settings } = state;

  const { askLocation, locationPermission } = useLocationPermissions();

  const [places, setPlaces] = useState([]);
  let animationTimeout = null;
  const [hideList, setHideList] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [requestPermissions, setRequestPermissions] = useState(false);

  const isFocused = useIsFocused();
  const firstTime = useRef(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const lockAutoSearching = useRef(true);
  const [globalTracksViewChanges, setGlobalTracksViewChanges] = useState(false);

  const cardsListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const listYTranslate = useRef(new Animated.Value(height * 0.25)).current;

  const {getPlaces} = useServer();

  // STARTUP POINT
  useEffect(() => {
    tryFetchLocation();
    // notification - DEBUG
    // setTimeout(() => {
    //   dispatch({
    //     type: SAVE_NOTIFICATION,
    //     payload: DEFAULT_NOTIFICATION
    //   })
    // }, 2000);
  }, []);

  const tryFetchLocation = async () => {
    let { status } = await Location.getPermissionsAsync();
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        setLocation(location.coords);
      } else {
        lockAutoSearching.current = false;
        onRegionChangeComplete(mapRef.current.__lastRegion);
      }
    } else {
      lockAutoSearching.current = false;
      onRegionChangeComplete(mapRef.current.__lastRegion);
      if (status === 'undetermined') {
        setTimeout(() => {
          setRequestPermissions(true);
        }, 1000*60);
      }
    }
  }

  useEffect(() => { // permissions popup
    if (requestPermissions && isFocused) {
      setRequestPermissions(false);
      setPopupVisible(true);
    }
  }, [requestPermissions, isFocused]);
  useEffect(() => {
    if (locationPermission != null && locationPermission.granted) {
      tryFetchLocation();
    }
  }, [locationPermission]);
  useEffect(()=>{
    if (objectLength(location) > 0) {
      lockAutoSearching.current = false;
      mapRef.current.animateToRegion({
        ...location,
        ...DEFAULT_COOR_DELTA
      }, 1000);
    }
  }, [location])

  useEffect(() => {
    if (serverPlaces && serverPlaces.length > 0) {
      setPlaces([leftSpacer, ...serverPlaces, rightSpacer]);
      // setTimeout(() => {
      setSelectedPlace(serverPlaces[0]);
      if (isFocused) {
        setHideList(false);
        // animateToItem(serverPlaces[0]);
      }
      setupCardListener();
      // }, 1000);
    } else {
      // somthing i guess?
    }
  }, [serverPlaces]);

  const setupCardListener = () => {
    scrollX.removeAllListeners();
    scrollX.addListener(({value}) => {
      const i = Math.round(value/ITEM_WIDTH);
      if (animationTimeout !== null) {
        clearTimeout(animationTimeout);
      }
      animationTimeout = setTimeout(()=>{
        const item = serverPlaces[i];
        if (selectedPlace == null || item.key !== selectedPlace.key) {
          setSelectedPlace(item);
          animateToItem(item);
        }
      }, 10);
    })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (firstTime.current) {
        firstTime.current = false;
      } else {
        if (serverPlaces.length > 0) {
          setHideList(false);
        }
      }
    });
    return unsubscribe;
  }, [navigation, serverPlaces]);

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
      } else if (params.signupNow === true) {
        setHideList(true);
        setTimeout(() => {
          setHideList(true);
          navigation.navigate("Progress", {signupNow: true});
        }, SCREEN_WAIT_DURATION);
      }
    }
  }, [route]);

  const progress = useCallback(() => {
    setHideList(true);
    setTimeout(() => {
      setHideList(true);
      navigation.navigate("Progress");
    }, SCREEN_WAIT_DURATION);
  }, [navigation])

  const report = useCallback(() => {
    if (selectedPlace != null) {
      const location = selectedPlace;
      navigation.navigate("Report", { location });
    }
  }, [selectedPlace, navigation])

  const explore = useCallback(() => {
    setHideList(true);
    setTimeout(() => {
      setHideList(true);
      navigation.navigate("Explore", {location});
    }, SCREEN_WAIT_DURATION);
  }, [navigation, location])

  const animateToItem = (item) => {
    const paddedLD = item.position.longitudeDelta + 0.25;
    mapRef.current.animateToRegion({
      ...item.position,
      longitudeDelta: paddedLD,
      latitudeDelta: paddedLD*SCREEN_ASPECT_RATIO
    }, 1000);
  };

  const showPlace = useCallback((place) => {
    navigation.navigate("Place", { place });
  }, [navigation]);

  const askLocationPermissions = () => {
    askLocation();
  };

  const onRegionChangeComplete = async (region) => {
    setGlobalTracksViewChanges(false);
    if (lockAutoSearching.current) {
      return;
    }
    // const radius = 111.045 * region.latitudeDelta;
    const radius = 111.045 * region.longitudeDelta / 2;
    // if (location != null) {
      debounce.cancel()
      debounce(region, radius);
    // } else {
    //   console.log("current location is null");
    // }
  }

  const debounce = useCallback(_.debounce(async(region, radius) => {
    const pp = await getPlaces(region, location, radius);
    dispatch({
      type: SAVE_PLACES,
      payload: pp,
    });
  }, 700), [location]);

  const markerPressed = useCallback((place) => {
  //   lockAutoSearching.current = true;
  //   setSelectedPlace(place);
  //   const index = serverPlaces.findIndex(p=>p.key===place.key);
  //   if (index > -1) {
  //     cardsListRef.current.scrollToOffset({
  //       animated: true,
  //       offset: index*ITEM_WIDTH
  //     });
  //   }
  //   animateToItem(place);
  })

  return (
    <View style={globalStyles.homeContainer}>
      <MapView
        onPanDrag={()=>lockAutoSearching.current = false}
        moveOnMarkerPress={false}
        onRegionChange={()=>{
          setGlobalTracksViewChanges(true);
          if (!lockAutoSearching.current) {
            setHideList(true)
          }
        }}
        onRegionChangeComplete={onRegionChangeComplete}
        initialRegion={INITIAL_REGION}
        customMapStyle={MAP_STYLE}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={globalStyles.mapStyle}
      >
        {serverPlaces && serverPlaces.map((p, index) => <PlaceMarker selectedPlace={selectedPlace} globalTracksViewChanges={globalTracksViewChanges} index={index} scrollX={scrollX} onPress={markerPressed} key={index} place={p} />)}
        {location && (<UserMarker user={user} location={location} />)}
      </MapView>
      
      <SafeAreaView>
        <View style={globalStyles.homeTopContainer}>
          <HomeButton index={2} notification={notification} onPress={progress} />
          <HomeButton index={1} onPress={report} />
          <HomeButton index={0} onPress={explore} />
        </View>
      </SafeAreaView>
      <SafeAreaView>
        <Animated.FlatList
          ref={cardsListRef}
          data={places}
          horizontal
          style={globalStyles.mainListStyle(CARD_TRANSLATE_Y, listYTranslate)}
          contentContainerStyle={globalStyles.mainListContainer}
          onScrollBeginDrag={()=>{
            lockAutoSearching.current = true;
            setGlobalTracksViewChanges(true);
          }}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true}
          )}
          scrollEventThrottle={16}
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
                settings={settings}
                user={user}
                callback={showPlace}
                index={index}
                item={item}
                scrollX={scrollX}
              />
            );
          }}
        />
      </SafeAreaView>
      <GrowthPoints isFocused={isFocused} popupVisible={popupVisible} />
      <Popup
        textData={strings.popups.locationPermissions}
        action={askLocationPermissions}
        popupVisible={popupVisible}
        setPopupVisible={setPopupVisible}
      />
    </View>
  );
};
