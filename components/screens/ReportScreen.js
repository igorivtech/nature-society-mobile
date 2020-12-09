import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, SafeAreaView, ScrollView } from "react-native";
import { globalStyles } from "../../values/styles";
import { colors } from "../../values/colors";
import { TapView } from "../views/general";
import { Slider } from "../views/report/Slider";
import { strings } from "../../values/strings";


const clean = {
  title: strings.reportScreen.cleanTitle,
  titles: strings.reportScreen.cleanTitles,
  animation: require('../../assets/animations/rainbow.json')
}

const crowd = {
  title: strings.reportScreen.crowdTitle,
  titles: strings.reportScreen.crowdTitles,
  animation: require('../../assets/animations/lock.json')
}

const location = {
  name: 'בית גוברין'
}

export const ReportScreen = ({navigation}) => {

  const scrollViewHeight = useRef(0);
  const scrollView = useRef();
  const scrollY = useRef(new Animated.Value(0)).current;

  const tapClose = () => {
    navigation.goBack();
  }

  const nextSegment = () => {
    if (scrollY._value <= scrollViewHeight.current*2) {
      scrollView.current.scrollTo({
        animated: true,
        y: scrollY._value+scrollViewHeight.current
      })
    } else {
      // finish
    }
  }

  const previousSegment = () => {
    if (scrollY._value > 0) {
      scrollView.current.scrollTo({
        animated: true,
        y: scrollY._value-scrollViewHeight.current
      })
    }
  }

  const onContainerLayout = (e) => {
    scrollViewHeight.current = e.nativeEvent.layout.height;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TapView onPress={tapClose} />
      <View onLayout={onContainerLayout} style={styles.cardContainer}>
        <Animated.ScrollView 
          ref={scrollView}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {useNativeDriver: false}
          )}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContent}
          style={StyleSheet.absoluteFill}>
          <Slider item={clean} onPress={nextSegment} initialValue={0.5} location={location} startUpAnimation={true} />
          <Slider item={crowd} onPress={nextSegment} goBack={previousSegment} initialValue={0.5} />
          <View style={{
            height: '33.3333333333333%',
            width: '100%'
          }} />
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  scrollViewContent: {
    height: '300%'
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