import React, { useEffect, useRef, useState, useContext } from "react";
import { View, StyleSheet, Animated, SafeAreaView, Easing } from "react-native";
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
import { Auth } from "aws-amplify";
import { cognitoToUser, ATTRIBUTE_POINTS, ATTRIBUTE_NUM_OF_REPORTS } from "../../hooks/useUser";
import { uploadImageAsync, useUploadImage } from "../../hooks/aws";
import { useServer } from "../../hooks/useServer";
import { convertSliderValue } from "../../hooks/helpers";
import { emptyFunc, errors, NAV_DURATION, safeAreaHeight } from "../../values/consts";
import useIsMounted from "ismounted";
import { useShare } from "../../hooks/useShare";
import { useImage } from "../../hooks/useImage";

const clean = {
  title: strings.reportScreen.cleanTitle,
  titles: strings.reportScreen.cleanTitles,
  animation: require("../../assets/animations/clean.json"),
  introAnimation: require("../../assets/animations/clean_intro.json"),
  outputRange: [0, 0.27184466019, 0.50485436893, 0.73786407767, 1],
  resizeMode: 'contain',
  thumb: require("../../assets/images/slider_thumb_clean.png"),
  thumbSize: {
    height: 23,
    width: 21
  }
}

const crowd = {
  title: strings.reportScreen.crowdTitle,
  titles: strings.reportScreen.crowdTitles,
  animation: require('../../assets/animations/crowd.json'),
  bg: require("../../assets/images/crowd_bg.png"),
  introAnimation: require('../../assets/animations/crowd_intro.json'),
  outputRange: [0, 0.21621621621, 0.56756756756, 0.78378378378, 1],
  resizeMode: 'cover',
  thumb: require("../../assets/images/slider_thumb_crowd.png"),
  thumbSize: {
    height: 20,
    width: 31
  }
}

export const ReportScreen = ({navigation, route}) => {

  let details = useRef([
    {id: "1_extra_light", title: "חסרות שקיות\nבפחים", on: false},
    {id: "0_full_bins", title: "פחים מלאים", on: false},
    {id: "3_fires_marks", title: "סימני מדורות", on: false},
    {id: "2_open_bins", title: "חסרים פחים", on: false},
    {id: "4_broken_bins", title: "פחים שבורים", on: false},
  ]).current;
  
  let iHelped = useRef({
    id: "i_helped",
    title: "ניקיתי את המקום ועזרתי\nלשמור על הטבע",
    on: false
  }).current;

  const cleannessRef = useRef(0.5);
  const crowdnessRef = useRef(0.5);

  const [autoPlayFirst, setAutoPlayFirst] = useState(false);
  const [autoPlaySecond, setAutoPlaySecond] = useState(false);

  const {state, dispatch} = useContext(UserContext);
  const {user, token, settings} = state;

  const {share} = useShare();

  const isMounted = useIsMounted();
  
  const {location, currentPosition} = route.params;
  const [selectedLocation, setLocation] = useState(location);
  const [searchVisible, setSearchVisible] = useState(false);

  const [errorData, setErrorData] = useState(strings.popups.empty);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const errorActionRef = useRef(emptyFunc);
  const [loaded, setLoaded] = useState(false);

  const {sendReport, getPlaces} = useServer();  

  useEffect(()=>{
    details.forEach(d=>d.on=false);
    iHelped.on = false;
    translateY.addListener(({value})=>{})
    //
    setTimeout(() => {
      if (isMounted.current) {
        setAutoPlayFirst(true);
      }
    }, 1000);
    setTimeout(() => {
      setLoaded(true);
    }, NAV_DURATION+300);
    //
    setLocation(location);
    // fetching current location:?!!!
    if (currentPosition != null) {
      navigation.setParams({
        currentPosition: null
      });
      getPlaces('1', currentPosition, currentPosition, 3, 4).then(data=>{
        if (!isMounted?.current) {return}
        if (data != null && data.pp.length > 0) {
          setLocation(data.pp[0]);
        } else {
          showNoPlaceUI();
        }
      })
    }
    if (location == null && currentPosition == null) {
      showNoPlaceUI();
    }
  }, []);

  const showNoPlaceUI = () => {
    // setSearchVisible(true);
  }

  useEffect(()=>{
    if (!errorPopupVisible) {
      errorActionRef.current = emptyFunc;
    }
  }, [errorPopupVisible])

  const scrollViewHeight = useRef(0);
  const translateY = useRef(new Animated.Value(0)).current;

  const useImageData = useImage();
  const {image} = useImageData;
  const [popupVisible, setPopupVisible] = useState(false);
  const [loadingSendReport, setLoadingSendReport] = useState(false);

  const finishReport = async () => {
    try {
      setLoadingSendReport(true);
      let data = {
        cleanness: convertSliderValue(cleannessRef.current),
        crowdness: convertSliderValue(crowdnessRef.current),
        placeId: selectedLocation._id,
        checkboxes: {
          'i_helped': iHelped.on,
          '1_extra_light': details[0].on,
          '0_full_bins': details[1].on,
          '3_fires_marks': details[2].on,
          '2_open_bins': details[3].on,
          '4_broken_bins': details[4].on,
        }
      }
      const response = await sendReport(token, data);
      if (response.content && response.content.id != null) {
        let attributes = {}
        attributes[ATTRIBUTE_POINTS] = `${user.points + settings.reportPoints}`;
        attributes[ATTRIBUTE_NUM_OF_REPORTS] = `${user.numOfReports + 1}`;
        let cognitoUser = await Auth.currentAuthenticatedUser({
          bypassCache: true,
        });
        let result = await Auth.updateUserAttributes(cognitoUser, attributes);
        if (result === 'SUCCESS') {
          let updatedCognitoUser = await Auth.currentAuthenticatedUser({
            bypassCache: true,
          });
          dispatch({
            type: SAVE_USER,
            payload: cognitoToUser(updatedCognitoUser)
          })
          navigation.navigate("Home");
          uploadImageAsync(token, response.content.id, image);
        } else {
          console.error("cant update user");
        }
      } else if (response.error) {
        handleError(response.error);
        setLoadingSendReport(false); 
      } else {
        handleError(errors.reportNotLoggedIn);
        setLoadingSendReport(false); 
      }
    } catch (error) {
      handleError(error);
      setLoadingSendReport(false);
    }
  }

  const sharePressed = () => {
    share(strings.reportScreen.sharePlace(location.title), location._id);
  }

  const tapClose = () => {
    setPopupVisible(true);
  }

  const closeReport = () => {
    navigation.goBack();
  }

  const nextSegment = () => {
    if (translateY._value >= -scrollViewHeight.current*2) {
      Animated.timing(translateY, {
        toValue: translateY._value - scrollViewHeight.current,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
        duration: 500
      }).start(()=>{
        if (translateY._value === -scrollViewHeight.current && !autoPlaySecond) {
          if (isMounted.current) {
            setAutoPlaySecond(true);
          }   
        }
      });
    }
  }

  const previousSegment = () => {
    if (translateY._value < 0) {
      Animated.timing(translateY, {
        toValue: translateY._value + scrollViewHeight.current,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
        duration: 400
      }).start();
    }
  }

  const onContainerLayout = (e) => {
    scrollViewHeight.current = e.nativeEvent.layout.height;
  }

  const selectItem = (v) => {
    setLocation(v);
    setSearchVisible(false);
  }

  const handleError = (error) => {
    if (error) {
      setErrorData(strings.popups.loginError(error.code));
      setErrorPopupVisible(true);
    }
    console.error(error);
  }

  const notLoggedInError = () => {
    errorActionRef.current = signupNow;
    setErrorData(strings.popups.signupNow);
    setErrorPopupVisible(true);
  }

  const signupNow = () => {
    navigation.navigate("Home", {loginLogout: true})
  }

  return (
    <View style={styles.container}>
      <TapView onPress={tapClose} />
      <View onLayout={onContainerLayout} style={styles.cardContainer}>
        <Animatable.View animation='fadeIn' delay={400} style={styles.innerScrollViewContent}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.scrollViewContent, {transform: [{translateY}]}]}>
            <Slider loaded={loaded} autoPlay={autoPlayFirst} valueRef={cleannessRef} item={clean} onPress={nextSegment} initialValue={0.5} showLocation={true} location={selectedLocation} startUpAnimation={true} setSearchVisible={setSearchVisible} notLoggedInError={notLoggedInError} token={token} />
            <Slider loaded={loaded} autoPlay={autoPlaySecond} valueRef={crowdnessRef} item={crowd} onPress={nextSegment} goBack={previousSegment} location={selectedLocation} initialValue={0.5} />
            <Report sharePressed={sharePressed} useImageData={useImageData} finishReport={finishReport} goBack={previousSegment} details={details} iHelped={iHelped} loadingSendReport={loadingSendReport} />
          </Animated.View>
        </Animatable.View>
      </View>
      <Popup textData={strings.popups.exitReport} action={closeReport} popupVisible={popupVisible} setPopupVisible={setPopupVisible} reverseActions={true} />
      <Popup textData={errorData} popupVisible={errorPopupVisible} setPopupVisible={setErrorPopupVisible} actionRef={errorActionRef} />
      <ModalSearch location={location != null ? location.position : null} selectItem={selectItem} visible={searchVisible} setSearchVisible={setSearchVisible} />
    </View>
  );
};

const styles = StyleSheet.create({

  innerScrollViewContent: {
    ...StyleSheet.absoluteFill, 
    borderRadius: 22.5, 
    overflow: 'hidden'
  },

  scrollViewContent: {
    height: '300%'
  },

  container: {
    ...globalStyles.container,
    backgroundColor: colors.clear,
  },
  dummyText: {
    transform: [{translateY: -100}],
    color: colors.darkWithTone,
  },
  cardContainer: {
    ...globalStyles.shadow,
    borderRadius: 22.5,
    marginHorizontal: 30,
    marginBottom: 45,
    marginTop: 35 + safeAreaHeight,
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  }
})