import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { HomeButton } from "../views/home/views";
import { styles } from "../../values/styles";

export const HomeScreen = () => {
  const progress = () => {
    console.log("progress pressed");
  };

  const report = () => {
    console.log("report pressed");
  };

  const explore = () => {
    console.log("explore pressed");
  };

  return (
    <View>
      <MapView provider={PROVIDER_GOOGLE} style={styles.mapStyle} />

      <SafeAreaView>
        <View style={styles.homeTopContainer}>
          <HomeButton index={2} onPress={progress} />
          <HomeButton index={1} onPress={report} />
          <HomeButton index={0} onPress={explore} />
        </View>
      </SafeAreaView>
    </View>
  );
};
