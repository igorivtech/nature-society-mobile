import React, { useRef, useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { globalStyles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";
import { Popup } from "../views/Popup"

import * as Animatable from "react-native-animatable";
import { RecentVisitor } from "../views/home/views";
import {
  emptyFunc,
  height,
  NAV_CLOSE_TAP_SIZE,
  recentVisitors,
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

export const PlaceScreen = ({ navigation, route }) => {

  const {state, dispatch} = useContext(UserContext);
  const {serverPlaces, user, settings} = state;

  const { place } = route.params;

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTextData, setPopupTextData] = useState(strings.popups.empty);
  const popupAction = useRef(emptyFunc);
  const [pupupSingle, setPopupSingle] = useState(true);

  const [loadingBuy, setLoadingBuy] = useState(false);

  const textRef = useRef();
  const ratingRef = useRef();
  const visitorsRef = useRef();
  const descRef = useRef();
  const actionsRef = useRef();

  const waze = () => {
    console.log("waze");
  };

  const share = () => {
    console.log("share");
  };

  const report = () => {
    navigation.navigate("Report", {location: place});
  };

  const goBack = () => {
    Promise.all([
      textRef.current.fadeOut(fadeOutDuration),
      ratingRef.current.fadeOut(fadeOutDuration),
      visitorsRef.current.fadeOut(fadeOutDuration),
      descRef.current.fadeOut(fadeOutDuration),
      actionsRef.current.fadeOut(fadeOutDuration),
    ]).then(() => navigation.goBack());
    // textRef.current.fadeOut(fadeOutDuration);
    // ratingRef.current.fadeOut(fadeOutDuration);
    // visitorsRef.current.fadeOut(fadeOutDuration);
    // descRef.current.fadeOut(fadeOutDuration);
    // actionsRef.current.fadeOut(fadeOutDuration);
    // navigation.goBack();
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
    navigation.navigate("Home", {signupNow: true})
  }

  const unlockPlace = async () => {
    if (user === null) {
      popupAction.current = signupNow;
      setPopupSingle(false);
      setPopupTextData(strings.popups.signupNow)
      setPopupVisible(true);
    } else if (user.points >= settings.pointsForUnlock) {
      try {
        setLoadingBuy(true);
        let attributes = {}
        let unlockedPlaces = user.unlockedPlaces;
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
        console.error({error});
      } finally {
        setLoadingBuy(false);
      }
    } else {
      popupAction.current = playMore;
      setPopupSingle(true);
      setPopupTextData(strings.popups.cantBuy)
      setPopupVisible(true);
    }
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
            animation="bounceIn"
            delay={600}
            style={globalStyles.fullWidth}
          >
            <Text style={textStyles.boldOfSize(24)}>{place.title}</Text>

            <Text style={textStyles.normalOfSize(24)}>
              {strings.distanceFromYou(place.distance)}
            </Text>
          </Animatable.View>

          <Animatable.View
            useNativeDriver
            ref={ratingRef}
            animation="bounceIn"
            delay={800}
            style={s.ratingContainer}
          >
            <PlaceRating
              loading={loadingBuy}
              pointsToUnlock={settings.pointsForUnlock}
              unlockPlace={unlockPlace}
              locked={placeLocked(user, place)}
              title={strings.placeScreen.crowdnessTitle(false)}
              image={require("../../assets/images/HowBusyOrange.png")}
              color={colors.desertRock}
              rating={place.crowdness}
            />

            <PlaceRating
              leftMargin={40}
              title={strings.placeScreen.cleannessTitle(placeLocked(user, place))}
              image={require("../../assets/images/HeartL.png")}
              color={colors.grass}
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
            style={globalStyles.fullWidth}
          >
            <Text style={textStyles.normalOfSize(12)}>
              {strings.placeScreen.recentVisitors(placeLocked(user, place))}
            </Text>
            <View style={s.recentVisitorsContainer}>
              {recentVisitors.map((visitor, index) => (
                <RecentVisitor
                  key={`${index}`}
                  large
                  title={visitor.name}
                  details={visitor.role}
                  image={visitor.image}
                />
              ))}
            </View>
          </Animatable.View>

          <Animatable.Text
            useNativeDriver
            animation="fadeInUp"
            delay={700}
            ref={descRef}
            style={s.desc}
          >
            {place.description}
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
              onPress={share}
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
      <Popup textData={popupTextData} single={pupupSingle} popupVisible={popupVisible} setPopupVisible={setPopupVisible} actionRef={popupAction} />
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
        {locked ? (
          <TouchableOpacity disabled={loading || !locked || unlockPlace == null} onPress={unlockPlace}>
            <View style={s.buyIndicatorContainer}>
              <ActivityIndicator color={colors.treeBlues} style={s.buyIndicator} animating={loading}/>
            </View>
            <View style={s.buyContainer(small)}>
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
            {rating}
          </Text>
        )}
        
        <Image source={locked ? (small ? require("../../assets/images/place_locked_icon_small.png") : require("../../assets/images/place_locked_icon_large.png")) : image} />
      </View>
      
      
    </View>
  );
};

const s = StyleSheet.create({

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

  buyContainer: (small) => ({
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
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  imageStyle: {
    resizeMode: "cover",
    borderRadius: 15,
    width: "100%",
    height: height * 0.27,
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
