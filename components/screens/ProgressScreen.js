import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, SafeAreaView } from "react-native";
import { colors } from "../../values/colors";
import {EXIT_SIZE} from "../screens/ExploreScreen";

export const ProgressScreen = ({navigation}) => {

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>

      <TouchableWithoutFeedback onPress={goBack} style={styles.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <SafeAreaView />

      <View style={styles.progressScreenContainer}>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressScreenContainer: {
    paddingVertical: 30,
    borderTopRightRadius: 30,
    flex: 1,
    backgroundColor: "white",
    marginRight: EXIT_SIZE,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.clear
  },
  tap: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: EXIT_SIZE,
  },
})