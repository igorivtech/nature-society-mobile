import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, SafeAreaView, ScrollView } from "react-native";
import { globalStyles } from "../../values/styles";
import { colors } from "../../values/colors";
import { TapView } from "../views/general";
import { Slider } from "../views/report/Slider";
import { strings } from "../../values/strings";


export const ReportScreen = ({navigation}) => {

  const tapClose = () => {
    navigation.goBack();
  }
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={styles.container}>
      <TapView onPress={tapClose} />
      <View style={styles.cardContainer}>
        <Animated.ScrollView 
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
            useNativeDriver: true
          })}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContent}
          style={StyleSheet.absoluteFill}>
          <Slider animation={require('../../assets/animations/rainbow.json')} titles={strings.reportScreen.cleanTitles} startUpAnimation={true} initialValue={0.5} />
          <Slider animation={require('../../assets/animations/rainbow.json')} titles={strings.reportScreen.cleanTitles} startUpAnimation={false} initialValue={0.5} />
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  scrollViewContent: {
    height: '200%'
  },

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