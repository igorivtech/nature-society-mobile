import React, { useRef, useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { globalStyles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";
import { Popup } from "../views/Popup"
import { useShare } from "../../hooks/useShare";

import * as Animatable from "react-native-animatable";
import { RecentVisitor } from "../views/home/views";
import {
  emptyFunc,
  height,
  NAV_CLOSE_TAP_SIZE,
  recentVisitors,
  smallScreen,
} from "../../values/consts";
import {
  Directions,
  FlingGestureHandler,
  State,
} from "react-native-gesture-handler";
import {UserContext} from "../../context/context"
import {SAVE_PLACES, SAVE_USER} from "../../context/userReducer";
import { Auth } from "aws-amplify";
import {ATTRIBUTE_POINTS, ATTRIBUTE_UNLOCKED_PLACES, cognitoToUser} from '../../hooks/useUser';
import { placeLocked } from "../../hooks/helpers";

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

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTextData, setPopupTextData] = useState(strings.popups.empty);
  const popupAction = useRef(emptyFunc);
  const [errorData, setErrorData] = useState(strings.popups.empty);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const [loadingBuy, setLoadingBuy] = useState(false);

  const textRef = useRef();
  const ratingRef = useRef();
  const visitorsRef = useRef();
  const descRef = useRef();
  const actionsRef = useRef();

  const waze = () => {
    Linking.openURL(`https://www.waze.com/ul?ll=${place.position.latitude},${place.position.longitude}&navigate=yes&zoom=17`)
  };

  const sharePressed = () => {
    share(strings.placeScreen.sharePlace(place.title), "https://www.teva.org.il");
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
        unlockedPlaces[place._id] = 1
        attributes[ATTRIBUTE_UNLOCKED_PLACES] = JSON.stringify(unlockedPlaces);
        attributes[ATTRIBUTE_POINTS] = `${user.points - settings.pointsForUnlock}`;
        let cognitoUser = await Auth.currentAuthenticatedUser({
          bypassCache: true,
        });
        let result = await Auth.updateUserAttributes(cognitoUser, attributes);
        if (result === 'SUCCESS') {
          let updatedCognitoUser = await Auth.currentAuthenticatedUser({
            bypassCache: true,
          });
          dispatch({
            type: SAVE_USER,
            payload: cognitoToUser(updatedCognitoUser)
          })
        }
      } catch (error) {
        handleError(error)
      } finally {
        setLoadingBuy(false);
      }
    } else {
      popupAction.current = playMore;
      setPopupTextData(strings.popups.cantBuy)
      setPopupVisible(true);
    }
  }

  const handleError = (error) => {
    if (error) {
      setErrorData(strings.popups.loginError(error.code));
      setErrorPopupVisible(true);
    }
    console.error(error);
  }

  return (
    <View style={s.container}>
      <TouchableWithoutFeedback onPress={goBack} style={s.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <FlingGestureHandler
        direction={Directions.DOWN}
        onHandlerStateChange={handleSwipeDown}
      >
        <View style={s.containerStyle}>
          <SharedElement
            style={StyleSheet.absoluteFill}
            id={`place.${place.key}.bg`}
          >
            <View style={s.bgStyle} />
          </SharedElement>

          <Animatable.View
            useNativeDriver
            ref={textRef}
            // animation="bounceIn"
            delay={600}
            style={{...globalStyles.fullWidth, marginBottom: VERTICAL_MARGIN}}
          >
            <Text style={textStyles.boldOfSize(24)}>{place.title.trim()}</Text>

            <Text style={textStyles.normalOfSize(24)}>
              {strings.distanceFromYou(place.distance)}
            </Text>
          </Animatable.View>

          <Animatable.View
            useNativeDriver
            ref={ratingRef}
            // animation="bounceIn"
            delay={800}
            style={s.ratingContainer}
          >
            <PlaceRating
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
              leftMargin={40}
              title={strings.placeScreen.cleannessTitle(placeLocked(user, place))}
              image={require("../../assets/images/HeartL.png")}
              color={place.cleannessColor}
              rating={place.cleanness}
            />
          </Animatable.View>

          <SharedElement style={s.imageStyle} id={`place.${place.key}.image`}>
            <Image style={s.imageStyle} source={{ uri: place.image }} />
          </SharedElement>

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
              onPress={sharePressed}
              title={strings.placeScreen.share}
              icon={require("../../assets/images/share_icon.png")}
            />
            <PlaceAction
              onPress={report}
              title={strings.placeScreen.report}
              icon={require("../../assets/images/report_icon.png")}
            />
          </Animatable.View>
        </View>
      </FlingGestureHandler>
      <Popup textData={popupTextData} popupVisible={popupVisible} setPopupVisible={setPopupVisible} actionRef={popupAction} />
      <Popup textData={errorData} popupVisible={errorPopupVisible} setPopupVisible={setErrorPopupVisible} />
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
      <Image source={icon} />
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
  return (
    <View style={globalStyles.marginLeft(leftMargin)}>
      <Text style={textStyles.normalOfSize(small ? 13 : 14)}>{title}</Text>

      
      <View style={s.ratingInnerContainer}>
        <View style={s.fixedHeight}>
          {locked ? (
            <TouchableOpacity disabled={loading || !locked || unlockPlace == null} onPress={unlockPlace}>
              <View style={s.buyIndicatorContainer}>
                <ActivityIndicator color={colors.treeBlues} style={s.buyIndicator} animating={loading}/>
              </View>
              <View style={s.buyContainer(small, loading)}>
                {pointsToUnlock && (
                  <Text style={s.buyPoints}>{pointsToUnlock}</Text>
                )}
                <Image source={small ? require("../../assets/images/buy_it_small.png") : require("../../assets/images/buy_it_large.png")} />
                {!small && (
                  <Text style={s.buyTitle}>{strings.showInfo}</Text>
                )}
              </View>
            </TouchableOpacity>
          ) : (
            <Text style={s.ratingStyle(small, color)}>
              {rating.toFixed(1)}
            </Text>
          )}
        </View>
        
        <Image style={locked ? {} : {tintColor: color}} source={locked ? (small ? require("../../assets/images/place_locked_icon_small.png") : require("../../assets/images/place_locked_icon_large.png")) : image} />
      </View>
      
      
    </View>
  );
};

const s = StyleSheet.create({

  fixedHeight: {
    height: 31.3333
  },

  buyIndicator: {
    transform: [{translateX: -24}]
  },

  buyIndicatorContainer: {
    ...StyleSheet.absoluteFill, flexDirection: 'row', alignItems: 'center'
  },

  ratingStyle: (small, color) => ({
    ...textStyles.normalOfSize(small? 22 : 36), color, marginRight: 8 
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
    opacity: loading ? 0.5 : 1,
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
    alignItems: "center",
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

  ratingInnerContainer: {
    alignSelf: 'flex-end',
    marginTop: 4,
    alignItems: 'center',
    flexDirection: "row",
  },

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
  },

  imageStyle: {
    resizeMode: "cover",
    borderRadius: 15,
    width: "100%",
    aspectRatio: smallScreen ? 2 : 1.429
  },

  container: {
    flex: 1,
    backgroundColor: colors.clear,
  },
});

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
