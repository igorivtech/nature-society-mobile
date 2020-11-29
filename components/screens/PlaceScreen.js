import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";
import { SharedElement } from "react-navigation-shared-element";
import { colors } from "../../values/colors";
import { fonts } from "../../values/fonts";
import { strings } from "../../values/strings";
import { styles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";

import {RecentVisitor} from '../screens/HomeScreen'

const recentVisitors = [
  {name: "איגור", role: "לקט", image: "https://yt3.ggpht.com/ytc/AAUvwngMp380bo6VdFqO0Y81qDqJKsedWvTosxGAAZwp=s900-c-k-c0x00ffffff-no-rj"},
  {name: "יואב", role: "צייד", image: "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"},
]

export const PlaceScreen = ({ navigation, route }) => {
  const { place, locked } = route.params;

  return (
    <View style={s.container}>
      <TouchableWithoutFeedback
        onPress={() => navigation.goBack()}
        style={s.tap}
      >
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <View style={s.containerStyle}>
        <SharedElement
          style={StyleSheet.absoluteFill}
          id={`place.${place.key}.bg`}
        >
          <View style={s.bgStyle} />
        </SharedElement>

        <View style={styles.fullWidth}>
          <Text style={textStyles.boldOfSize(24)}>{place.title}</Text>

          <Text style={textStyles.normalOfSize(24)}>
            {`${place.distance} ק״מ ממך`}
          </Text>
        </View>

        <View style={s.ratingContainer}>
          <PlaceRating
            locked
            title={"עומס מבקרים"}
            image={require("../../assets/images/HowBusyOrange.png")}
            color={colors.desertRock}
            rating={place.crowdness}
          />

          <PlaceRating
            locked
            leftMargin={40}
            title={locked ? "מצב וניקיון הטבע" : "מצב הטבע"}
            image={require("../../assets/images/HeartL.png")}
            color={colors.grass}
            rating={place.cleanness}
          />
        </View>

        <SharedElement style={s.imageStyle} id={`place.${place.key}.image`}>
          <Image style={s.imageStyle} source={{ uri: place.image }} />
        </SharedElement>

        <View style={styles.fullWidth}>
          <Text style={textStyles.normalOfSize(12)}>{strings.placeScreen.recentVisitors(locked)}</Text>
          <View style={s.recentVisitorsContainer}>
            {recentVisitors.map((visitor) => <RecentVisitor large title={visitor.name} details={visitor.role} image={visitor.image} /> )}
          </View>
        </View>
        
      </View>
    </View>
  );
};

const PlaceRating = ({
  locked,
  title,
  image,
  color,
  rating,
  leftMargin = 0,
}) => {
  return (
    <View style={styles.marginLeft(leftMargin)}>
      <Text style={textStyles.normalOfSize(14)}>{title}</Text>

      <View style={s.ratingInnerContainer}>
        <Text style={{ ...textStyles.normalOfSize(36), color, marginRight: 8 }}>
          {rating}
        </Text>
        <Image source={image} />
      </View>
    </View>
  );
};

const s = StyleSheet.create({

  recentVisitorsContainer: {
    marginTop: 4,
    justifyContent: 'flex-start',
    flexDirection: 'row-reverse',
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
    marginTop: 64,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  imageStyle: {
    width: "100%",
    aspectRatio: 1.3,
  },

  container: {
    flex: 1,
    backgroundColor: colors.grass,
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

// export default PlaceScreen;
