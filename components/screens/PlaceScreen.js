import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { styles } from "../../values/styles";

const PlaceScreen = ({ navigation, route }) => {
  const { place } = route.params;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000"
      }}
    >
      <SharedElement
        style={StyleSheet.absoluteFill}
        id={`place.${place.key}.bg`}
      >
        <View style={{
          ...StyleSheet.absoluteFill,
          backgroundColor: 'white'
        }} />
      </SharedElement>

      <SharedElement
        style={{
          height: 200,
          width: 200,
        }}
        id={`place.${place.key}.image`}
      >
        <Image
          style={{
            height: 200,
            width: 200,
          }}
          source={{ uri: place.image }}
        />
      </SharedElement>
    </View>
  );
};

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

export default PlaceScreen;
