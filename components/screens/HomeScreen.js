import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { View, SafeAreaView, Animated, Easing, Image, StyleSheet, FlatList } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { HomeButton } from "../views/home/views";
import { globalStyles } from "../../values/styles";
import {
  SCREEN_ASPECT_RATIO,
  height,
  DEFAULT_NOTIFICATION,
  INITIAL_REGION,
  DEFAULT_COOR_DELTA,
  width,
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

const SCREEN_WAIT_DURATION = 100;
const leftSpacer = { key: "left-spacer" };
const rightSpacer = { key: "right-spacer" };
const MAP_ANIMATION_DURATION = 700;

const calcRadius = (region) => {
  return 111.045 * region.longitudeDelta / 2;
}

const getZoomLevelFromRegion = (region) => {
  const { longitudeDelta } = region;
  // Normalize longitudeDelta which can assume negative values near central meridian
  const lngD = (360 + longitudeDelta) % 360;
  // Calculate the number of tiles currently visible in the viewport
  const tiles = width / 256;
  // Calculate the currently visible portion of the globe
  const portion = lngD / 360;
  // Calculate the portion of the globe taken up by each tile
  const tilePortion = portion / tiles;
  // Return the zoom level which splits the globe into that number of tiles
  return Math.log2(1 / tilePortion);
};

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export const HomeScreen = ({ navigation, route }) => {
  const { state, dispatch } = useContext(UserContext);
  const { user, notification, serverPlaces, settings } = state;

  const { askLocation, locationPermission } = useLocationPermissions();

  const [places, setPlaces] = useState([]);
  let animationTimeout = null;
  const [listOpacity, setListOpacity] = useState(1);
  const [hideList, setHideList] = useState(true);
  const [hideButtons, setHideButtons] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [requestPermissions, setRequestPermissions] = useState(false);

  const isFocused = useIsFocused();
  const firstTime = useRef(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const lockAutoSearching = useRef(true);
  const ignoreCardsListener = useRef(false);
  const [globalTracksViewChanges, setGlobalTracksViewChanges] = useState(false);

  const cardsListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const listYTranslate = useRef(new Animated.Value(height * 0.25)).current;
  const buttonsTranslateY = useRef(new Animated.Value(0)).current;

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
      let location = await Location.getLastKnownPositionAsync({});
      if (location) {
        setLocation(location.coords);
      } else {
        lockAutoSearching.current = false;
        const radius = calcRadius(INITIAL_REGION);
        actuallyGetPlaces(INITIAL_REGION, null, radius);
      }
    } else {
      lockAutoSearching.current = false;
      const radius = calcRadius(INITIAL_REGION);
      actuallyGetPlaces(INITIAL_REGION, null, radius);
      if (status === 'undetermined') {
        setTimeout(() => {
          setRequestPermissions(true);
        }, 1000*20);
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
  useEffect(()=>{ // current location fetched
    if (objectLength(location) > 0) {
      const region = {
        ...location,
        ...DEFAULT_COOR_DELTA
      }
      actuallyGetPlaces(region, location, calcRadius(region));
      mapRef.current.animateToRegion(region, MAP_ANIMATION_DURATION);
      setTimeout(() => {
        if (lockAutoSearching?.current) {
          lockAutoSearching.current = false;
        }
      }, MAP_ANIMATION_DURATION+1000);
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
      if (ignoreCardsListener.current) {
        return;
      }
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
        if (serverPlaces && serverPlaces.length > 0) {
          setHideList(false);
          setHideButtons(false);
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
    Animated.timing(buttonsTranslateY, {
      toValue: hideButtons ? -(height * 0.25) : 0,
      duration: 700,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [hideButtons]);

  useEffect(() => {
    const params = route.params;
    if (params != null) {
      if (params.searchItem != null) {
        setListOpacity(0);
        const s = { ...params.searchItem };
        setTimeout(() => {
          showPlace(s);
          setTimeout(() => {
            setListOpacity(1);
          }, 400);
        }, 200);
        navigation.setParams({searchItem: null});
      } else if (params.signupNow === true) {
        navigation.setParams({signupNow: null});
        setHideList(true);
        setTimeout(() => {
          setHideList(true);
          navigation.navigate("Progress", {showSignup: true});
        }, SCREEN_WAIT_DURATION);
      } else if (params.reportNow != null) {
        const location = {...params.reportNow};
        navigation.setParams({reportNow: null});
        setListOpacity(0);
        setTimeout(() => {
          setListOpacity(0);
          setHideButtons(true);
          setHideList(true);  
          navigation.navigate("Report", { location });
          setTimeout(() => {
            setListOpacity(1);
          }, 1000);
        }, 200);
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
    // if (selectedPlace != null) {
      setHideList(true);
      setHideButtons(true);
      setTimeout(() => {
        setHideList(true);
        const location = selectedPlace;
        navigation.navigate("Report", { location });
      }, SCREEN_WAIT_DURATION);
    // }
  }, [selectedPlace, navigation])

  const explore = useCallback(() => {
    setHideList(true);
    setTimeout(() => {
      setHideList(true);
      navigation.navigate("Explore", {
        location: location ?? mapRef.current.__lastRegion,
        hasLocation: location != null
      });
    }, SCREEN_WAIT_DURATION);
  }, [navigation, location])

  const animateToItem = (item) => {
    const paddedLD = item.position.longitudeDelta + 0.15;
    mapRef.current.animateToRegion({
      ...item.position,
      longitudeDelta: paddedLD,
      latitudeDelta: paddedLD*SCREEN_ASPECT_RATIO
    }, MAP_ANIMATION_DURATION);
  };

  const showPlace = useCallback((place) => {
    setHideList(true);
    setTimeout(() => {
      setHideList(true);
      navigation.navigate("Place", { place });
    }, SCREEN_WAIT_DURATION);
  }, [navigation]);

  const askLocationPermissions = useCallback(() => {
    askLocation();
  }, []);

  const onRegionChangeComplete = async (region) => {
    setGlobalTracksViewChanges(false);
    if (lockAutoSearching.current) {
      return;
    }
    const radius = calcRadius(region);
    // if (location != null) {
      debounce.cancel()
      debounce(region, radius);
    // } else {
    //   console.log("current location is null");
    // }
  }

  const debounce = useCallback(_.debounce((region, radius) => {
    actuallyGetPlaces(region, location, radius)
  }, 700), [location]);

  const actuallyGetPlaces = async (region, location, radius) => {
    const pp = await getPlaces(region, location, radius);
    if (pp && pp !== null && pp != undefined) {
      dispatch({
        type: SAVE_PLACES,
        payload: pp,
      });
    }
  }

  const markerPressed = useCallback((place) => {
    if (selectedPlace != null && place._id === selectedPlace._id) {
      return;
    }
    const index = serverPlaces.findIndex(p=>p.key===place.key);
    if (index > -1) {
      ignoreCardsListener.current = true;
      lockAutoSearching.current = true;
      setSelectedPlace(place);
      cardsListRef.current.scrollToOffset({
        animated: true,
        offset: index*ITEM_WIDTH
      });
      animateToItem(place);
    }
  }, [serverPlaces])

  const onPanDrag = useCallback(()=>{
    lockAutoSearching.current = false
  }, [])

  const onRegionChange = useCallback(()=>{
    setGlobalTracksViewChanges(true);
    if (!lockAutoSearching.current) {
      setHideList(true)
    }
  }, [])

  return (
    <View style={globalStyles.homeContainer}>
      <MapView
        onPanDrag={onPanDrag}
        moveOnMarkerPress={false}
        onRegionChange={onRegionChange}
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
        <Animated.View style={globalStyles.homeTopContainer(buttonsTranslateY)}>
          <HomeButton index={2} notification={notification} onPress={progress} />
          <HomeButton index={1} onPress={report} />
          <HomeButton index={0} onPress={explore} />
        </Animated.View>
      </SafeAreaView>
      <AnimatedSafeAreaView style={globalStyles.cardContainerTranslateY(listYTranslate)}>
        <Animated.FlatList
          ref={cardsListRef}
          data={places}
          horizontal
          style={globalStyles.mainListStyle(CARD_TRANSLATE_Y, listOpacity)}
          contentContainerStyle={globalStyles.mainListContainer}
          onScrollBeginDrag={()=>{
            lockAutoSearching.current = true;
            setGlobalTracksViewChanges(true);
          }}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true}
          )}
          onMomentumScrollEnd={()=>ignoreCardsListener.current=false}
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
      </AnimatedSafeAreaView>
      <GrowthPoints isFocused={isFocused} popupVisible={popupVisible} />
      <Popup
        permissions={true}
        textData={strings.popups.locationPermissions}
        action={askLocationPermissions}
        popupVisible={popupVisible}
        setPopupVisible={setPopupVisible}
      />
    </View>
  );
};
