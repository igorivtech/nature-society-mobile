import React, { memo, useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Animated,
  Text,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { height, width } from "../../../values/consts";
import { EXIT_SIZE } from "../../screens/ExploreScreen";
var path = require("svg-path-properties");
import Constants from "expo-constants";
import { colors } from "../../../values/colors";
import { textStyles } from "../../../values/textStyles";
import { UserContext } from "../../../context/context";
import * as Animatable from "react-native-animatable";

export const pathHeight = height-2*Constants.statusBarHeight - 2*30;
const pathPadding = 0;
const animationPadding = height * 0.4;
const animationCenterExtra = 70;
//
const pathWidth = width - EXIT_SIZE;
const pathXCenter = pathWidth*0.3
const pathTWidth = pathHeight * 0.3;
//
const topMarkerPosition = 0.15;
let userProgress = 0.5;
const bottomMarkerPosition = 0.8;
//
const markerHeight = 72;
const markerWidth = 65;
//
const PATH_WIDTH = 1.5;
const DONE_WIDTH = 3;

const smallIcon = require("../../../assets/images/path_marker_small.png");
const largeIcon = require("../../../assets/images/path_marker_big.png");

const CONTAINER_HEIGHT = 44;
const TOP_CONTAINER_WIDTH = 55;
const BOTTOM_CONTAINER_WIDTH = 70;
const TOP_CONTAINER_MARGIN = 14;
const BOTTOM_CONTAINER_MARGIN = 12;

export const PathSegment = ({ scrollY, index, item, popupVisible }) => {

  const {state} = useContext(UserContext);
  const {user} = state;

  const {topDone, bottomDone, current} = item;

  const topMarkerImage = topDone ? largeIcon : smallIcon;
  const bottomMarkerImage = bottomDone ? largeIcon : smallIcon;

  const markerRef = useRef();
  const markerSmallRef = useRef();
  const markerBigRef = useRef();
  const topContainerRef = useRef();
  const bottomContainerRef = useRef();

  const line = `
    M${pathTWidth/2},0
    C${pathTWidth},${pathHeight * 0.25}
    ${0},${pathHeight * 0.75}
    ${pathTWidth/2},${pathHeight}
  `;

  const properties = path.svgPathProperties(line);
  const lineLength = properties.getTotalLength();

  const inputRange = [
    (index - 1) * pathHeight + animationPadding, 
    index * pathHeight - animationCenterExtra, 
    index * pathHeight, 
    index * pathHeight + animationCenterExtra, 
    (index + 1) * pathHeight - animationPadding
  ]

  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [0, 1, 1, 1, 0],
    extrapolate: 'clamp'
  })

  if (user && current) {
    if (!bottomDone) {
      userProgress = 0.1;
    } else if (!topDone) {
      userProgress = 1 - (0.25 + 0.5 * (item.topPoints - user.points)/item.topPoints);
    }
  }

  useEffect(() => {
    if (current) {
      const { x, y } = properties.getPointAtLength(lineLength * (1-userProgress));
      markerRef.current.setNativeProps({
        top: y,
        left: x,
        transform: [
          { translateY: -markerHeight + 12 },
          { translateX: (-markerWidth / 2) },
        ],
      });
    }
    setupTop();
    setupBottom();
  });

  const setupTop = () => {
    const pSmall = properties.getPointAtLength(lineLength * topMarkerPosition);
    const iconSize = current ? 34 : topDone ? 76 : 34;
    const translateY = -iconSize / 2;
    const translateX = -iconSize / 2;
    markerSmallRef.current.setNativeProps({
      top: pSmall.y,
      left: pSmall.x,
      transform: [{ translateY }, { translateX }]
    });
    topContainerRef.current.setNativeProps({
      top: pSmall.y,
      left: pSmall.x,
      transform: [
        {translateX: -iconSize/2 - TOP_CONTAINER_WIDTH - TOP_CONTAINER_MARGIN},
        {translateY: -CONTAINER_HEIGHT/2}
      ]
    })
  }

  const setupBottom = () => {
    const pBig = properties.getPointAtLength(lineLength * bottomMarkerPosition);
    const iconSize = current ? 76 : bottomDone ? 76 : 34;
    const translateY = -iconSize / 2;
    const translateX = -iconSize / 2;
    markerBigRef.current.setNativeProps({
      top: pBig.y,
      left: pBig.x,
      transform: [{ translateY }, { translateX }]
    });
    bottomContainerRef.current.setNativeProps({
      top: pBig.y,
      left: pBig.x,
      transform: [
        {translateX: iconSize / 2 + BOTTOM_CONTAINER_MARGIN},
        {translateY: -CONTAINER_HEIGHT/2}
      ]
    })
  }

  return (
    <View style={styles.pathContainer(pathHeight, pathWidth)}>
      {current ? (
        <Svg width={pathWidth} height={pathHeight} viewBox={`0 0 ${pathWidth} ${pathHeight}`}>
          <Path d={line} stroke={colors.path} strokeWidth={PATH_WIDTH} />
          <Path
            d={line}
            stroke={colors.path}
            strokeWidth={DONE_WIDTH}
            strokeDasharray={lineLength}
            strokeDashoffset={-(1-userProgress) * lineLength}
          />
        </Svg>
      ) : (
        <Svg width={pathWidth} height={pathHeight} viewBox={`0 0 ${pathWidth} ${pathHeight}`}>
          <Path d={line} stroke={colors.path} strokeWidth={(topDone && bottomDone) ? DONE_WIDTH : PATH_WIDTH} />
        </Svg>
      )}

      <View style={StyleSheet.absoluteFill}>
        {current && (
          <View style={markerStyles.markerContainer} ref={markerRef}>
            <Image style={markerStyles.markerIcon} source={require("../../../assets/images/path_marker.png")} />
            <Image source={user !== null ? {uri: user.image} : null} style={markerStyles.profilePic} />
          </View>
        )}
        <Image style={styles.marker} ref={markerSmallRef} source={current ? smallIcon : topMarkerImage} />
        <Image style={styles.marker} ref={markerBigRef} source={current ? largeIcon : bottomMarkerImage} />
        <View style={styles.topContainer} ref={topContainerRef}>
          <FloatingLabel title={item.topTitle} points={item.topPoints} right={true} done={item.topDone} />
        </View>
        <Animatable.View animation={popupVisible ? "fadeOut" : "fadeIn"} style={styles.bottomContainer} ref={bottomContainerRef}>
          <FloatingLabel title={item.bottomTitle} points={item.bottomPoints} right={false} done={item.bottomDone} />
        </Animatable.View>
      </View>
      
      <Animated.Image style={styles.trees(pathHeight, pathWidth, opacity, opacity)} source={require("../../../assets/images/trees.png")} />
      
    </View>
  );
};

const FloatingLabel = ({right, done, points, title}) => {

  const {state} = useContext(UserContext);
  const {user} = state;

  return (
    <View style={flStyles.container(right)}>
      {done ? (
        <View style={flStyles.doneContainer(right)}>
          <Text style={flStyles.doneText}>{title}</Text>
          <View style={flStyles.doneBorder} />
        </View>
      ) : (
        <View style={flStyles.notDoneContainer(right)}>
          <Text style={flStyles.notDoneTitle}>{title}</Text>
          <View style={flStyles.notDoneBorder} />
          <View style={flStyles.notDoneInnerContainer}>
            <Text style={flStyles.notDoneInnerText}>{user ? (points - user.points) : ""}</Text>
            <Image source={require("../../../assets/images/floating_marker.png")} />
          </View>
        </View>
      )}
    </View>
  )
}

// path_marker - 65 × 72
// trees - 52 × 82

const flStyles = StyleSheet.create({

  notDoneInnerText: {
    ...textStyles.normalOfSize(10),
    color: colors.pathNotDone
  },

  notDoneInnerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  notDoneBorder: {
    marginVertical: 2,
    backgroundColor: colors.lighterShade,
    height: 1,
    alignSelf: 'stretch'
  },

  notDoneTitle: {
    ...textStyles.normalOfSize(11),
    color: colors.lighterShade
  },

  notDoneContainer: (right) => ({
    alignItems: right ? 'flex-start' : 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'center'
  }),

  container: (right) => ({
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: right ? 'flex-start' : 'flex-end'
  }),
  doneContainer: (right) => ({
    alignItems: right ? 'flex-start' : 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'center'
  }),
  doneText: {
    ...textStyles.boldOfSize(14),
    color: colors.treeBlues
  },
  doneBorder: {
    backgroundColor: colors.treeBlues,
    height: 1,
    alignSelf: 'stretch'
  }
})

export const markerStyles = StyleSheet.create({

  markerIcon: {
    position: 'absolute'
  },

  profilePic: {
    marginTop: 11,
    backgroundColor: 'white',
    width: 31.2,
    height: 31.2,
    borderRadius: 31.2/2
  },

  markerContainer: {
    zIndex: 2,
    position: 'absolute',
    height: 72,
    width: 65,
    alignItems: 'center'
  },
})


const styles = StyleSheet.create({

  topContainer: {
    ...StyleSheet.absoluteFill,
    height: CONTAINER_HEIGHT,
    width: TOP_CONTAINER_WIDTH,
    justifyContent: 'center'
  },

  bottomContainer: {
    ...StyleSheet.absoluteFill,
    height: CONTAINER_HEIGHT,
    width: BOTTOM_CONTAINER_WIDTH,
    justifyContent: 'center'
  },

  trees: (pathHeight, pathWidth, opacity, scale) => ({
    position: 'absolute',
    top: pathHeight/2,
    left: pathWidth / 2 + 52/2,
    opacity,
    transform: [ {scale} ]
  }),

  marker: {
    position: "absolute",
  },

  pathContainer: (height, width) => ({
    height,
    width,
  }),

});
