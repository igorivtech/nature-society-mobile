import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const Report = ({goBack}) => {
  return (
    <View
      style={{
        height: "33.3333333333333%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={goBack}>
        <Text>Report</Text>
      </TouchableOpacity>
    </View>
  );
};