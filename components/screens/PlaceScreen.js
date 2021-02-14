import React, { useRef, useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Animated,
  Easing,
  LayoutAnimation
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { globalStyles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";
import { Popup } from "../views/Popup"
import { useShare } from "../../hooks/useShare";
import { showLocation } from 'react-native-map-link'
import { Popup as DirectionsPopup } from 'react-native-map-link';

import * as Animatable from "react-native-animatable";
import { RecentVisitor } from "../views/home/views";
import {
  emptyFunc,
  height,
  isAlt,
  NAV_CLOSE_TAP_SIZE,
  recentVisitors,
  smallScreen,
  statusBarHeight,
  WHITE_LIST_APPS,
} from "../../values/consts";
import {
  Directions,
  FlingGestureHandler,
  State,
} from "react-native-gesture-handler";
import {UserContext} from "../../context/context"
import {SAVE_PLACES, SAVE_USER} from "../../context/userReducer";
import { Auth } from "aws-amplify";
import {ATTRIBUTE_POINTS, ATTRIBUTE_UNLOCKED_PLACES, cognitoToUser, dicToArray} from '../../hooks/useUser';
import { formatRating, placeLocked } from "../../hooks/helpers";
import LottieView from 'lottie-react-native';
import posed, {Transition as PosedTransition} from 'react-native-pose';
import useIsMounted from "ismounted";
import { ClosePanelArrow } from "../views/ClosePanelArrow";
import { InfoModal } from "../views/place/InfoModal";

const PosedText = posed.Text({
  enter: {opacity: 1},
  exit: {opacity: 0}
})

const PosedtouchableOpacity = posed(TouchableOpacity)({
  enter: {opacity: 1},
  exit: {opacity: 0}
})

const AnimatedLottie = Animated.createAnimatedComponent(LottieView);

const fadeOutDuration = 100;
let VERTICAL_MARGIN = Math.min(35, height*0.015);
let CONTAINER_VERTICAL_PADDING = 40;
if (height > 667) {
  VERTICAL_MARGIN = Math.min(35, height*0.025);
} else {
  CONTAINER_VERTICAL_PADDING = 30;
}

export const PlaceScreen = ({ navigation, route }) => {

  const {state, dispatch} = useContext(UserContext);
  const {serverPlaces, user, settings} = state;

  const { place } = route.params;

  const { share } = useShare();

  const isMounted = useIsMounted();

  const [infoVisible, setInfoVisible] = useState(false);
  // const [directionsPopupVisible, setDirectionsPopupVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTextData, setPopupTextData] = useState(strings.popups.empty);
  const popupAction = useRef(emptyFunc);
  const [errorData, setErrorData] = useState(strings.popups.empty);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const textRef = useRef();
  const ratingRef = useRef();
  const visitorsRef = useRef();
  const descRef = useRef();
  const actionsRef = useRef();

  const waze = () => {
    // setDirectionsPopupVisible(true);
    showLocation({
      latitude: place.position.latitude,
      longitude: place.position.longitude,
      // sourceLatitude: -8.0870631,  // optionally specify starting location for directions
      // sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
      title: place.title,  // optional
      // dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
      // dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
      // cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
      appsWhiteList: WHITE_LIST_APPS,
  })
    // popupAction.current = openWaze;
    // setPopupTextData(strings.popups.waze)
    // setPopupVisible(true);
  };

  const sharePressed = () => {
    share(strings.placeScreen.sharePlace(place.title), place._id);
  };

  const report = () => {
    route.params.place = null;
    navigation.navigate("Home", {reportNow: {...place}})
  };

  const goBack = () => {
    navigation.goBack()
  };

  const handleSwipeDown = (event) => {
    if (event.nativeEvent.state === State.END) {
      goBack();
    }
  };

  const playMore = () => {
    console.log("playMore");
  }

  const signupNow = () => {
    navigation.navigate("Home", {loginLogout: true})
  }

  const unlockPlace = async () => {
    if (user === null) {
      popupAction.current = signupNow;
      setPopupTextData(strings.popups.signupNow)
      setPopupVisible(true);
    } else if (user.points >= settings.pointsForUnlock) {
      try {
        setLoadingBuy(true);
        let attributes = {}
        let unlockedPlaces = {...user.unlockedPlaces};
        unlockedPlaces[`${place.siteDocumentId}`] = 1
        attributes[ATTRIBUTE_UNLOCKED_PLACES] = JSON.stringify(dicToArray(unlockedPlaces));
        attributes[ATTRIBUTE_POINTS] = `${user.points - settings.pointsForUnlock}`;
        let cognitoUser = await Auth.currentAuthenticatedUser({
          // bypassCache: true,
        });
        let result = await Auth.updateUserAttributes(cognitoUser, attributes);
        if (result === 'SUCCESS') {
          let updatedCognitoUser = await Auth.currentAuthenticatedUser({
            bypassCache: true,
          });
          // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          dispatch({
            type: SAVE_USER,
            payload: cognitoToUser(updatedCognitoUser)
          })
        }
      } catch (error) {
        handleError(error)
      } finally {
        if (!isMounted.current) {return}
        setLoadingBuy(false);
      }
    } else {
      popupAction.current = playMore;
      setPopupTextData(strings.popups.cantBuy)
      setPopupVisible(true);
    }
  }

  const handleError = (error) => {
    if (!isMounted.current) {return}
    if (error) {
      setErrorData(strings.popups.loginError(error.code));
      setErrorPopupVisible(true);
    }
    console.error(error);
  }

  const showInfo = () => {
    setInfoVisible(true);
  }

  return (
    <View style={s.container}>
      <TouchableWithoutFeedback onPress={goBack} style={s.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>
      <ClosePanelArrow direction='bottom' topMargin={statusBarHeight} topHeight={NAV_CLOSE_TAP_SIZE-statusBarHeight} />
      <FlingGestureHandler
        direction={Directions.DOWN}
        onHandlerStateChange={handleSwipeDown}
      >
        <View style={s.containerStyle}>

          <Animatable.View
            useNativeDriver
            ref={textRef}
            // animation="bounceIn"
            delay={600}
            style={{...globalStyles.fullWidth, marginBottom: VERTICAL_MARGIN}}
          >
            <View style={s.topContainer}>
              <Text numberOfLines={2} adjustsFontSizeToFit={true} minimumFontScale={0.7} style={s.title}>{`${place.title.trim()}`}</Text>
              <TouchableOpacity onPress={showInfo} style={s.infoButtonContainer}>
                <Image style={globalStyles.imageJustContain} source={require("../../assets/images/info_icon.png")} />
              </TouchableOpacity>
            </View>

            <Text style={textStyles.normalOfSize(24)}>
              {strings.distanceFromYou(place.distance)}
            </Text>
          </Animatable.View>

          <TouchableWithoutFeedback onPress={showInfo}>
            <Animatable.View
              useNativeDriver
              ref={ratingRef}
              // animation="bounceIn"
              delay={800}
              style={s.ratingContainer}
            >
              <PlaceRating
                isCleanness={false}
                loading={loadingBuy}
                pointsToUnlock={settings.pointsForUnlock}
                unlockPlace={unlockPlace}
                locked={placeLocked(user, place)}
                title={strings.placeScreen.crowdnessTitle(false)}
                image={require("../../assets/images/HowBusyL.png")}
                color={place.crowdnessColor}
                rating={place.crowdness}
              />

              <PlaceRating
                isCleanness={true}
                leftMargin={smallScreen ? 16 : 40}
                title={strings.placeScreen.cleannessTitle(placeLocked(user, place))}
                image={require("../../assets/images/HeartL.png")}
                color={place.cleannessColor}
                rating={place.cleanness}
              />
            </Animatable.View>
          </TouchableWithoutFeedback>

          <View style={[s.imageStyle, globalStyles.centerChildren, {
            overflow: 'hidden',
            }]}>
            {place.image == null && (
              <Image source={require("../../assets/images/default_place_bg.png")} />
            )}
            {place.image != null && (
              <View style={globalStyles.centerChildren}>
                <ActivityIndicator animating={loadingImage} />
              </View>
            )}
            {place.image != null && (
              <Image onLoadStart={()=>setLoadingImage(true)} onLoad={()=>setLoadingImage(false)} style={StyleSheet.absoluteFill} source={{ 
                uri: place.image,
                cache: 'force-cache'
              }} />
            )}
          </View>

          <Animatable.View
            useNativeDriver
            animation="fadeInUp"
            delay={500}
            ref={visitorsRef}
            style={{...globalStyles.fullWidth, marginVertical: VERTICAL_MARGIN}}
          >
            {place.lastVisitors.length > 0 && (
              <Text style={textStyles.normalOfSize(12)}>
                {strings.placeScreen.recentVisitors(placeLocked(user, place))}
              </Text>
            )}
            {place.lastVisitors.length > 0 && (
              <View style={s.recentVisitorsContainer}>
                {place.lastVisitors.slice(0, 2).map((visitor, index) => (
                  <RecentVisitor
                    key={`${index}`}
                    large
                    title={visitor.lastVisitorName}
                    details={visitor.lastVisitorRank}
                    image={visitor.lastVisitorImage}
                  />
                ))}
              </View>
            )}
          </Animatable.View>

          <Animatable.Text
            adjustsFontSizeToFit={true}
            useNativeDriver
            animation="fadeInUp"
            delay={700}
            ref={descRef}
            style={s.desc}
          >
            {place.description.trim()}
          </Animatable.Text>

          <Animatable.View
            useNativeDriver
            animation="fadeInUp"
            delay={900}
            ref={actionsRef}
            style={s.actions}
          >
            <PlaceAction
              onPress={waze}
              title={strings.placeScreen.waze}
              icon={require("../../assets/images/waze_icon.png")}
            />
            <PlaceAction
              onPress={report}
              title={strings.placeScreen.report}
              icon={require("../../assets/images/report_icon.png")}
            />
            <PlaceAction
              onPress={sharePressed}
              title={strings.placeScreen.share}
              icon={require("../../assets/images/share_icon.png")}
            />
          </Animatable.View>
        </View>
      </FlingGestureHandler>
      <Popup textData={popupTextData} popupVisible={popupVisible} setPopupVisible={setPopupVisible} actionRef={popupAction} />
      <Popup textData={errorData} popupVisible={errorPopupVisible} setPopupVisible={setErrorPopupVisible} />
      <InfoModal visible={infoVisible} setVisible={setInfoVisible} />
    </View>
  );
};

const PlaceAction = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <View style={{
        height: 29,
        width: 29,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image resizeMode='contain' style={[globalStyles.imageJustContain, {
          resizeMode: 'contain',
        }]} source={icon} />
      </View>
      <Text
        style={{
          ...textStyles.normalOfSize(12),
          textAlign: "center",
          marginTop: 6,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const PlaceRating = ({
  isCleanness,
  loading = false,
  locked,
  title,
  image,
  color,
  rating,
  leftMargin = 0,
  small = false,
  unlockPlace,
  pointsToUnlock = null
}) => {

  const lottieOpacity = useRef(new Animated.Value(0)).current;
  const imageOpacity = lottieOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

  const lottie = useRef();
  useEffect(()=>{
    if (lottie?.current) {
      if (loading) {
        lottie.current.play();
      } else {
        lottie.current.reset();
      }
      Animated.timing(lottieOpacity, {
        toValue: loading ? 1 : 0,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }).start();
    }
  }, [loading])

  const lockedOpacity = useRef(new Animated.Value(locked ? 1 : 0)).current;
  const openOpacity = lockedOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  })
  const [ratingAnimation, setRatingAnimation] = useState(null);
  useEffect(()=>{
    const newOpacity = locked ? 1 : 0;
    if (newOpacity != lockedOpacity._value) {
      setRatingAnimation('fadeIn');
      Animated.timing(lockedOpacity, {
        duration: 100,
        toValue: locked ? 1 : 0,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }).start();
    }
  }, [locked])

  return (
    <View style={globalStyles.marginLeft(leftMargin)}>
      <Text style={textStyles.normalOfSize(small ? 13 : 14)}>{title}</Text>
      <View style={s.ratingInnerContainer(small)}>
        <Animatable.Text animation={ratingAnimation} style={s.ratingStyle(small, color)}>
          {formatRating(rating, isCleanness)}
        </Animatable.Text>
        <Animated.Image style={s.openImage(openOpacity, color)} source={image} />
      </View>
    </View>
  );
};

const s = StyleSheet.create({

  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  title: {
    ...textStyles.boldOfSize(24),
    paddingLeft: 15+16,
    flexGrow: 1,
    flexShrink: 1
  },

  infoButtonContainer: {
    position: 'absolute',
    top: 2,
    left: 2
  },

  lockedImage: (opacity) => ({
    tintColor: colors.lighterShade, 
    resizeMode: 'contain', 
    position: 'absolute', 
    opacity
  }),

  openImage: (opacity, tintColor) => ({
    tintColor, 
    resizeMode: 'contain', 
    opacity
  }),

  lottie: (opacity) => ({
    ...StyleSheet.absoluteFill, 
    opacity
  }),

  fixedHeight: {
    justifyContent: 'center',
    // height: 31.3333
  },

  buyIndicator: {
    transform: [{translateX: -24}]
  },

  buyIndicatorContainer: (opacity) => ({
    ...StyleSheet.absoluteFill, 
    flexDirection: 'row', 
    alignItems: 'center',
    opacity
  }),

  ratingStyle: (small, color) => ({
    ...textStyles.normalOfSize(isAlt ? (small ? 16 : (smallScreen ? 20 : 24)) : (small ? 22 : 36)), color, marginRight: 8 
  }),

  buyTitle: {
    ...textStyles.boldOfSize(14),
    color: colors.treeBlues,
    marginLeft: 12,
  },

  buyPoints: {
    marginHorizontal: 4,
    ...textStyles.normalOfSize(18),
    textAlign: 'center',
    color: colors.treeBlues,
  },

  buyContainer: (small, loading) => ({
    opacity: loading ? 0.75 : 1,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.treeBlues,
    borderRadius: small ? 11 : 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'row'
  }),

  desc: {
    ...textStyles.normalOfSize(16),
    ...globalStyles.fullWidth,
    lineHeight: 17,
    marginBottom: VERTICAL_MARGIN,
    flexGrow: 1
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    ...globalStyles.fullWidth,
  },

  recentVisitorsContainer: {
    marginTop: 4,
    justifyContent: "flex-start",
    flexDirection: "row-reverse",
    // backgroundColor: 'cyan'
  },

  tap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },

  ratingInnerContainer: (small) => ({
    alignSelf: 'flex-end',
    marginTop: 4,
    alignItems: 'center',
    flexDirection: "row",
  }),

  ratingContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    marginBottom: VERTICAL_MARGIN,
  },

  bgStyle: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "white",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },

  containerStyle: {
    flex: 1,
    marginTop: NAV_CLOSE_TAP_SIZE,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: CONTAINER_VERTICAL_PADDING,
    paddingHorizontal: 20,
    paddingBottom: smallScreen ? 20 : 40,
    backgroundColor: 'white',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },

  imageStyle: {
    backgroundColor: colors.imageBg,
    resizeMode: "cover",
    borderRadius: 15,
    width: "100%",
    // aspectRatio: smallScreen ? 2 : 1.429,
    minHeight: '20%',
    maxHeight: '40%',
    flexGrow: 100,
    flexShrink: 1
  },

  container: {
    flex: 1,
    backgroundColor: colors.clear,
  },
});

{/* <View style={s.ratingInnerContainer(small)}>
  <View style={s.fixedHeight}>
    {locked ? (
      <TouchableOpacity disabled={loading || !locked || unlockPlace == null} onPress={unlockPlace}>
        <View style={s.buyContainer(small, loading)}>
          <Text style={s.buyPoints}>{pointsToUnlock}</Text>
          <View>
            <Animated.Image 
              style={[globalStyles.imageContain(small), {opacity: imageOpacity}]} 
              source={small ? require("../../assets/images/buy_it_small.png") : require("../../assets/images/buy_it_large.png")}
            />
            <AnimatedLottie
              style={s.lottie(lottieOpacity)}
              ref={lottie}
              loop={true}
              source={require("../../assets/animations/buy_spin.json")} 
              resizeMode='cover'
            />
          </View>
          {!small && (
            <Text style={s.buyTitle}>{strings.showInfo}</Text>
          )}
        </View>
      </TouchableOpacity>
    ) : (
      <Animatable.Text animation={ratingAnimation} style={s.ratingStyle(small, color)}>
        {formatRating(rating, isCleanness)}
      </Animatable.Text>
    )}
  </View>

  <View>
    <Animated.Image style={s.openImage(openOpacity, color)} source={image} />
    <Animated.Image style={s.lockedImage(lockedOpacity)} source={image} />
  </View>
</View> */}

// PlaceScreen.sharedElements = (route, otherRoute, showing) => {
//   const { place } = route.params;
//   return [
//     {
//       id: `place.${place.key}.bg`,
//     },
//     {
//       id: `place.${place.key}.image`,
//     },
//   ];
// };

//<DirectionsPopup 
//  isVisible={directionsPopupVisible}
//  onCancelPressed={closeNavPopup}
//  onAppPressed={closeNavPopup}
//  onBackButtonPressed={closeNavPopup}
//  modalProps={{ // you can put all react-native-modal props inside.
//      animationIn: 'slideInUp'
//  }}
//  appsWhiteList={WHITE_LIST_APPS}
//  options={{ 
//    latitude: place.position.latitude,
//    longitude: place.position.longitude,
//    title: place.title,  // optional
//  }}
//  style={{ /* Optional: you can override default style by passing your values. */ }}
///>

// const closeNavPopup = useCallback(() => {
//   setDirectionsPopupVisible(false);
// }, [])

// const openWaze = () => {
//   Linking.openURL(`https://www.waze.com/ul?ll=${place.position.latitude},${place.position.longitude}&navigate=yes&zoom=17`)
// }