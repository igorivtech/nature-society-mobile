import React, { memo, useEffect, useRef, useState } from "react";
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
import { height, width } from "../../values/consts";
import Svg, { Path } from "react-native-svg";
var path = require("svg-path-properties");

const pathPadding = 0;

export const ProgressScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [pathHeight, setPathHeight] = useState(0);
  const [pathWidth, setPathWidth] = useState(0);

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
          onLayout={(e) => {
            setPathHeight(e.nativeEvent.layout.height);
            setPathWidth(e.nativeEvent.layout.width);
          }}
          style={styles.scrollView}
        >
          <PathSegment
            done={false}
            pathHeight={pathHeight}
            pathWidth={pathWidth}
          />
          <PathSegment
            done={false}
            pathHeight={pathHeight}
            pathWidth={pathWidth}
          />
          <PathSegment
            done={false}
            pathHeight={pathHeight}
            pathWidth={pathWidth}
          />
          <PathSegment
            current={true}
            pathHeight={pathHeight}
            pathWidth={pathWidth}
          />
          <PathSegment
            done={true}
            pathHeight={pathHeight}
            pathWidth={pathWidth}
          />
          <PathSegment
            done={true}
            pathHeight={pathHeight}
            pathWidth={pathWidth}
          />
          <PathSegment
            done={true}
            pathHeight={pathHeight}
            pathWidth={pathWidth}
          />
        </ScrollView>

        <TouchableOpacity
          onPress={loginLogout}
          style={styles.bottomButtonContainer}
        >
          {user ? (
            <Image source={require("../../assets/images/settings_icon.png")} />
          ) : (
            <Text style={styles.bottomText}>
              {strings.progressScreen.signup}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.bottomSafeAreaStyle} />
    </View>
  );
};

const PathSegment = memo(({ current = false, done = false, pathHeight, pathWidth }) => {
    const markerImage = done ? require("../../assets/images/path_marker_big.png") : require("../../assets/images/path_marker_small.png");

    const topMarkerPosition = 0.2;
    const userProgress = 0.5;
    const bottomMarkerPosition = 0.8;

    const markerRef = useRef();
    const markerSmallRef = useRef();
    const markerBigRef = useRef();
    const [markerHeight, setMarkerHeight] = useState(0);
    const [markerWidth, setMarkerWidth] = useState(0);

    const line = `
    M${pathWidth / 2},0
    C${pathWidth - pathPadding},${pathHeight * 0.25}
    ${pathPadding},${pathHeight * 0.75}
    ${pathWidth / 2},${pathHeight}
  `;
    const properties = path.svgPathProperties(line);
    const lineLength = properties.getTotalLength();

    useEffect(() => {
      if (pathHeight > 0 && markerHeight > 0 && markerWidth > 0) {
        const { x, y } = properties.getPointAtLength(lineLength * userProgress);
        markerRef.current.setNativeProps({
          top: y,
          left: x,
          transform: [
            { translateY: -markerHeight },
            { translateX: -markerWidth / 2 },
          ],
        });
      }
    }, [pathHeight, markerHeight, markerWidth]);

    useEffect(() => {
      if (pathHeight > 0) {
        // small
        const pSmall = properties.getPointAtLength(lineLength * topMarkerPosition);
        markerSmallRef.current.setNativeProps({
          top: pSmall.y,
          left: pSmall.x,
          transform: [
            { translateY: -(current ? 34 : done ? 76 : 34) / 2 },
            { translateX: -(current ? 34 : done ? 76 : 34) / 2 },
          ],
        });
        // big
        const pBig = properties.getPointAtLength(lineLength * bottomMarkerPosition);
        markerBigRef.current.setNativeProps({
          top: pBig.y,
          left: pBig.x,
          transform: [
            { translateY: -(current ? 76 : done ? 76 : 34) / 2 },
            { translateX: -(current ? 76 : done ? 76 : 34) / 2 },
          ],
        });
      }
    }, [pathHeight]);

    if (pathHeight === 0) {
      return <View />;
    }

    return (
      <View style={styles.pathContainer(pathHeight, pathWidth)}>
        {current ? (
          <Svg>
            <Path d={line} stroke="black" strokeWidth={1} />
            <Path
              d={line}
              stroke="black"
              strokeWidth={2}
              strokeDasharray={lineLength}
              strokeDashoffset={-userProgress * lineLength + markerHeight / 2}
            />
          </Svg>
        ) : (
          <Svg>
            <Path d={line} stroke="black" strokeWidth={done ? 2 : 1} />
          </Svg>
        )}

        {current ? (
          <View style={StyleSheet.absoluteFill}>
            <Image
              style={styles.marker}
              onLayout={(e) => {
                setMarkerHeight(e.nativeEvent.layout.height);
                setMarkerWidth(e.nativeEvent.layout.width);
              }}
              ref={markerRef}
              source={require("../../assets/images/path_marker.png")}
            />
            <Image style={styles.marker} ref={markerSmallRef} source={require("../../assets/images/path_marker_small.png")} />
            <Image style={styles.marker} ref={markerBigRef} source={require("../../assets/images/path_marker_big.png")} />
          </View>
        ) : (
          <View style={StyleSheet.absoluteFill}>
            <Image style={styles.marker} ref={markerSmallRef} source={markerImage} />
            <Image style={styles.marker} ref={markerBigRef} source={markerImage} />
          </View>
        )}
      
      </View>
    );
  }
);

const styles = StyleSheet.create({
  marker: {
    position: "absolute",
  },

  scrollView: {
    flex: 1,
    width: "100%",
  },

  pathContainer: (height, width) => ({
    height,
    width,
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
