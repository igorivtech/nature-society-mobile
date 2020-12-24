import React, { useContext, useEffect, useRef, useState } from "react";
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
} from "react-native";
import { UserContext } from "../../context/context";
import { ASK_PUSH, SAVE_NOTIFICATION, SAVE_USER } from "../../context/userReducer";
import { colors } from "../../values/colors";
import { DEFAULT_NOTIFICATION, height, statusBarHeight } from "../../values/consts";
import { strings } from "../../values/strings";
import { globalStyles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";
import { EXIT_SIZE } from "../screens/ExploreScreen";
import { PathSegment, pathHeight } from "../views/progress/PathSegment";
import { UserHeader } from "../views/progress/views";
import { calcCustomAchievements } from "../../hooks/helpers"
import { useIsFocused } from "@react-navigation/native";
import useIsMounted from "ismounted";
import { Popup } from "../views/Popup";
import { shouldAskUser } from "../../hooks/useNotifications";

export const ProgressScreen = ({ navigation, route }) => {

  const {state, dispatch} = useContext(UserContext);
  const {user, notification, settings} = state;
  const [currentIndex, setCurrentIndex] = useState(0);

  const isFocused = useIsFocused();

  const [popupVisible, setPopupVisible] = useState(false);
  const [pushPopupVisible, setPushPopupVisible] = useState(false);
  const initialState = useRef(calcCustomAchievements(settings.achievements, user !== null ? user.points : 0).reverse()).current;
  const [data, setData] = useState(initialState); // []
  const scrollView = useRef();

  const scrollY = useRef(new Animated.Value(0)).current;
  const alreadyAnimatedPath = useRef(false);

  let timeout = null;

  useEffect(()=> {
    // DEBUG
    // setTimeout(() => {
    //   dispatch({
    //     type: SAVE_NOTIFICATION,
    //     payload: DEFAULT_NOTIFICATION
    //   })
    // }, 4000);
    if (isFocused) {
      shouldAskUser().then(should => {
        if (should && isFocused) {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            if (isFocused) {
              setPushPopupVisible(true);
            }    
          }, 5000);
        }
      })
    }
  }, [isFocused])

  useEffect(()=>{
    setPopupVisible(notification != null);
  }, [notification])

  useEffect(()=>{
    let output = calcCustomAchievements(settings.achievements, user !== null ? user.points : 0);
    output.reverse();
    output.forEach((elem, i) => {
      if (elem.current) {
        setCurrentIndex(i);
      }
    });
    setData(output);
  }, [settings, user])

  useEffect(()=>{
    if (data.length > 0) {
      const currentIndex = data.findIndex(achievement=>achievement.current);
      if (alreadyAnimatedPath.current) {
        setTimeout(() => {
          if (scrollView?.current) {
            scrollView?.current.scrollToOffset({
              offset: pathHeight * currentIndex,
              animated: true,
            })  
          }
        }, 700);
      } else {
        alreadyAnimatedPath.current = true;
        setTimeout(()=>{
          if (scrollView?.current) {
            scrollView?.current.scrollToOffset({
              offset: pathHeight * currentIndex + 400,
              animated: false,
            });  
          }
          setTimeout(() => {
            if (scrollView?.current) {
              scrollView?.current.scrollToOffset({
                offset: pathHeight * currentIndex,
                animated: true,
              })
            }
          }, 700);
        }, 0)
      }
    }
  }, [data])

  const goBack = () => {
    navigation.goBack();
  };

  const loginLogout = () => {
    if (user === null) {
      navigation.navigate("Login");
    } else {
      navigation.navigate("Profile");
    }
  };

  useEffect(() => {
    const params = route.params;
    if (params != null) {
      if (params.signupNow === true) {
        setTimeout(() => {
          if (isFocused) {
            loginLogout();
          }
        }, 400);
        params.signupNow = null;
      }
    }
  }, [route]);

  const askPush = () => {
    dispatch({
      type: ASK_PUSH,
      payload: true
    })
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={goBack} style={styles.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <View style={styles.progressScreenContainer}>
        <Animated.FlatList
          extraData={currentIndex}
          data={data}
          bounces={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            { useNativeDriver: true }    
          )}
          ref={scrollView}
          style={styles.scrollView}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index})=><PathSegment currentIndex={currentIndex} popupVisible={popupVisible} index={index} scrollY={scrollY} item={item} />}
         />
        
        <TouchableOpacity style={styles.bottomButtonContainer} onPress={loginLogout}>
          {user ? (
            <Image source={require("../../assets/images/settings_icon.png")} />
          ) : (
            <Text style={styles.bottomText}>{strings.progressScreen.signup}</Text>
          )}
        </TouchableOpacity>

        <UserHeader />
        <ProgressPopup />
        <Popup
          textData={strings.popups.pushPermissions}
          action={askPush}
          popupVisible={pushPopupVisible}
          setPopupVisible={setPushPopupVisible}
        />

      </View>

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

  scrollView: {
    // overflow: 'visible',
    flex: 1,
    width: "100%",
  },
  
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
