import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { colors } from "../../values/colors";
import { CARD_RADIUS, width } from "../../values/consts";

export const LoginScreen = ({ navigation }) => {
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}
      ></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 40,
    paddingHorizontal: 0,
    width: width - 2 * 30,
    alignSelf: "center",
    aspectRatio: 1 / 1.1,
    backgroundColor: "white",
    borderRadius: CARD_RADIUS,
    shadowOffset: {
      height: -4,
      width: 0,
    },
    shadowColor: "rgba(0, 0, 0, 0.035)",
    shadowRadius: 12,
    shadowOpacity: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.grass,
    alignItems: "center",
    justifyContent: "center",
  },
});
