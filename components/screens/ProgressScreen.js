import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import { EXIT_SIZE } from "../screens/ExploreScreen";
import { PathSegment } from "../views/progress/PathSegment";

export const ProgressScreen = ({ navigation, route }) => {

  const scrollView = useRef();

  const [user, setUser] = useState(null);
  const [pathHeight, setPathHeight] = useState(0);
  const [pathWidth, setPathWidth] = useState(0);

  useEffect(()=>{
    if (pathHeight > 0) {
      scrollView.current.scrollTo({
        y: pathHeight * 3 + 400,
        animated: false,
      })  
      setTimeout(() => {
        scrollView.current.scrollTo({
          y: pathHeight * 3,
          animated: true,
        })  
      }, 600);
    }
  }, [pathHeight])

  useEffect(() => {
    if (route.params) {
      if (route.params.user !== null) {
        setUser(route.params.user);
      } else if (route.params.logout) {
        setUser(null);
      }
    }
  }, [route]);

  const goBack = () => {
    navigation.goBack();
  };

  const loginLogout = () => {
    if (user === null) {
      navigation.navigate("Login");
    } else {
      navigation.navigate("Profile", { user });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={goBack} style={styles.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <SafeAreaView />

      <View style={styles.progressScreenContainer}>
        <ScrollView
          ref={scrollView}
          onLayout={(e) => {
            setPathHeight(e.nativeEvent.layout.height);
            setPathWidth(e.nativeEvent.layout.width);
          }}
          style={styles.scrollView}
        >
          <PathSegment done={false} pathHeight={pathHeight} pathWidth={pathWidth} />
          <PathSegment done={false} pathHeight={pathHeight} pathWidth={pathWidth} />
          <PathSegment done={false} pathHeight={pathHeight} pathWidth={pathWidth} />
          <PathSegment current={true} pathHeight={pathHeight} pathWidth={pathWidth} />
          <PathSegment done={true} pathHeight={pathHeight} pathWidth={pathWidth} />
          <PathSegment done={true} pathHeight={pathHeight} pathWidth={pathWidth} />
          <PathSegment done={true} pathHeight={pathHeight} pathWidth={pathWidth} />
        </ScrollView>

        <TouchableOpacity style={styles.bottomButtonContainer} onPress={loginLogout}>
          {user ? (
            <Image source={require("../../assets/images/settings_icon.png")} />
          ) : (
            <Text style={styles.bottomText}>{strings.progressScreen.signup}</Text>
          )}
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.bottomSafeAreaStyle} />
    </View>
  );
};

const styles = StyleSheet.create({

  scrollView: {
    overflow: 'visible',
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
    overflow: 'hidden',
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
