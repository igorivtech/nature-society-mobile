import React, { useRef } from "react";
import { View, StyleSheet, Animated, SafeAreaView } from "react-native";
import { globalStyles } from "../../values/styles";
import LottieView from 'lottie-react-native';
import { colors } from "../../values/colors";
import { TapView } from "../views/general";
import { Slider } from "../views/report/Slider";
import { strings } from "../../values/strings";

export const ReportScreen = ({navigation}) => {

  const progress = useRef(new Animated.Value(0)).current;

  const tapClose = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <TapView onPress={tapClose} />
      <View style={styles.cardContainer}>
        <LottieView source={require('../../assets/animations/rainbow.json')} progress={progress} resizeMode='contain' />
        <Slider titles={strings.reportScreen.cleanTitles} startUpAnimation={true} initialValue={0.5} animationProgress={progress} />
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