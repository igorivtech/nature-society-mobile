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
} from "react-native";
import { UserContext } from "../../context/context";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import { EXIT_SIZE } from "../screens/ExploreScreen";
import { PathSegment, pathHeight } from "../views/progress/PathSegment";

export const ProgressScreen = ({ navigation }) => {

  const [data, setData] = useState([]);
  const scrollView = useRef();

  const {state, dispatch} = useContext(UserContext);
  const {user} = state;

  const scrollY = useRef(new Animated.Value(0)).current;

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
          renderItem={({item, index})=><PathSegment index={index} scrollY={scrollY} item={item} />}
         />
        
        <TouchableOpacity style={styles.bottomButtonContainer} onPress={loginLogout}>
          {user ? (
            <Image source={require("../../assets/images/settings_icon.png")} />
          ) : (
            <Text style={styles.bottomText}>{strings.progressScreen.signup}</Text>
          )}
        </TouchableOpacity>

        <UserHeader />

      </View>

      <SafeAreaView style={styles.bottomSafeAreaStyle} />
    </View>
  );
};

const UserHeader = ({}) => {

  const {state} = useContext(UserContext);
  const {user} = state;

  return (
    <View style={styles.userHeader}>

      <View style={styles.headerNameContainer}>
        <View style={styles.headerTextsContainer}>
          <Text style={textStyles.boldOfSize(24)}>{user ? user.name : strings.guest}</Text>
          <Text style={textStyles.normalOfSize(18)}>{user ? user.lastAchievement : ""}</Text>
        </View>
        <Image source={require("../../assets/images/flag_icon.png")} />
      </View>

      <View style={{
        marginTop: 24
      }}>
        <HeaderDetail value={user ? user.numOfReports : 0} title={strings.progressScreen.reportsTitle} icon={require("../../assets/images/header_reports_icon.png")} />
        <HeaderDetail value={user ? user.points : 0} title={strings.progressScreen.pointsTitle} icon={require("../../assets/images/header_points_icon.png")} />
      </View>
      
    </View>
  )
}

const HeaderDetail = ({icon, value, title}) => {
  return (
    <View style={{
      marginBottom: 12,
      alignItems: 'flex-end'
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}>

        <Text style={{
          ...textStyles.normalOfSize(24),
          color: colors.userHeader
        }}>{value}</Text>

        <Image style={{
          marginLeft: 4,
          height: 19,
          width: 19,
          resizeMode: 'contain'
        }} source={icon} />
      </View>

      <Text style={{
        marginTop: 4,
        ...textStyles.normalOfSize(14),
        color: colors.userHeader
      }}>{title}</Text>
      
    </View>
  )
}

const styles = StyleSheet.create({

  headerNameContainer: {
    flexDirection: 'row'
  },

  headerTextsContainer: {
    justifyContent: 'space-between',
    marginRight: 12
  },

  userHeader: {
    top: 30,
    right: 30,
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
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
