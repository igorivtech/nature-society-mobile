import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Pagination } from "./Slider";

export const Report = ({goBack}) => {
  return (
    <View style={styles.container}>
      <View style={styles.pagContainer}>
        <Pagination index={2} />
      </View>
      <TouchableOpacity onPress={goBack}>
        <Text>Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "33.3333333333333%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  pagContainer: {
    position: 'absolute',
    top: 55,
    left: 30
  }
});