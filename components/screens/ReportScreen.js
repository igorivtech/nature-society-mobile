import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { styles } from "../../values/styles";

export const ReportScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback style={StyleSheet.absoluteFill} onPress={()=>navigation.goBack()}>
        <Text>ReportScreen</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};
