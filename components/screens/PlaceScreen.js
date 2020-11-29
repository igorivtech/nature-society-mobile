import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { colors } from "../../values/colors";
import { fonts } from "../../values/fonts";
import { styles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";

const PlaceRating = ({ locked, title, image, color, rating, leftMargin = 0 }) => {
  return (
    <View
      style={styles.marginLeft(leftMargin)}
    >
      <Text style={textStyles.normalOfSize(14)}>{title}</Text>
      
      <View
        style={s.ratingInnerContainer}
      >
        <Text style={{ ...textStyles.normalOfSize(36), color, marginRight: 8 }}>{rating}</Text>
        <Image source={image} />
      </View>
    </View>
  );
};

export const PlaceScreen = ({ navigation, route }) => {
  const { place, locked } = route.params;

  return (
    <View style={s.container}>
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
          <PlaceRating locked title={'עומס מבקרים'} image={require("../../assets/images/HeartL.png")} color={colors.desertRock} rating={place.crowdness} />

          <PlaceRating locked leftMargin={40} title={locked ? "מצב וניקיון הטבע" : "מצב הטבע"} image={require("../../assets/images/HeartL.png")} color={colors.grass} rating={place.cleanness} />
        </View>

        <SharedElement style={s.imageStyle} id={`place.${place.key}.image`}>
          <Image style={s.imageStyle} source={{ uri: place.image }} />
        </SharedElement>
      </View>
    </View>
  );
};

const s = StyleSheet.create({

  ratingInnerContainer: {
    marginTop: 4,
    flexDirection: "row",
  },

  ratingContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end'
  },

  bgStyle: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "white",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },

  containerStyle: {
    flex: 1,
    marginTop: 45,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
    paddingHorizontal: 20
  },

  imageStyle: {
    height: 200,
    width: 200,
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
