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
import { SAVE_NOTIFICATION } from "../../context/userReducer";
import { colors } from "../../values/colors";
import { DEFAULT_NOTIFICATION, height } from "../../values/consts";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import { EXIT_SIZE } from "../screens/ExploreScreen";
import { PathSegment, pathHeight } from "../views/progress/PathSegment";
import { UserHeader } from "../views/progress/views";

export const ProgressScreen = ({ navigation }) => {

  const [popupVisible, setPopupVisible] = useState(false);
  const [data, setData] = useState([]);
  const scrollView = useRef();

  const {state, dispatch} = useContext(UserContext);
  const {user, notification} = state;

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(()=> {
    // DEBUG
    setTimeout(() => {
      dispatch({
        type: SAVE_NOTIFICATION,
        payload: DEFAULT_NOTIFICATION
      })
    }, 4000);
  }, [])

  useEffect(()=>{
    setPopupVisible(notification != null);
  }, [notification])

  useEffect(()=>{
    if (user) {
      if (user.achievements) {
        setData([...user.achievements].reverse());
      }
    } else {
      setData([])
      setTimeout(() => {
        setData([{
          current: true,
          done: false
        }])  
      }, 0);
    }
  }, [user])

  useEffect(()=>{
    if (data.length > 0) {
      const currentIndex = data.findIndex(achievement=>achievement.current);
      setTimeout(()=>{
        scrollView.current.scrollToOffset({
          offset: pathHeight * currentIndex + 400,
          animated: false,
        });  
        setTimeout(() => {
          scrollView.current.scrollToOffset({
            offset: pathHeight * currentIndex,
            animated: true,
          })  
        }, 700);
      }, 0)
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

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={goBack} style={styles.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <SafeAreaView />

      <View style={styles.progressScreenContainer}>
        <Animated.FlatList
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
          renderItem={({item, index})=><PathSegment popupVisible={popupVisible} index={index} scrollY={scrollY} item={item} />}
         />
        
        <TouchableOpacity style={styles.bottomButtonContainer} onPress={loginLogout}>
          {user ? (
            <Image source={require("../../assets/images/settings_icon.png")} />
          ) : (
            <Text style={styles.bottomText}>{strings.progressScreen.signup}</Text>
          )}
        </TouchableOpacity>

        <UserHeader />
        <Popup />

      </View>

      <SafeAreaView style={styles.bottomSafeAreaStyle} />
    </View>
  );
};

const Popup = () => {

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

  return (
    <Animated.View style={{
      transform: [
        {scale}
      ],
      opacity: scale,
      width: 180,
      height: 160,
      backgroundColor: 'cyan',
      position: 'absolute',
      right: 30,
      bottom: height * 0.25,
      ...styles.shadow
    }}>
      
    </Animated.View>
  )
}


const styles = StyleSheet.create({

  shadow: {
    shadowOffset: {
      height: -4,
      width: 0,
    },
    shadowColor: "rgba(0, 0, 0, 0.035)",
    shadowRadius: 12,
    shadowOpacity: 1,
  },


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
    borderTopRightRadius: 30,
    flex: 1,
    backgroundColor: "white",
    marginRight: EXIT_SIZE,
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
