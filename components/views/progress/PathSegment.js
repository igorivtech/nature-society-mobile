import React, { memo, useEffect, useRef, useState } from "react";
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
const userProgress = 0.5;
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
const TOP_CONTAINER_WIDTH = 100;
const BOTTOM_CONTAINER_WIDTH = 100;
const CONTAINER_MARGIN = 8;

export const PathSegment = ({ scrollY, index, item }) => {

  const {done, current} = item;

  const markerImage = done ? largeIcon : smallIcon;

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
  }, []);

  const setupTop = () => {
    const pSmall = properties.getPointAtLength(lineLength * topMarkerPosition);
    const iconSize = current ? 34 : done ? 76 : 34;
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
        {translateX: -iconSize/2 - TOP_CONTAINER_WIDTH - CONTAINER_MARGIN},
        {translateY: -CONTAINER_HEIGHT/2}
      ]
    })
  }

  const setupBottom = () => {
    const pBig = properties.getPointAtLength(lineLength * bottomMarkerPosition);
    const iconSize = current ? 76 : done ? 76 : 34;
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
        {translateX: iconSize / 2 + CONTAINER_MARGIN},
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
          <Path d={line} stroke={colors.path} strokeWidth={done ? DONE_WIDTH : PATH_WIDTH} />
        </Svg>
      )}

      <View style={StyleSheet.absoluteFill}>
        {current && (
          <Image style={styles.marker} ref={markerRef} source={require("../../../assets/images/path_marker.png")} />
        )}
        <Image style={styles.marker} ref={markerSmallRef} source={current ? smallIcon : markerImage} />
        <Image style={styles.marker} ref={markerBigRef} source={current ? largeIcon : markerImage} />
        <View style={styles.topContainer} ref={topContainerRef}>
          <FloatingLabel item={item} />
        </View>
        <View style={styles.bottomContainer} ref={bottomContainerRef}>
          <FloatingLabel item={item} />
        </View>
      </View>
      
      <Animated.Image style={styles.trees(pathHeight, pathWidth, opacity, opacity)} source={require("../../../assets/images/trees.png")} />
      
    </View>
  );
};

const FloatingLabel = ({item}) => {
  console.log(item);
  return (
    <View>
      <Text>{item.bottomTitle}</Text>
    </View>
  )
}

// path_marker - 65 × 72
// trees - 52 × 82

const styles = StyleSheet.create({

  topContainer: {
    position: 'absolute',
    height: CONTAINER_HEIGHT,
    width: TOP_CONTAINER_WIDTH,
    backgroundColor: 'cyan',
    alignItems: 'center',
    justifyContent: 'center'
  },

  bottomContainer: {
    position: 'absolute',
    height: CONTAINER_HEIGHT,
    width: BOTTOM_CONTAINER_WIDTH,
    backgroundColor: 'orange',
    alignItems: 'center',
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
