import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { colors } from "../../../values/colors";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { Pagination } from "./Slider";

export const Report = ({goBack}) => {
  return (
    <View style={styles.container}>
      <View style={styles.firstContainer}>
        <GoBackButton goBack={goBack} />    
        <View style={styles.titlesContainer}>
          <View style={styles.pagContainer}>
            <Pagination index={2} />
          </View>
          <Text style={textStyles.normalOfSize(12)}>{strings.reportScreen.takePic1}</Text>
          <Text style={textStyles.normalOfSize(18)}>{strings.reportScreen.takePic2}</Text>
        </View>
      </View>
    </View>
  );
};

const GoBackButton = ({goBack}) => {
  return (
    <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
      <Image source={require("../../../assets/images/scroll_back_icon.png")} />
      <Text style={styles.goBack}>{strings.reportScreen.goBack}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({

  titlesContainer: {
    marginTop: 23
  },

  firstContainer: {
    flex: 1
  },

  container: {
    height: "33.3333333333333%",
    width: "100%",
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: 13,
    paddingBottom: 21,
    paddingHorizontal: 30
  },
  pagContainer: {
    position: 'absolute',
  },

  goBackButton: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  goBack: {
    marginTop: 0,
    ...textStyles.normalOfSize(12),
    textAlign: 'center',
    color: colors.lighterShade
  },
});