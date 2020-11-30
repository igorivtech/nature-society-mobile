import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { styles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";

import * as Animatable from "react-native-animatable";
import { RecentVisitor } from "../views/home/views";
import {
  height,
  NAV_CLOSE_TAP_SIZE,
  recentVisitors,
} from "../../values/consts";
import {
  Directions,
  FlingGestureHandler,
  State,
} from "react-native-gesture-handler";

const fadeOutDuration = 100;

export const PlaceScreen = ({ navigation, route }) => {
  const { place } = route.params;

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
    console.log("report");
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
            style={styles.fullWidth}
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
              locked={place.locked}
              title={strings.placeScreen.crowdnessTitle}
              image={require("../../assets/images/HowBusyOrange.png")}
              color={colors.desertRock}
              rating={place.crowdness}
            />

            <PlaceRating
              locked={place.locked}
              leftMargin={40}
              title={strings.placeScreen.cleannessTitle(place.locked)}
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
            style={styles.fullWidth}
          >
            <Text style={textStyles.normalOfSize(12)}>
              {strings.placeScreen.recentVisitors(place.locked)}
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
  locked,
  title,
  image,
  color,
  rating,
  leftMargin = 0,
  small = false
}) => {
  return (
    <View style={styles.marginLeft(leftMargin)}>
      <Text style={textStyles.normalOfSize(small ? 13 : 14)}>{title}</Text>

      <View style={s.ratingInnerContainer}>
        <Text style={{ ...textStyles.normalOfSize(small? 22 : 36), color, marginRight: 8 }}>
          {rating}
        </Text>
        <Image source={image} />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  desc: {
    ...textStyles.normalOfSize(16),
    ...styles.fullWidth,
    lineHeight: 17,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    ...styles.fullWidth,
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

PlaceScreen.sharedElements = (route, otherRoute, showing) => {
  const { place } = route.params;
  return [
    {
      id: `place.${place.key}.bg`,
    },
    {
      id: `place.${place.key}.image`,
    },
  ];
};
