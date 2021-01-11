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
  width,
  SPLASH_HIDE_DELAY,
} from "../../values/consts";
import { MAP_STYLE } from "../../values/map_style";
import {
  CARD_TRANSLATE_Y,
  ITEM_HEIGHT,
  ITEM_WIDTH,
  PlaceCard,
  spacerStyle,
  SPACER_ITEM_SIZE,
} from "../views/home/PlaceCard";
import { GrowthPoints } from "../views/home/GrowthPoints";
import { UserContext } from "../../context/context";
import { ASK_PUSH, SAVE_DEEP_LINK_ID, SAVE_NOTIFICATION, SAVE_PLACES } from "../../context/userReducer";
import { Popup } from "../views/Popup";
import { strings } from "../../values/strings";
import { useLocationPermissions } from "../../hooks/usePermissions";
import { useIsFocused } from '@react-navigation/native';
import { PlaceMarker } from "../views/home/PlaceMarker";
import * as Location from 'expo-location';
import { useServer } from "../../hooks/useServer";
// import _ from "lodash";
import { clamp, objectLength } from "../../hooks/helpers";
import { UserMarker } from "../views/home/UserMarker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { LogoView } from "../views/home/LogoView";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shouldAskUser } from "../../hooks/useNotifications";
// import {useCountRenders} from "../../hooks/useCountRenders"
// useCountRenders();

const SCREEN_WAIT_DURATION = 100;
const leftSpacer = { key: "left-spacer" };
const rightSpacer = { key: "right-spacer" };
const MAP_ANIMATION_DURATION = 700;

const calcRadius = (region) => {
  return 90 * region.longitudeDelta / 2;
}

const EPSILON = 0.01;

const mapAtPlace = (mapRegion, place) => {
  return Math.abs(mapRegion.latitude - place.position.latitude) < EPSILON && Math.abs(mapRegion.longitude - place.position.longitude) < EPSILON
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
  const { user, notification, serverPlaces, settings, deepLinkId } = state;

  const { askLocation, locationPermission } = useLocationPermissions();

  const [globalShow, setGlobalShow] = useState(null);
  const [places, setPlaces] = useState([]);
  const [listOpacity, setListOpacity] = useState(1);
  const [hideList, setHideList] = useState(true);
  const [hideButtons, setHideButtons] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [requestPermissions, setRequestPermissions] = useState(false);
  const [pushPopupVisible, setPushPopupVisible] = useState(false);
  const [showPushPopup, setShowPushPopup] = useState(false);

  const isFocused = useIsFocused();
  const firstTime = useRef(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const lockAutoSearching = useRef(true);
  const ignoreCardsListener = useRef(false);
  const [globalTracksViewChanges, setGlobalTracksViewChanges] = useState(false);
  const firstTimeSettingLocation = useRef(true);
  const specialLockForInitialFetch = useRef(false);
  const locationListener = useRef(null);
  const currSearchId = useRef(null);
  const keepMarkerAlive = useRef({});

  const cardsListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const listYTranslate = useRef(new Animated.Value(height*0.33)).current;
  const buttonsTranslateY = useRef(new Animated.Value(0)).current;

  const {bottom: bottomSafeAreaHeight} = useSafeAreaInsets();
  const listHiddenYHeight = ITEM_HEIGHT + CARD_TRANSLATE_Y + bottomSafeAreaHeight + 8;

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

  useEffect(()=>{
    if (deepLinkId != null && isFocused) {
      showPlace({...deepLinkId})
      dispatch({
        type: SAVE_DEEP_LINK_ID,
        payload: null
      })
    }
  }, [deepLinkId, isFocused])

  const tryFetchLocation = async () => {
    let { status } = await Location.getPermissionsAsync();
    if (status === 'granted') {
      let location = await Location.getLastKnownPositionAsync({});
      if (location) {
        setLocation(location.coords);
      } else {
        lockAutoSearching.current = false;
        console.log("actuallyGetPlaces: try fetch location granted but no location");
        actuallyGetPlaces(INITIAL_REGION, null);
      }
    } else {
      lockAutoSearching.current = false;
      console.log("actuallyGetPlaces: try fetch location not");
      actuallyGetPlaces(INITIAL_REGION, null);
      if (status === 'undetermined') {
        setTimeout(() => {
          setRequestPermissions(true);
        }, 1000*12);
      }
    }
  }

  useEffect(()=>{ // push popup
    shouldAskUser().then(should => {
      if (should) {
        setTimeout(() => {
          setShowPushPopup(true);
        }, (12+30)*1000);
      }
    })
  }, [])
  useEffect(()=>{
    // !popupVisible is location popup
    if (showPushPopup && isFocused && !popupVisible) {
      setShowPushPopup(false);
      setPushPopupVisible(true);
    }
  }, [showPushPopup, isFocused, popupVisible])
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
      if (firstTimeSettingLocation.current) {
        firstTimeSettingLocation.current = false;
        ignoreCardsListener.current = true;
        lockAutoSearching.current = true;
        specialLockForInitialFetch.current = true;
        setHideList(true);
        const region = {
          ...location,
          longitudeDelta: 0.7, // 1 is 111 kilometers
          latitudeDelta: 0.7*SCREEN_ASPECT_RATIO
        }
        console.log("actuallyGetPlaces: first time location fetched - useEffect");
        actuallyGetPlaces(region, location);
        setTimeout(() => {
          mapRef.current.animateToRegion(region, MAP_ANIMATION_DURATION);
        }, SPLASH_HIDE_DELAY*0.6);
        setTimeout(() => {
          ignoreCardsListener.current = false;
          lockAutoSearching.current = false;
        }, MAP_ANIMATION_DURATION+SPLASH_HIDE_DELAY*0.6+1000);
        //
        if (locationListener?.current != null) {
          locationListener?.current();
        }
        Location.watchPositionAsync({
          timeInterval: 60*1000,
          distanceInterval: 100 // meters
        }, (l) => {
          if (l != null && l.coords != null) {
            setLocation(l.coords)
          }
        }).then(r=>locationListener.current=r.remove);
      }
    }
  }, [location])

  useEffect(()=>{
    return () => {
      if (locationListener?.current != null) {
        locationListener?.current();
      }
    }
  }, [])

  useEffect(() => {
    if (serverPlaces && serverPlaces.length > 0) {
      setPlaces([leftSpacer, ...serverPlaces, rightSpacer]);
      // setGlobalShow(true);
      // setTimeout(() => {
      setSelectedPlace(serverPlaces[0]);
      ignoreCardsListener.current = true;
      cardsListRef.current.scrollToOffset({
        animated: false,
        offset: 0
      });
      setTimeout(() => {
        ignoreCardsListener.current = false;
      }, 10);
      if (isFocused) {
        setHideList(false);
        // animateToItem(serverPlaces[0]);
      }
      // }, 1000);
    } else {
      // somthing i guess?
    }
  }, [serverPlaces]);

  let animationTimeout = null;
  useEffect(()=>{ // setup cards listener
    scrollX.removeAllListeners();
    clearTimeout(animationTimeout);
    if (serverPlaces && serverPlaces.length > 0) {
      scrollX.addListener(({value}) => {
        if (ignoreCardsListener.current) {
          return;
        }
        const i = clamp(0, Math.round(value/ITEM_WIDTH), serverPlaces.length - 1);
        clearTimeout(animationTimeout);
        animationTimeout = setTimeout(()=>{
          if (i >= 0 && i < serverPlaces.length) {
            const item = serverPlaces[i];
            if (item.key !== selectedPlace?.key) {
              setSelectedPlace(item);
              animateToItem(item);
            }
          }
        }, 10);
      })
    }
  }, [serverPlaces, selectedPlace])

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
      toValue: hideList ? listHiddenYHeight : 0,
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
      } else if (params.loginLogout != null) {
        navigation.setParams({
          loginLogout: null
        });
        setListOpacity(0);
        setTimeout(() => {
          setListOpacity(0);
          setHideButtons(true);
          setHideList(true);
          if (user === null) {
            navigation.navigate("Login", {register: true});
          } else {
            navigation.navigate("Profile");
          }
          setTimeout(() => {
            setListOpacity(1);
          }, 1000);
        }, 200);
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
        location: location != null ? {...location} : mapRef.current.__lastRegion,
        hasLocation: location != null
      });
    }, SCREEN_WAIT_DURATION);
  }, [navigation, location])

  const animateToItem = (item) => {
    const ld = mapRef.current.__lastRegion.longitudeDelta;
    const noZoom = ld < 0.3;
    if (noZoom) {
      mapRef.current.animateToRegion({
        ...mapRef.current.__lastRegion,
        longitude: item.position.longitude,
        latitude: item.position.latitude,
      }, MAP_ANIMATION_DURATION);
    } else {
      const paddedLD = item.position.longitudeDelta + 0.2;
      mapRef.current.animateToRegion({
        ...item.position,
        longitudeDelta: paddedLD,
        latitudeDelta: paddedLD*SCREEN_ASPECT_RATIO
      }, MAP_ANIMATION_DURATION);
    }
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

  const askPush = () => {
    dispatch({
      type: ASK_PUSH,
      payload: true
    })
  }

  // const debounce = useCallback(_.debounce((region) => {
  //   console.log("actuallyGetPlaces: debounce");
  //   actuallyGetPlaces(region, location)
  // }, 500), [location]);

  const actuallyGetPlaces = (region, location) => {
    currSearchId.current = uuidv4();
    getPlaces(currSearchId.current, region, location, calcRadius(region)).then(data => {
      if (data !== null) {
        if (data.searchId === currSearchId.current) {
          const pp = data.pp;
          if (pp.length > 0) {
            // keepMarkerAlive.current = {}
            // serverPlaces.forEach(sp => {
            //   if (pp.findIndex(p=>p._id === sp._id) > -1) {
            //     keepMarkerAlive.current[sp._id] = 1;
            //   }
            // });
            // //
            // let timeout = (serverPlaces.length - 0)*50; // objectLength(keepMarkerAlive.current)
            // if (timeout > 0) {
            //   timeout += 300;
            // }
            // setGlobalShow(false);
            // setTimeout(() => {
            //   if (data.searchId === currSearchId.current) {
                dispatch({
                  type: SAVE_PLACES,
                  payload: pp,
                });
            //   }
            // }, timeout);
          }
        } else {
          console.log("DISCARDING OLD PLACES");
        }
        if (specialLockForInitialFetch.current) {
          specialLockForInitialFetch.current = false;
        }
      }
    })
  }

  const markerPressed = useCallback((place) => {
    if (selectedPlace != null && place._id === selectedPlace._id) {
      if (mapAtPlace(mapRef.current.__lastRegion, place)) {
        showPlace(place);
      } else {
        lockAutoSearching.current = true;
        animateToItem(place);
      }
    } else {
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
    }
  }, [selectedPlace, serverPlaces])

  const onRegionChangeComplete = async (region) => {
    // setGlobalTracksViewChanges(false);
    if (lockAutoSearching.current || specialLockForInitialFetch.current) {
      return;
    }
      
    actuallyGetPlaces(region, location) // TEST PURPOSES, instead of:
      // debounce.cancel()
      // debounce(region);
  }

  const onPanDrag = useCallback(()=>{
    lockAutoSearching.current = false
    currSearchId.current = null;
  }, [])

  const onRegionChange = useCallback(()=>{
    // setGlobalTracksViewChanges(true);
    if (!lockAutoSearching.current) {
      setSelectedPlace(null);
      setHideList(true)
    }
  }, [])

  const onMomentumScrollEnd = useCallback(()=>{
    ignoreCardsListener.current=false;
  }, [])

  const onScrollBeginDrag = useCallback(()=>{
    lockAutoSearching.current = true;
    // setGlobalTracksViewChanges(true);
  }, [])

  return (
    <View style={globalStyles.homeContainer}>
      <MapView
        rotateEnabled={false}
        moveOnMarkerPress={false}
        onPanDrag={onPanDrag}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        initialRegion={INITIAL_REGION}
        customMapStyle={MAP_STYLE}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={globalStyles.mapStyle}
      >
        {serverPlaces.map((p, index) => (
          <PlaceMarker 
            keepMarkerAlive={keepMarkerAlive} 
            globalShow={globalShow} 
            selected={selectedPlace?.key === p.key} 
            globalTracksViewChanges={globalTracksViewChanges} 
            index={index} 
            scrollX={scrollX} 
            onPress={markerPressed} 
            key={index} 
            place={p} 
          />
        ))}
        {location && (<UserMarker user={user} location={location} />)}
      </MapView>
      
      <SafeAreaView>
        <Animated.View style={globalStyles.homeTopContainer(buttonsTranslateY)}>
          <HomeButton index={2} notification={notification} onPress={progress} />
          <HomeButton index={1} onPress={report} />
          <HomeButton index={0} onPress={explore} />
        </Animated.View>
      </SafeAreaView>
      <AnimatedSafeAreaView style={globalStyles.cardContainerTranslateY(listYTranslate, listOpacity)}>
        <Animated.FlatList
          ref={cardsListRef}
          data={places}
          horizontal
          style={globalStyles.mainListStyle}
          contentContainerStyle={globalStyles.mainListContainer}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true}
          )}
          onScrollBeginDrag={onScrollBeginDrag}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.key}
          snapToInterval={ITEM_WIDTH}
          decelerationRate={0}
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
        <LogoView bottomHeight={listHiddenYHeight} listYTranslate={listYTranslate} />
      </AnimatedSafeAreaView>
      <GrowthPoints />
      <Popup
        permissions={true}
        textData={strings.popups.locationPermissions}
        action={askLocationPermissions}
        popupVisible={popupVisible}
        setPopupVisible={setPopupVisible}
      />
      <Popup
        permissions={true}
        textData={strings.popups.pushPermissions}
        action={askPush}
        popupVisible={pushPopupVisible}
        setPopupVisible={setPushPopupVisible}
      />
    </View>
  );
};
