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
import { SAVE_OFFLINE_USER, SAVE_USER } from "../../context/userReducer";
import * as Animatable from "react-native-animatable";
import { Auth } from "aws-amplify";
import { cognitoToUser, ATTRIBUTE_POINTS, ATTRIBUTE_NUM_OF_REPORTS, OFFLINE_USER_KEY } from "../../hooks/useUser";
import { uploadImageAsync, useUploadImage } from "../../hooks/aws";
import { useServer } from "../../hooks/useServer";
import { convertSliderValue, specialSortPlaces } from "../../hooks/helpers";
import { emptyFunc, errors, NAV_DURATION, safeAreaHeight } from "../../values/consts";
import useIsMounted from "ismounted";
import { useShare } from "../../hooks/useShare";
import { useImage } from "../../hooks/useImage";
import { useAndroidOnBack } from "../../hooks/useAndroidOnBack";
import AsyncStorage from "@react-native-community/async-storage";

const clean = {
  key: 'clean',
  title: strings.reportScreen.cleanTitle,
  titles: strings.reportScreen.cleanTitles,
  animation: require("../../assets/animations/clean.json"),
  introAnimation: require("../../assets/animations/clean_intro.json"),
  outputRange: [0, 0.27184466019, 0.50485436893, 0.73786407767, 1],
  resizeMode: 'contain',
  thumb: require("../../assets/images/slider_thumb_clean.png"),
  thumbBg: require("../../assets/images/slider_thumb_clean_bg.png"),
  thumbSize: {
    height: 23,
    width: 21
  }
}

const crowd = {
  key: 'crowd',
  title: strings.reportScreen.crowdTitle,
  titles: strings.reportScreen.crowdTitles,
  animation: require('../../assets/animations/crowd.json'),
  bg: require("../../assets/images/crowd_bg.png"),
  introAnimation: require('../../assets/animations/crowd_intro.json'),
  outputRange: [0, 0.21621621621, 0.56756756756, 0.78378378378, 1],
  resizeMode: 'cover',
  thumb: require("../../assets/images/slider_thumb_crowd.png"),
  thumbBg: require("../../assets/images/slider_thumb_crowd_bg.png"),
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
  const {user, token, settings, offlineUser} = state;

  const {share} = useShare();

  const isMounted = useIsMounted();
  
  const [fetchingPlace, setFetchingPlace] = useState(false);
  const {location, currentPosition} = route.params;
  const [selectedLocation, setLocation] = useState(location);
  const [searchVisible, setSearchVisible] = useState(false);

  const [errorData, setErrorData] = useState(strings.popups.empty);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const errorActionRef = useRef(emptyFunc);
  const [loaded, setLoaded] = useState(false);

  useAndroidOnBack(()=>{
    if (popupVisible) {
      closeReport();
    } else {
      setPopupVisible(true);
    }
  });

  const {sendReport, getPlaces} = useServer();

  useEffect(()=>{
    details.forEach(d=>d.on=false);
    iHelped.on = false;
    translateY.addListener(({value})=>{})
    // fetching current location:?!!!
    if (location != null) { // got site location from card
      animated.current = true;
      setTimeout(() => {
        if (isMounted.current) {
          setAutoPlayFirst(true);
        }
      }, 1000);
      setTimeout(() => {
        setLoaded(true);
      }, NAV_DURATION+300);
    } else if (currentPosition != null) { // got physical location
      setFetchingPlace(true);
      const startTime = new Date();
      getPlaces('1', currentPosition, currentPosition, 15, 4, true).then(data=>{ // 1.5 km. 15 is just DEBUG
        if (!isMounted?.current) {return}
        if (data != null && data.pp.length > 0) {
          const passedTime = (new Date()) - startTime;
          const delay = Math.max(0, NAV_DURATION+300 - passedTime);
          const sorted = specialSortPlaces([...data.pp], currentPosition);
          setTimeout(() => {
            if (!isMounted.current) {return}
            setFetchingPlace(false);
            setLocation(sorted[0]);
          }, delay);
        } else {
          setFetchingPlace(false);
          showNoPlaceUI();
        }
      })
      navigation.setParams({
        currentPosition: null
      });
    } else { // got nothing
      showNoPlaceUI();
    }
    //
    setLocation(location);
  }, []);

  const animated = useRef(false);

  useEffect(()=>{
    if (!animated.current && selectedLocation != null) {
      animated.current = true;
      setAutoPlayFirst(true);
      setLoaded(true);
    }
  }, [selectedLocation])

  const showNoPlaceUI = () => {
    setSearchVisible(true);
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
        if (user != null && token != null) {
          let attributes = {}
          attributes[ATTRIBUTE_POINTS] = `${user.points + settings.reportPoints}`;
          attributes[ATTRIBUTE_NUM_OF_REPORTS] = `${user.numOfReports + 1}`;
          let cognitoUser = await Auth.currentAuthenticatedUser({
            // bypassCache: true,
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
            if (!isMounted.current) {return}
            setLoadingSendReport(false); 
            console.error("cant update user");
          }
        } else {
          const user = {
            points: offlineUser.points + settings.reportPoints,
            numOfReports: offlineUser.numOfReports + 1
          };
          await AsyncStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(user))
          dispatch({
            type: SAVE_OFFLINE_USER,
            payload: user
          })
          navigation.navigate("Home");
          uploadImageAsync(token, response.content.id, image);
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
    share(strings.reportScreen.sharePlace(selectedLocation.title), selectedLocation._id);
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

  const signupNow = () => {
    navigation.navigate("Home", {loginLogout: true})
  }

  return (
    <View style={styles.container}>
      <TapView onPress={tapClose} />
      <View onLayout={onContainerLayout} style={styles.cardContainer}>
        <Animatable.View animation='fadeIn' delay={400} style={styles.innerScrollViewContent}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.scrollViewContent, {transform: [{translateY}]}]}>
            <Slider fetchingPlace={fetchingPlace} loaded={loaded} autoPlay={autoPlayFirst} valueRef={cleannessRef} item={clean} onPress={nextSegment} initialValue={0.5} showLocation={true} location={selectedLocation} startUpAnimation={true} setSearchVisible={setSearchVisible} />
            <Slider loaded={loaded} autoPlay={autoPlaySecond} valueRef={crowdnessRef} item={crowd} onPress={nextSegment} goBack={previousSegment} location={selectedLocation} initialValue={0.5} />
            <Report sharePressed={sharePressed} useImageData={useImageData} finishReport={finishReport} goBack={previousSegment} details={details} iHelped={iHelped} loadingSendReport={loadingSendReport} />
          </Animated.View>
        </Animatable.View>
      </View>
      <Popup textData={strings.popups.exitReport} action={closeReport} popupVisible={popupVisible} setPopupVisible={setPopupVisible} reverseActions={true} />
      <Popup textData={errorData} popupVisible={errorPopupVisible} setPopupVisible={setErrorPopupVisible} actionRef={errorActionRef} />
      <ModalSearch location={currentPosition} selectItem={selectItem} visible={searchVisible} setSearchVisible={setSearchVisible} />
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