import React, { memo, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { height, width } from "../../../values/consts";
import { EXIT_SIZE } from "../../screens/ExploreScreen";
var path = require("svg-path-properties");
import Constants from "expo-constants";

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

export const PathSegment = ({ scrollY, index, item }) => {

  const {done, current} = item;

  const markerImage = done ? require("../../../assets/images/path_marker_big.png") : require("../../../assets/images/path_marker_small.png");

  const markerRef = useRef();
  const markerSmallRef = useRef();
  const markerBigRef = useRef();

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
  }, []);

  return (
    <View style={styles.pathContainer(pathHeight, pathWidth)}>
      {current ? (
        <Svg width={pathWidth} height={pathHeight} viewBox={`0 0 ${pathWidth} ${pathHeight}`}>
          <Path d={line} stroke="black" strokeWidth={1} />
          <Path
            d={line}
            stroke="black"
            strokeWidth={2}
            strokeDasharray={lineLength}
            strokeDashoffset={-(1-userProgress) * lineLength}
          />
        </Svg>
      ) : (
        <Svg width={pathWidth} height={pathHeight} viewBox={`0 0 ${pathWidth} ${pathHeight}`}>
          <Path d={line} stroke="black" strokeWidth={done ? 2 : 1} />
        </Svg>
      )}

      {current ? (
        <View style={StyleSheet.absoluteFill}>
          <Image style={styles.marker} ref={markerRef} source={require("../../../assets/images/path_marker.png")} />
          <Image style={styles.marker} ref={markerSmallRef} source={require("../../../assets/images/path_marker_small.png")} />
          <Image style={styles.marker} ref={markerBigRef} source={require("../../../assets/images/path_marker_big.png")} />
        </View>
      ) : (
        <View style={StyleSheet.absoluteFill}>
          <Image style={styles.marker} ref={markerSmallRef} source={markerImage} />
          <Image style={styles.marker} ref={markerBigRef} source={markerImage} />
        </View>
      )}

      <Animated.Image style={styles.trees(pathHeight, pathWidth, opacity, opacity)} source={require("../../../assets/images/trees.png")} />
      
    </View>
  );
};

// path_marker - 65 × 72
// trees - 52 × 82

const styles = StyleSheet.create({

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
