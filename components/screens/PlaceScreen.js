import React from "react";
import { View, Text } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

const PlaceScreen = ({ navigation, route }) => {
  const { place } = route.params;

  return (
    <SharedElement id={`place.${place.key}.bg`}>
      <View>
        <Text></Text>
      </View>
    </SharedElement>
  );
};

PlaceScreen.sharedElements = (route, otherRoute, showing) => {
  const {place} = route.params;
  return [
    {
      id: `place.${place.key}.bg`
    }
  ]
}

export default PlaceScreen;