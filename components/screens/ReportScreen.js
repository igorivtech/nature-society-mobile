import React, { useEffect, useRef, useState, useContext } from "react";
import { View, StyleSheet, Animated, SafeAreaView } from "react-native";
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

const clean = {
  title: strings.reportScreen.cleanTitle,
  titles: strings.reportScreen.cleanTitles,
  animation: require("../../assets/animations/clean.json"),
  introAnimation: require("../../assets/animations/clean_intro.json"),
  outputRange: [0, 0.281, 0.514, 0.747, 1]
}

const crowd = {
  title: strings.reportScreen.crowdTitle,
  titles: strings.reportScreen.crowdTitles,
  animation: require('../../assets/animations/crowd.json'),
  introAnimation: require('../../assets/animations/crowd_intro.json'),
  outputRange: [0, 0.2173, 0.565, 0.77, 1]
}

export const ReportScreen = ({navigation, route}) => {

  let details = useRef([
    {id: "1_extra_light", title: "עודף תאורה", on: false},
    {id: "0_full_bins", title: "פחים מלאים", on: false},
    {id: "3_fires_marks", title: "סימני מדורות", on: false},
    {id: "2_open_bins", title: "פחים פתוחים", on: false},
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
  
  const {location} = route.params;
  const [selectedLocation, setLocation] = useState(location);
  const [searchVisible, setSearchVisible] = useState(false);

  const [errorData, setErrorData] = useState(strings.popups.empty);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const errorActionRef = useRef(emptyFunc);
  const [loaded, setLoaded] = useState(false);

  useEffect(()=>{
    setLocation(location);
    details.forEach(d=>d.on=false);
    iHelped.on = false;
    scrollY.addListener(({value})=>{});
    //
    setTimeout(() => {
      if (isMounted) {
        setAutoPlayFirst(true);
      }
    }, 1000);
    setTimeout(() => {
      setLoaded(true);
    }, NAV_DURATION+300);
  }, []);

  useEffect(()=>{
    if (!errorPopupVisible) {
      errorActionRef.current = emptyFunc;
    }
  }, [errorPopupVisible])

  const scrollViewHeight = useRef(0);
  const scrollView = useRef();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [image, setImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [loadingSendReport, setLoadingSendReport] = useState(false);

  const {sendReport} = useServer();

  const finishReport = async () => {
    try {
      setLoadingSendReport(true);
      let data = {
        cleanness: convertSliderValue(cleannessRef.current),
        crowdness: convertSliderValue(crowdnessRef.current),
        placeId: location._id,
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
    share(strings.reportScreen.sharePlace(location.title), "https://www.reddit.com");
  }

  const tapClose = () => {
    setPopupVisible(true);
  }

  const closeReport = () => {
    navigation.goBack();
  }

  const nextSegment = () => {
    if (scrollY?._value <= scrollViewHeight.current*2) {
      if (scrollView?.current) {
        scrollView?.current.scrollTo({
          animated: true,
          y: scrollY._value+scrollViewHeight.current
        })
        if (scrollY?._value == 0 && !autoPlaySecond) {
          setTimeout(() => {
            if (isMounted) {
              setAutoPlaySecond(true);
            }
          }, 500);
        }
      }
    }
  }

  const previousSegment = () => {
    if (scrollY?._value > 0) {
      if (scrollView?.current) {
        scrollView?.current.scrollTo({
          animated: true,
          y: scrollY._value-scrollViewHeight.current
        })
      }
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
        <Animatable.View animation='fadeIn' delay={400} style={StyleSheet.absoluteFill}>
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
            <Slider loaded={loaded} autoPlay={autoPlayFirst} valueRef={cleannessRef} item={clean} onPress={nextSegment} initialValue={0.5} showLocation={true} location={selectedLocation} startUpAnimation={true} setSearchVisible={setSearchVisible} notLoggedInError={notLoggedInError} token={token} />
            <Slider loaded={loaded} autoPlay={autoPlaySecond} valueRef={crowdnessRef} item={crowd} onPress={nextSegment} goBack={previousSegment} location={selectedLocation} initialValue={0.5} />
            <Report sharePressed={sharePressed} image={image} setImage={setImage} finishReport={finishReport} goBack={previousSegment} details={details} iHelped={iHelped} loadingSendReport={loadingSendReport} />
          </Animated.ScrollView>
        </Animatable.View>
      </View>
      <Popup textData={strings.popups.exitReport} action={closeReport} popupVisible={popupVisible} setPopupVisible={setPopupVisible} reverseActions={true} />
      <Popup textData={errorData} popupVisible={errorPopupVisible} setPopupVisible={setErrorPopupVisible} actionRef={errorActionRef} />
      <ModalSearch location={location != null ? location.position : null} selectItem={selectItem} visible={searchVisible} setSearchVisible={setSearchVisible} />
    </View>
  );
};

const styles = StyleSheet.create({

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