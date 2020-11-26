import React from "react";
import { View, Text } from "react-native";
import MapView from 'react-native-maps';
import { styles } from "../../values/styles";

export const HomeScreen = () => {
  return (
    <View>
      <MapView style={styles.mapStyle} />
    </View>
  );
};
