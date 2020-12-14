import React, { useEffect, useRef, useState, useContext } from "react";
import { View, StyleSheet, Animated, SafeAreaView, Modal } from "react-native";
import { globalStyles } from "../../values/styles";
import { colors } from "../../values/colors";
import { TapView } from "../views/general";
import { Slider } from "../views/report/Slider";
import { strings } from "../../values/strings";
import { Report } from "../views/report/Report";
import { Popup } from "../views/Popup";
import { ModalSearch } from "../views/report/ModalSearch"
import { UserContext } from "../../context/context";
import { SAVE_USER } from "../../context/userReducer";
import * as Animatable from "react-native-animatable";

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

export const ReportScreen = ({navigation, route}) => {

  const {state, dispatch} = useContext(UserContext);
  const {user} = state;

  const {location} = route.params;
  const [selectedLocation, setLocation] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(()=>{
    setLocation(location);
  }, []);

  let details = [
    {id: "1_extra_light", title: "עודף תאורה", on: false},
    {id: "0_full_bins", title: "פחים מלאים", on: false},
    {id: "3_fires_marks", title: "סימני מדורות", on: false},
    {id: "2_open_bins", title: "פחים פתוחים", on: false},
    {id: "4_broken_bins", title: "פחים שבורים", on: false},
  ]
  
  let iHelped = {
    id: "i_helped",
    title: "ניקיתי את המקום ועזרתי\nלשמור על הטבע",
    on: false
  }

  useEffect(()=>{
    details.forEach(d=>d.on=false);
    iHelped.on = false;
  }, [])

  const scrollViewHeight = useRef(0);
  const scrollView = useRef();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [image, setImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const finishReport = () => {
    dispatch({
      type: SAVE_USER,
      payload: {
        ...user,
        points: user.points + 30,
        numOfReports: user.numOfReports + 1
      }
    })
    navigation.goBack();
  }

  const tapClose = () => {
    setPopupVisible(true);
  }

  const closeReport = () => {
    navigation.goBack();
  }

  useEffect(()=>{
    scrollY.addListener(({value})=>{});
  }, [])

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


  const selectItem = (v) => {
    setLocation(v);
    setSearchVisible(false);
  }


  return (
    <SafeAreaView style={styles.container}>
      <TapView onPress={tapClose} />
      <View onLayout={onContainerLayout} style={styles.cardContainer}>
        <Animatable.View animation='fadeIn' delay={200} style={StyleSheet.absoluteFill}>
          <Animated.ScrollView 
            ref={scrollView}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: true}
            )}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollViewContent}
            style={StyleSheet.absoluteFill}>
            <Slider item={clean} onPress={nextSegment} initialValue={0.5} location={selectedLocation} startUpAnimation={true} setSearchVisible={setSearchVisible} />
            <Slider item={crowd} onPress={nextSegment} goBack={previousSegment} initialValue={0.5} />
            <Report image={image} setImage={setImage} finishReport={finishReport} goBack={previousSegment} details={details} iHelped={iHelped} />
          </Animated.ScrollView>
        </Animatable.View>
      </View>
      <Popup textData={strings.popups.exitReport} action={closeReport} popupVisible={popupVisible} setPopupVisible={setPopupVisible} reverseActions={true} />
      <ModalSearch selectItem={selectItem} visible={searchVisible} setSearchVisible={setSearchVisible} />
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