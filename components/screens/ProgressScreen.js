import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Alert,
  ScrollView,
} from "react-native";
import { UserContext } from "../../context/context";
import { ASK_PUSH, SAVE_NOTIFICATION, SAVE_TOKEN, SAVE_USER } from "../../context/userReducer";
import { colors } from "../../values/colors";
import { DEFAULT_NOTIFICATION, height, NAV_DURATION, statusBarHeight } from "../../values/consts";
import { strings } from "../../values/strings";
import { globalStyles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";
import { EXIT_SIZE } from "../screens/ExploreScreen";
import { PathSegment } from "../views/progress/PathSegment";
import { UserHeader } from "../views/progress/views";
import { calcCustomAchievements } from "../../hooks/helpers"
import { useIsFocused } from "@react-navigation/native";
import useIsMounted from "ismounted";
import { Popup } from "../views/Popup";
import { shouldAskUser } from "../../hooks/useNotifications";
import { Auth } from "aws-amplify";
import AsyncStorage from "@react-native-community/async-storage";
import { Directions, FlingGestureHandler, State } from "react-native-gesture-handler";
import Constants from "expo-constants";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from "react-native-animatable";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const ProgressScreen = ({ navigation, route }) => {

  const {state, dispatch} = useContext(UserContext);
  const {user, notification, settings, offlineUser} = state;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [data, setData] = useState([]);
  const scrollView = useRef();

  const isMounted = useIsMounted();

  const translateY = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const alreadyAnimatedPath = useRef(false);
  const pathOpacity = useRef(new Animated.Value(0)).current;

  const {bottom, top} = useSafeAreaInsets();
  const pathHeight = height-(bottom+top) - (30+15);

  useEffect(()=> {
    // DEBUG
    // setTimeout(() => {
    //   dispatch({
    //     type: SAVE_NOTIFICATION,
    //     payload: DEFAULT_NOTIFICATION
    //   })
    // }, 4000);
    //
    const startTime = new Date();
    const points = user !== null ? user.numOfReports : offlineUser.numOfReports
    calcCustomAchievements(settings.achievements, points).then(output=>{
      output.forEach((elem, i) => {
        if (elem.current) {
          setCurrentIndex(i);
        }
      });
      const passedTime = (new Date()) - startTime;
      const delay = Math.max(0, NAV_DURATION+1 - passedTime);
      setTimeout(() => {
        if (!isMounted.current) {return}
        setData(output);
      }, delay);
    });
  }, [])

  useEffect(()=>{
    setPopupVisible(notification != null);
  }, [notification])

  const restartApp = useCallback(() => {
    Alert.alert(
      "לאפס את האפליקציה?",
      "האפליקציה תיסגר בעצמה ותצטרכו לפתוח אותה שוב.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          Auth.signOut().then(()=>{
          }).catch((error)=>{
          }).finally(()=>{
            dispatch({
              type: SAVE_USER,
              payload: user
            });
            dispatch({
              type: SAVE_TOKEN,
              payload: null
            });
            AsyncStorage.clear().then(()=>{
              (async()=>{
                Alert.alert(
                  "כעט סגרו את האפליקציה",
                  { cancelable: false }
                );
              })()
            })
          });
        } }
      ],
      { cancelable: false }
    );
  }, [])

  useEffect(()=>{
    if (data.length > 0) {
      const currentIndex = data.findIndex(achievement=>achievement.current);
      Animated.timing(pathOpacity, {
        toValue: 1,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(()=>{
        if (!isMounted?.current) {return}
        if (currentIndex > 0) {
          translateY.addListener(({value})=>{
            scrollY.setValue(-value);
          })
          Animated.timing(translateY, {
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
            duration: 250*(currentIndex+1),
            toValue: -pathHeight*currentIndex
          }).start(()=>{
            if (!isMounted?.current) {return}
            translateY.setValue(0);
            scrollView.current.scrollTo({x: 0, y: pathHeight*currentIndex, animated: false})
            scrollY.setValue(pathHeight*currentIndex);
            translateY.removeAllListeners();
            setScrollEnabled(true);
          })
        } else {
          setScrollEnabled(true);
        }
      });
    }
  }, [data])

  const goBack = () => {
    navigation.goBack();
  };

  const loginLogout = () => {
    navigation.navigate("Home", {loginLogout: true})
  };

  // useEffect(() => {
  //   const params = route.params;
  //   if (params != null) {
  //     if (params.showSignup === true) {
  //       navigation.setParams({showSignup: null});
  //       setTimeout(() => {
  //         if (isFocused) {
  //           loginLogout();
  //         }
  //       }, 400);
  //     }
  //   }
  // }, [route]);

  const handleSwipeLeft = (event) => {
    if (event.nativeEvent.state === State.END) {
      goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={goBack} style={styles.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <FlingGestureHandler
        direction={Directions.LEFT}
        onHandlerStateChange={handleSwipeLeft}
      >

        <View style={styles.progressScreenContainer}>

          <AnimatedScrollView
            scrollEnabled={scrollEnabled}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: true}    
            )}
            ref={scrollView}
            style={styles.scrollView(pathOpacity, pathHeight)}
            contentContainerStyle={styles.contentContainerStyle(pathHeight*(settings.achievements.length/2))}
          >
            <Animated.View style={styles.pathContainer(translateY, pathHeight*(settings.achievements.length/2))}>
              {data.map((item, index) => <PathSegment pathHeight={pathHeight} key={index.toString()} currentIndex={currentIndex} popupVisible={popupVisible} index={index} scrollY={scrollY} item={item} />)}  
            </Animated.View>
          </AnimatedScrollView>


          <TouchableOpacity style={styles.bottomButtonContainer} onPress={loginLogout}>
            {user ? (
              <Image source={require("../../assets/images/settings_icon.png")} />
            ) : (
              <Animatable.Text
                useNativeDriver={true}
                direction='alternate' 
                iterationDelay={300}
                animation='pulse' 
                iterationCount='infinite' 
                easing='ease-in-out'
                style={styles.bottomText}>
                {strings.progressScreen.signup}
              </Animatable.Text>
            )}
          </TouchableOpacity>

          <UserHeader restartApp={restartApp} />
          <ProgressPopup />

        </View>

      </FlingGestureHandler>

      <SafeAreaView style={styles.bottomSafeAreaStyle} />
    </View>
  );
};

const imageType = {
  'tip': require("../../assets/images/tip_notification_icon.png"),
  'animal_y': require("../../assets/images/yahmur_icon.png"),
  'user': require("../../assets/images/notification_icon_outline.png")
}

const userHeaderName = (fullName) => {
  const parts = fullName.split(' ');
  if (parts.length === 1) {
    return parts[0];
  } else {
    const firstChar = parts[parts.length - 1].substring(0, 1).trim();
    if (firstChar.length === 0) {
      return `${parts[0]}.`
    } else {
      return `${parts[0]} ${firstChar}.`
    }
  }
}

const ProgressPopup = () => {

  const {state, dispatch} = useContext(UserContext);
  const {user, notification} = state;

  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const show = notification != null;
    Animated.timing(scale, {
      useNativeDriver: true,
      toValue: show ? 1 : 0,
      duration: show ? 600 : 400,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [notification])

  const notificationPressed = () => {
    const notificationPoints = notification.points;
    dispatch(({
      type: SAVE_USER,
      payload: {
        ...user,
        points: user.points + notificationPoints
      }
    }))
    //
    dispatch(({
      type: SAVE_NOTIFICATION,
      payload: null
    }))
  }

  return (
    <Animated.View style={pStyles.container(scale)}>

      {notification && (
        <NotificationHeader notification={notification} />
      )}

      {notification && (
        <Text style={textStyles.normalOfSize(16)}>{notification.description}</Text>
      )}

      {notification && (
        <TouchableOpacity onPress={notificationPressed} style={pStyles.button}>
          <View style={pStyles.buttonInnerContainer}>
            <Text style={pStyles.buttonPoints}>{`+${notification.points}`}</Text>
            <Image source={require("../../assets/images/thank_you_icon.png")} />
          </View>
          <Text style={pStyles.buttonTitle}>{strings.progressScreen.thankYou}</Text>
        </TouchableOpacity>
      )}
      
    </Animated.View>
  )
}

const NotificationHeader = ({notification}) => {
  return (
    <View style={pStyles.titleContainer}>
      <View>
        {notification.type == 'user' ? (
          <View style={pStyles.uContainer}>
            <Text style={pStyles.title}>{userHeaderName(notification.user.name)}</Text>
            <View style={pStyles.userContainer}>
              <Text style={pStyles.userPoints}>{notification.user.points}</Text>
              <Image source={require("../../assets/images/user_notification_marker.png")} />
              <Text style={pStyles.userRole}>{notification.user.role}</Text>
            </View>
          </View>
        ) : (
          <Text style={pStyles.title}>{notification.title}</Text>
        )}
      </View>
      {notification.type == 'user' ? (
        <View>
          <Image source={imageType[notification.type]} />
          <Image style={pStyles.userPic} source={{uri: notification.user.pic}} />
        </View>
      ) : (
        <Image source={imageType[notification.type]} />
      )}
    </View>
  )
}

const pStyles = StyleSheet.create({

  uContainer: {
    alignItems: 'flex-end'
  },

  userContainer: {
    marginTop: 2,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  userPoints: {
    ...textStyles.normalOfSize(12),
    color: '#222',
    marginRight: 2,
  },

  userRole: {
    marginLeft: 8,
    ...textStyles.normalOfSize(12)
  },

  userPic: {
    height: 33,
    width: 33,
    borderRadius: 33/2,
    top: 2,
    left: 2,
    backgroundColor: 'white',
    position: 'absolute'
  },

  buttonInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  buttonPoints: {
    ...textStyles.normalOfSize(24),
    textAlign: 'center',
    color: colors.treeBlues,
    marginRight: 2
  },

  buttonTitle: {
    marginLeft: 8,
    ...textStyles.normalOfSize(16),
    textAlign: 'center',
  },

  title: {
    marginRight: 10,
    ...textStyles.boldOfSize(16)
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  button: {
    borderColor: colors.treeBlues,
    borderWidth: 1,
    borderRadius: 5,
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  container: (scale) => ({
    transform: [
      {scale}
    ],
    opacity: scale,
    width: 180,
    height: 160,
    backgroundColor: 'white',
    position: 'absolute',
    right: 30,
    bottom: height * 0.25,
    ...globalStyles.shadow,
    borderColor: colors.treeBlues,
    borderWidth: 1,
    borderRadius: 14,
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'stretch'
  })
});


const styles = StyleSheet.create({

  contentContainerStyle: (height) => {
    height
  },

  pathContainer: (translateY, height) => ({
    transform: [{translateY}],
    height
  }),

  scrollView: (opacity, height) => ({
    // overflow: 'visible',
    opacity,
    height,
    width: "100%",
  }),
  
  bottomButtonContainer: {
    bottom: 16,
    right: 32,
    position: "absolute",
    // borderBottomWidth: 1,
    // borderBottomColor: colors.treeBlues
  },

  bottomText: {
    ...textStyles.normalOfSize(18),
    textAlign: "center",
    color: colors.treeBlues,
    textDecorationLine: "underline",
  },

  bottomSafeAreaStyle: {
    backgroundColor: "white",
    marginRight: EXIT_SIZE,
  },

  progressScreenContainer: {
    // overflow: 'hidden',
    paddingVertical: 30,
    paddingBottom: 15,
    borderTopRightRadius: 30,
    flex: 1,
    backgroundColor: "white",
    marginRight: EXIT_SIZE,
    marginTop: statusBarHeight,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.clear,
  },
  tap: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: EXIT_SIZE,
  },
});
