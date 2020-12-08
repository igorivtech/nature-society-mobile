import React from "react";
import { View, StyleSheet, Animated, SafeAreaView } from "react-native";
import { globalStyles } from "../../values/styles";
import { colors } from "../../values/colors";
import { TapView } from "../views/general";
import { Slider } from "../views/report/Slider";
import { strings } from "../../values/strings";


export const ReportScreen = ({navigation}) => {

  const tapClose = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <TapView onPress={tapClose} />
      <View style={styles.cardContainer}>
        <Slider animation={require('../../assets/animations/rainbow.json')} titles={strings.reportScreen.cleanTitles} startUpAnimation={true} initialValue={0.5} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    backgroundColor: colors.grass,
  },
  dummyText: {
    transform: [{translateY: -100}],
    color: colors.darkWithTone,
  },
  cardContainer: {
    ...globalStyles.shadow,
    borderRadius: 22.5,
    marginHorizontal: 30,
    marginVertical: 45,
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  }
})