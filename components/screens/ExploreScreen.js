import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { colors } from "../../values/colors";
import { NAV_CLOSE_TAP_SIZE } from "../../values/consts";

const EXIT_SIZE = 26;

export const ExploreScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => navigation.goBack()}
        style={styles.tap}
      >
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <SafeAreaView />

      <View style={styles.searchContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.clear,
  },

  searchContainer: {
    borderTopLeftRadius: 30,
    flex: 1,
    backgroundColor: "white",
    marginLeft: EXIT_SIZE,
  },

  tap: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: EXIT_SIZE,
  },
});
